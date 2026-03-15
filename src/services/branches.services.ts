import {
  collection,
  onSnapshot,
  type Unsubscribe,
  type FirestoreError,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import type { Branch, BranchDoc, JobPositionDoc } from "@/types";

export const subscribeToBranches = (
  callback: (branches: Branch[]) => void,
  errorCallback?: (error: FirestoreError) => void,
  finallyCallback?: () => void
): Unsubscribe | FirestoreError | void => {
  const refBranches = collection(firestore, "branches");

  return onSnapshot(
    refBranches,
    async (snapshot) => {
      const branches: Branch[] = await Promise.all(
        snapshot.docs.map(async (branchDoc) => {
          const branchData = branchDoc.data() as BranchDoc;
          const jobsRef = collection(firestore, "branches", branchDoc.id, "jobsPositions");
          const jobsSnapshot = await getDocs(jobsRef);

          const jobsPositions = jobsSnapshot.docs.map((jobDoc) => {
            const jobData = jobDoc.data() as JobPositionDoc;
            return {
              id: jobDoc.id,
              // Compatibilidad con modelo anterior consumido por la UI
              name: jobData.name ?? jobData.nombre ?? "",
              description: jobData.description ?? jobData.descripcion ?? "",
            };
          });

          return {
            id: branchDoc.id,
            // Compatibilidad con modelo anterior consumido por la UI
            name: branchData.name ?? branchData.sector ?? "",
            description: branchData.description ?? branchData.descripcion_sector ?? "",
            jobsPositions,
          };
        })
      );

      callback(branches);
    },
    errorCallback,
    finallyCallback
  );
};

export const addBranch = (branch: Branch): void => {
  // Implement the logic to add a branch
  void branch;
};

export const getBranchById = async (id: string): Promise<Branch | null> => {
  const refBranches = collection(firestore, "branches");
  const refDoc = doc(refBranches, id);
  const docSnap = await getDoc(refDoc);
  const refJobsPositions = collection(firestore, "branches", id, "jobsPositions");

  const jobsSnapshot = await getDocs(refJobsPositions);
  if (docSnap.exists()) {
    const branchData = docSnap.data() as BranchDoc;
    const jobsPositions = jobsSnapshot.docs.map((jobDoc) => {
      const jobData = jobDoc.data() as JobPositionDoc;
      return {
        id: jobDoc.id,
        name: jobData.name ?? jobData.nombre ?? "",
        description: jobData.description ?? jobData.descripcion ?? "",
      };
    });
    return {
      id: docSnap.id,
      name: branchData.name ?? branchData.sector ?? "",
      description: branchData.description ?? branchData.descripcion_sector ?? "",
      jobsPositions,
    };
  }
  return null;
};
export const updateBranchById = (id: string): Partial<Branch> | undefined => {
  // Implement the logic to get a branch by its ID
  void id;
  return undefined;
};

export const removeBranchById = (id: string): Branch | undefined => {
  // Implement the logic to get a branch by its ID
  void id;
  return undefined;
};
