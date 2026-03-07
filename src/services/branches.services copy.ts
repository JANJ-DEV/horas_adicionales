import {
  collection,
  onSnapshot,
  type Unsubscribe,
  type FirestoreError,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { toast } from "react-toastify";
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

      toast.success("Sectores y puestos de trabajo cargados correctamente", {
        containerId: "global",
      });
    },
    errorCallback,
    finallyCallback
  );
};

export const addBranch = (branch: Branch): void => {
  // Implement the logic to add a branch
  toast.info(`Se ha agregado la rama: ${branch.name} `, { containerId: "global" });
};
export const getBranchById = (id: string): Branch | undefined => {
  // Implement the logic to get a branch by its ID
  toast.info(`Se ha obtenido la rama con ID: ${id} `, { containerId: "global" });
  return undefined;
};

export const updateBranchById = (id: string): Branch | undefined => {
  // Implement the logic to get a branch by its ID
  toast.info(`Se ha actualizado la rama con ID: ${id} `, { containerId: "global" });
  return undefined;
};

export const removeBranchById = (id: string): Branch | undefined => {
  // Implement the logic to get a branch by its ID
  toast.info(`Se ha eliminado la rama con ID: ${id} `, { containerId: "global" });
  return undefined;
};
