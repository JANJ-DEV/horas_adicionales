import {
  collection,
  onSnapshot,
  type Unsubscribe,
  type FirestoreError,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { Branch, BranchData } from "@/types";

type BranchDoc = {
  id?: string;
  name?: string;
  description?: string;
  sector?: string;
  descripcion_sector?: string;
};

type JobPositionDoc = {
  id?: string;
  name?: string;
  description?: string;
  nombre?: string;
  descripcion?: string;
};

export const subscribeToBranches = (
  callback: (branches: BranchData) => void,
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
          const jobsRef = collection(
            firestore,
            "branches",
            branchDoc.id,
            "jobsPositions"
          );
          const jobsSnapshot = await getDocs(jobsRef);

          const puestos_de_trabajo = jobsSnapshot.docs.map((jobDoc) => {
            const jobData = jobDoc.data() as JobPositionDoc;
            return {
              id: jobDoc.id,
              // Compatibilidad con modelo anterior consumido por la UI
              nombre: jobData.name ?? jobData.nombre ?? "",
              descripcion: jobData.description ?? jobData.descripcion ?? "",
            };
          });

          return {
            id: branchDoc.id,
            // Compatibilidad con modelo anterior consumido por la UI
            sector: branchData.name ?? branchData.sector ?? "",
            descripcion_sector:
              branchData.description ?? branchData.descripcion_sector ?? "",
            puestos_de_trabajo,
          };
        })
      );

      const result: BranchData = {
        id: "branches",
        data: branches,
      };

      callback(result);
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
  toast.info(`Se ha agregado la rama: ${branch.descripcion_sector} `, { containerId: "global" });
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
