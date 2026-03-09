import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";

export type UtilityInputType = "text" | "textarea" | "number" | "select";

export interface UtilityDefinition {
  type: UtilityInputType;
  label: string;
  required?: boolean;
  // Se mantiene por compatibilidad con el JSON actual que trae un typo.
  refquired?: boolean;
  dbKey?: string;
  db_key?: string;
  options?: string[];
}

export type UtilityDefinitionsMap = Record<string, UtilityDefinition>;

export interface BranchUtilityConfig {
  default: string[];
  specific_jobs: Record<string, string[]>;
}

export type BranchUtilitiesMap = Record<string, BranchUtilityConfig>;

export interface UtilitiesCatalog {
  global_utilities: string[];
  branch_utilities: BranchUtilitiesMap;
  utility_definitions: UtilityDefinitionsMap;
}

export type UtilityFieldValue = string | number;

const UTILITIES_COLLECTION = "utilities";
const GLOBAL_UTILITIES_DOC = "global_utilities";
const BRANCH_UTILITIES_DOC = "branch_utilities";
const UTILITY_DEFINITIONS_DOC = "utility_definitions";

const getDefaultCatalog = (): UtilitiesCatalog => ({
  global_utilities: [],
  branch_utilities: {},
  utility_definitions: {},
});

const normalizeCatalog = (rawDocs: Record<string, unknown>): UtilitiesCatalog => {
  const defaultCatalog = getDefaultCatalog();

  const rawGlobal = rawDocs[GLOBAL_UTILITIES_DOC] as { items?: unknown } | undefined;
  const rawBranch = rawDocs[BRANCH_UTILITIES_DOC] as BranchUtilitiesMap | undefined;
  const rawDefinitions = rawDocs[UTILITY_DEFINITIONS_DOC] as UtilityDefinitionsMap | undefined;

  return {
    global_utilities: Array.isArray(rawGlobal?.items)
      ? (rawGlobal.items.filter((item): item is string => typeof item === "string") as string[])
      : defaultCatalog.global_utilities,
    branch_utilities:
      rawBranch && typeof rawBranch === "object" ? rawBranch : defaultCatalog.branch_utilities,
    utility_definitions:
      rawDefinitions && typeof rawDefinitions === "object"
        ? rawDefinitions
        : defaultCatalog.utility_definitions,
  };
};

const removeUtilityFromBranchConfig = (
  branchConfig: BranchUtilityConfig,
  utilityId: string
): BranchUtilityConfig => {
  const filteredDefault = branchConfig.default.filter((id) => id !== utilityId);
  const filteredSpecificJobs = Object.fromEntries(
    Object.entries(branchConfig.specific_jobs).map(([jobId, utilityIds]) => [
      jobId,
      utilityIds.filter((id) => id !== utilityId),
    ])
  );

  return {
    default: filteredDefault,
    specific_jobs: filteredSpecificJobs,
  };
};

const cleanCatalogRefsByUtilityId = (
  catalog: UtilitiesCatalog,
  utilityId: string
): UtilitiesCatalog => {
  const cleanedBranchUtilities = Object.fromEntries(
    Object.entries(catalog.branch_utilities).map(([branchId, branchConfig]) => [
      branchId,
      removeUtilityFromBranchConfig(branchConfig, utilityId),
    ])
  ) as BranchUtilitiesMap;

  return {
    ...catalog,
    global_utilities: catalog.global_utilities.filter((id) => id !== utilityId),
    branch_utilities: cleanedBranchUtilities,
  };
};

export const subscribeToUtilities = (
  callback: (catalog: UtilitiesCatalog) => void,
  onError?: (error: FirestoreError) => void,
  onComplete?: () => void
): Unsubscribe => {
  const refUtilities = collection(firestore, UTILITIES_COLLECTION);

  return onSnapshot(
    refUtilities,
    (snapshot) => {
      const rawDocs = Object.fromEntries(
        snapshot.docs.map((snapshotDoc) => [snapshotDoc.id, snapshotDoc.data()])
      );
      callback(normalizeCatalog(rawDocs));
    },
    onError,
    onComplete
  );
};

export const getUtilityById = (
  utilityId: string,
  catalog: UtilitiesCatalog
): UtilityDefinition | null => {
  return catalog.utility_definitions[utilityId] ?? null;
};

export const getUtilityByIdFromFirestore = async (
  utilityId: string
): Promise<UtilityDefinition | null> => {
  const definitionsRef = doc(firestore, UTILITIES_COLLECTION, UTILITY_DEFINITIONS_DOC);
  const definitionsSnap = await getDoc(definitionsRef);

  if (!definitionsSnap.exists()) {
    return null;
  }

  const definitions = definitionsSnap.data() as UtilityDefinitionsMap;
  return definitions[utilityId] ?? null;
};

export const updateUtilityById = async (
  utilityId: string,
  newData: Partial<UtilityDefinition>
): Promise<UtilityDefinition | null> => {
  const definitionsRef = doc(firestore, UTILITIES_COLLECTION, UTILITY_DEFINITIONS_DOC);
  const definitionsSnap = await getDoc(definitionsRef);

  if (!definitionsSnap.exists()) {
    return null;
  }

  const definitions = definitionsSnap.data() as UtilityDefinitionsMap;
  const currentUtility = definitions[utilityId];

  if (!currentUtility) {
    return null;
  }

  const updatedUtility = {
    ...currentUtility,
    ...newData,
  };

  await setDoc(
    definitionsRef,
    {
      [utilityId]: updatedUtility,
    },
    { merge: true }
  );

  return updatedUtility;
};

export const deleteUtilityById = async (utilityId: string): Promise<boolean> => {
  const globalRef = doc(firestore, UTILITIES_COLLECTION, GLOBAL_UTILITIES_DOC);
  const branchesRef = doc(firestore, UTILITIES_COLLECTION, BRANCH_UTILITIES_DOC);
  const definitionsRef = doc(firestore, UTILITIES_COLLECTION, UTILITY_DEFINITIONS_DOC);

  const [globalSnap, branchesSnap, definitionsSnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(branchesRef),
    getDoc(definitionsRef),
  ]);

  if (!definitionsSnap.exists()) {
    return false;
  }

  const globalItems = (globalSnap.data() as { items?: string[] } | undefined)?.items ?? [];
  const branchUtilities = (branchesSnap.data() as BranchUtilitiesMap | undefined) ?? {};
  const utilityDefinitions = definitionsSnap.data() as UtilityDefinitionsMap;

  if (!utilityDefinitions[utilityId]) {
    return false;
  }

  const cleanedCatalog = cleanCatalogRefsByUtilityId(
    {
      global_utilities: globalItems,
      branch_utilities: branchUtilities,
      utility_definitions: utilityDefinitions,
    },
    utilityId
  );

  const restDefinitions = { ...cleanedCatalog.utility_definitions };
  delete restDefinitions[utilityId];

  await Promise.all([
    setDoc(globalRef, { items: cleanedCatalog.global_utilities }),
    setDoc(branchesRef, cleanedCatalog.branch_utilities),
    setDoc(definitionsRef, restDefinitions),
  ]);

  return true;
};

export const createUtility = async (
  utilityId: string,
  newData: UtilityDefinition
): Promise<UtilityDefinition> => {
  const definitionsRef = doc(firestore, UTILITIES_COLLECTION, UTILITY_DEFINITIONS_DOC);

  await setDoc(
    definitionsRef,
    {
      [utilityId]: newData,
    },
    { merge: true }
  );

  return newData;
};

export const getUtilityByNameTool = (
  utilityName: string,
  catalog?: UtilitiesCatalog
): Promise<UtilityDefinition | null> | UtilityDefinition | null => {
  if (catalog) {
    return getUtilityById(utilityName, catalog);
  }

  return getUtilityByIdFromFirestore(utilityName);
};

export const getUtilitiesCatalogFromFirestore = async (): Promise<UtilitiesCatalog> => {
  const globalRef = doc(firestore, UTILITIES_COLLECTION, GLOBAL_UTILITIES_DOC);
  const branchesRef = doc(firestore, UTILITIES_COLLECTION, BRANCH_UTILITIES_DOC);
  const definitionsRef = doc(firestore, UTILITIES_COLLECTION, UTILITY_DEFINITIONS_DOC);

  const [globalSnap, branchesSnap, definitionsSnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(branchesRef),
    getDoc(definitionsRef),
  ]);

  const rawDocs: Record<string, unknown> = {
    [GLOBAL_UTILITIES_DOC]: globalSnap.exists() ? globalSnap.data() : undefined,
    [BRANCH_UTILITIES_DOC]: branchesSnap.exists() ? branchesSnap.data() : undefined,
    [UTILITY_DEFINITIONS_DOC]: definitionsSnap.exists() ? definitionsSnap.data() : undefined,
  };

  return normalizeCatalog(rawDocs);
};

export const getActiveUtilityIdsForProfile = (
  catalog: UtilitiesCatalog,
  branchId: string | null,
  jobId: string | null
): string[] => {
  const ids = [...catalog.global_utilities];

  if (!branchId) {
    return Array.from(new Set(ids));
  }

  const branchConfig = catalog.branch_utilities[branchId];
  if (!branchConfig) {
    return Array.from(new Set(ids));
  }

  ids.push(...branchConfig.default);

  if (jobId && branchConfig.specific_jobs[jobId]) {
    ids.push(...branchConfig.specific_jobs[jobId]);
  }

  return Array.from(new Set(ids));
};

export const getRequiredUtilityIdsForProfile = (
  catalog: UtilitiesCatalog,
  branchId: string | null,
  jobId: string | null
): string[] => {
  const activeIds = getActiveUtilityIdsForProfile(catalog, branchId, jobId);
  return activeIds.filter((utilityId) => {
    const definition = catalog.utility_definitions[utilityId];
    return Boolean(definition?.required ?? definition?.refquired);
  });
};
