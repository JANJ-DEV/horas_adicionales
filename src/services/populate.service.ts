import { collection, doc, setDoc, type Firestore } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";

export interface Collections {
  RAMAS: string;
  USERS: string;
  JOB_PROFILES: string;
  JOBS_POSITIONS: string;
  RECORDS: string;
  BRANCHES: string;
}

export const COLLECTIONS: Collections = {
  RAMAS: "ramas",
  USERS: "users",
  JOB_PROFILES: "jobProfiles",
  JOBS_POSITIONS: "jobsPositions",
  RECORDS: "records",
  BRANCHES: "branches",
};

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Pobla una colección creando 1 documento por cada key del primer nivel del JSON.
 * Ejemplo:
 * {
 *   "COM-01": { ... },
 *   "FIN-02": { ... }
 * }
 * => crea docs "COM-01" y "FIN-02".
 */
export async function populateCollectionFromFirstLevel(
  db: Firestore,
  collectionName: string,
  jsonData: unknown
) {
  if (!isJsonObject(jsonData)) {
    throw new Error("El JSON debe ser un objeto en el primer nivel.");
  }

  const ref = collection(db, collectionName);
  const entries = Object.entries(jsonData);

  if (entries.length === 0) {
    console.warn(`No hay datos para poblar la colección ${collectionName}.`);
    return;
  }

  try {
    await Promise.all(
      entries.map(async ([documentId, content]) => {
        if (!isJsonObject(content)) {
          throw new Error(`El contenido de "${documentId}" debe ser un objeto JSON.`);
        }

        await setDoc(doc(ref, documentId), content);
      })
    );

    console.log(
      `Colección ${collectionName} poblada correctamente con ${entries.length} documentos.`
    );
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error("Error al poblar la colección:", { ...firebaseError });
    throw firebaseError;
  }
}

/**
 * Función específica para branches.
 * Soporta dos formas:
 * 1) { "COM-01": { ... } }
 * 2) { "branches": { "COM-01": { ... } } }
 */
export async function populateBranches(db: Firestore, branchesJson: unknown) {
  if (!isJsonObject(branchesJson)) {
    throw new Error("El JSON de branches no tiene formato válido.");
  }

  const root = branchesJson.branches;
  const branchesData = isJsonObject(root) ? root : branchesJson;

  await populateCollectionFromFirstLevel(db, COLLECTIONS.BRANCHES, branchesData);
}

/**
 * Función específica para jobs positions.
 * Soporta dos formas:
 * 1) { "COM-01-01": { ... } }
 * 2) { "jobsPosition": { "COM-01-01": { ... } }
 * 3) { "jobsPositions": { "COM-01-01": { ... } }
 */
export async function populateJobsPositions(db: Firestore, jobsPositionsJson: unknown) {
  if (!isJsonObject(jobsPositionsJson)) {
    throw new Error("El JSON de jobs positions no tiene formato válido.");
  }

  const wrapped = jobsPositionsJson.jobsPosition ?? jobsPositionsJson.jobsPositions;
  const jobsPositionsData = isJsonObject(wrapped) ? wrapped : jobsPositionsJson;

  await populateCollectionFromFirstLevel(db, COLLECTIONS.JOBS_POSITIONS, jobsPositionsData);
}

function extractBranchIdFromJobId(jobId: string): string | null {
  const parts = jobId.split("-");
  if (parts.length < 3) return null;
  return `${parts[0]}-${parts[1]}`;
}

/**
 * Pobla el catálogo completo:
 * 1) branches/{branchId}
 * 2) branches/{branchId}/jobsPositions/{jobId}
 *
 * Relación:
 * - Se intenta usar `branchId` dentro del job si existe.
 * - Si no existe, se infiere desde el id del job (ej: COM-01-12 => COM-01).
 */
export async function populateBranchesCatalog(
  db: Firestore,
  branchesJson: unknown,
  jobsPositionsJson: unknown
) {
  if (!isJsonObject(branchesJson)) {
    throw new Error("El JSON de branches no tiene formato válido.");
  }

  if (!isJsonObject(jobsPositionsJson)) {
    throw new Error("El JSON de jobs positions no tiene formato válido.");
  }

  const branchesRoot = branchesJson.branches;
  const branchesData = isJsonObject(branchesRoot) ? branchesRoot : branchesJson;

  const jobsRoot = jobsPositionsJson.jobsPositions ?? jobsPositionsJson.jobsPosition;
  const jobsData = isJsonObject(jobsRoot) ? jobsRoot : jobsPositionsJson;

  await populateCollectionFromFirstLevel(db, COLLECTIONS.BRANCHES, branchesData);

  const branchIds = new Set(Object.keys(branchesData));
  const invalidRelations: string[] = [];

  await Promise.all(
    Object.entries(jobsData).map(async ([jobId, jobContent]) => {
      if (!isJsonObject(jobContent)) {
        throw new Error(`El job "${jobId}" debe ser un objeto JSON.`);
      }

      const explicitBranchId = typeof jobContent.branchId === "string" ? jobContent.branchId : null;
      const inferredBranchId = extractBranchIdFromJobId(jobId);
      const branchId = explicitBranchId ?? inferredBranchId;

      if (!branchId || !branchIds.has(branchId)) {
        invalidRelations.push(`${jobId} -> ${branchId ?? "(sin branchId inferible)"}`);
        return;
      }

      const jobsRef = collection(db, COLLECTIONS.BRANCHES, branchId, COLLECTIONS.JOBS_POSITIONS);

      await setDoc(doc(jobsRef, jobId), jobContent);
    })
  );

  if (invalidRelations.length > 0) {
    throw new Error(
      `Se encontraron ${invalidRelations.length} jobs sin rama válida: ${invalidRelations.join(", ")}`
    );
  }

  console.log(
    `Catálogo de branches poblado con ${Object.keys(branchesData).length} ramas y ${Object.keys(jobsData).length} puestos.`
  );
}
