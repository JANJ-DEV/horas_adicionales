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

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function getUtilitiesRoot(utilitiesJson) {
  if (
    utilitiesJson &&
    typeof utilitiesJson === "object" &&
    utilitiesJson.utilities &&
    typeof utilitiesJson.utilities === "object"
  ) {
    return utilitiesJson.utilities;
  }
  return utilitiesJson;
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

  const rawUtilities = readJson("src/json/utilities.json");
  const utilities = getUtilitiesRoot(rawUtilities);

  if (!isObject(utilities)) {
    throw new Error("Invalid utilities JSON format.");
  }

  const globalUtilities = utilities.global_utilities;
  const branchUtilities = utilities.branch_utilities;
  const utilityDefinitions = utilities.utility_definitions;

  if (!Array.isArray(globalUtilities)) {
    throw new Error("utilities.global_utilities must be an array.");
  }

  if (!isObject(branchUtilities)) {
    throw new Error("utilities.branch_utilities must be an object.");
  }

  if (!isObject(utilityDefinitions)) {
    throw new Error("utilities.utility_definitions must be an object.");
  }

  if (isDryRun) {
    console.log(
      `[dry-run] Ready to seed utilities: ${globalUtilities.length} global, ${Object.keys(branchUtilities).length} branches, ${Object.keys(utilityDefinitions).length} definitions.`
    );
    return;
  }

  const utilitiesRef = collection(db, "utilities");

  await Promise.all([
    setDoc(doc(utilitiesRef, "global_utilities"), { items: globalUtilities }),
    setDoc(doc(utilitiesRef, "branch_utilities"), branchUtilities),
    setDoc(doc(utilitiesRef, "utility_definitions"), utilityDefinitions),
  ]);

  console.log(
    `Utilities seed completed: ${globalUtilities.length} global, ${Object.keys(branchUtilities).length} branches, ${Object.keys(utilityDefinitions).length} definitions.`
  );
}

main().catch((error) => {
  console.error("Utilities seed failed:", error);
  process.exit(1);
});
