import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const isDryRun = process.argv.includes("--dry-run");
const projectRoot = process.cwd();

function parseEnvFile(content) {
  const env = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function loadDotEnv() {
  const envCandidates = [".env.local", ".env"];
  for (const fileName of envCandidates) {
    const filePath = path.join(projectRoot, fileName);
    if (!fs.existsSync(filePath)) continue;

    const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function readJson(relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getJobsRoot(jobsJson) {
  if (jobsJson && typeof jobsJson === "object") {
    if (jobsJson.jobsPositions && typeof jobsJson.jobsPositions === "object") {
      return jobsJson.jobsPositions;
    }
    if (jobsJson.jobsPosition && typeof jobsJson.jobsPosition === "object") {
      return jobsJson.jobsPosition;
    }
  }
  return jobsJson;
}

function getBranchesRoot(branchesJson) {
  if (
    branchesJson &&
    typeof branchesJson === "object" &&
    branchesJson.branches &&
    typeof branchesJson.branches === "object"
  ) {
    return branchesJson.branches;
  }
  return branchesJson;
}

function extractBranchIdFromJobId(jobId) {
  const parts = String(jobId).split("-");
  if (parts.length < 3) return null;
  return `${parts[0]}-${parts[1]}`;
}

async function main() {
  loadDotEnv();

  const firebaseConfig = {
    apiKey: requireEnv("VITE_API_KEY"),
    authDomain: requireEnv("VITE_AUTH_DOMAIN"),
    databaseURL: process.env.VITE_DATABASE_URL,
    projectId: requireEnv("VITE_PROJECT_ID"),
    storageBucket: requireEnv("VITE_STORAGE_BUCKET"),
    messagingSenderId: requireEnv("VITE_MESSAGING_SENDER_ID"),
    appId: requireEnv("VITE_APP_ID"),
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const branchesJson = readJson("src/json/branches.json");
  const jobsJson = readJson("src/json/jobsPositions.json");

  const branches = getBranchesRoot(branchesJson);
  const jobs = getJobsRoot(jobsJson);

  if (!branches || typeof branches !== "object" || Array.isArray(branches)) {
    throw new Error("Invalid branches JSON format.");
  }

  if (!jobs || typeof jobs !== "object" || Array.isArray(jobs)) {
    throw new Error("Invalid jobsPositions JSON format.");
  }

  const branchEntries = Object.entries(branches);
  const jobEntries = Object.entries(jobs);

  const branchIds = new Set(branchEntries.map(([branchId]) => branchId));
  const relationErrors = [];

  for (const [jobId, jobDoc] of jobEntries) {
    if (!jobDoc || typeof jobDoc !== "object" || Array.isArray(jobDoc)) {
      relationErrors.push(`${jobId} -> invalid job object`);
      continue;
    }

    const explicitBranchId =
      typeof jobDoc.branchId === "string" ? jobDoc.branchId : null;
    const inferredBranchId = extractBranchIdFromJobId(jobId);
    const branchId = explicitBranchId ?? inferredBranchId;

    if (!branchId || !branchIds.has(branchId)) {
      relationErrors.push(`${jobId} -> ${branchId ?? "(no branchId)"}`);
    }
  }

  if (relationErrors.length > 0) {
    throw new Error(
      `Invalid branch relation for ${relationErrors.length} jobs: ${relationErrors.join(", ")}`,
    );
  }

  if (isDryRun) {
    console.log(
      `[dry-run] Ready to seed ${branchEntries.length} branches and ${jobEntries.length} jobs.`,
    );
    return;
  }

  for (const [branchId, branchDoc] of branchEntries) {
    await setDoc(doc(collection(db, "branches"), branchId), branchDoc);
  }

  for (const [jobId, jobDoc] of jobEntries) {
    const explicitBranchId =
      typeof jobDoc.branchId === "string" ? jobDoc.branchId : null;
    const inferredBranchId = extractBranchIdFromJobId(jobId);
    const branchId = explicitBranchId ?? inferredBranchId;

    const jobsRef = collection(db, "branches", branchId, "jobsPositions");
    await setDoc(doc(jobsRef, jobId), jobDoc);
  }

  console.log(
    `Seed completed: ${branchEntries.length} branches and ${jobEntries.length} jobs written.`,
  );
}

main().catch((error) => {
  console.error("Catalog seed failed:", error);
  process.exit(1);
});
