import { collection, onSnapshot, doc, type Unsubscribe, FirestoreError } from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { Branch, BranchData } from "@/types";

export const subscribeToBranches = (
  callback: (branches: BranchData) => void,
  errorCallback?: (error: FirestoreError) => void,
  finallyCallback?: () => void
): Unsubscribe | FirestoreError | void => {
  const refBranches = collection(firestore, "ramas");
  const refDoc = doc(refBranches, "sectores");
  return onSnapshot(
    refDoc,
    (snapshot) => {
      if (!snapshot.exists()) {
        toast.error("No se pudieron cargar los sectores y puestos de trabajo", {
          containerId: "global",
        });
      }

      const result: BranchData = {
        id: snapshot.id,
        ...(snapshot.data() as Omit<BranchData, "id">),
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
