import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { authFirebase, firestore } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { JobPosition } from "@/types";

const usersCollection = "users";
const jobsPositionsDoc = "jobsProfiles";

const branchesCollection = "branches";
const branchesDoc = "jobsPositions";

export const getJobPositionFromBranchId = async (
  idJob: string,
  idBranch: string
): Promise<JobPosition | null> => {
  const refBranches = collection(firestore, branchesCollection);
  const refDoc = doc(refBranches, idBranch);
  const refJobsCollection = collection(refDoc, branchesDoc);
  const refJobsDoc = doc(refJobsCollection, idJob);
  const jobb = await getDoc(refJobsDoc);

  if (!jobb.exists()) {
    toast.error(
      `No se encontró el puesto de trabajo con ID: ${idJob} en la rama con ID: ${idBranch}`,
      { containerId: "global" }
    );
    return null;
  }
  toast.success(`Se ha obtenido el puesto de trabajo con ID: ${idJob}`, { containerId: "global" });
  return jobb.data() as JobPosition;
};

export const getJobPositionById = async (
  idJob: string,
  idBranch: string
): Promise<JobPosition | null> => {
  const refBranches = collection(firestore, usersCollection);
  const refDoc = doc(refBranches, idBranch);
  const refJobsCollection = collection(refDoc, jobsPositionsDoc);
  const refJobsDoc = doc(refJobsCollection, idJob);
  const jobb = await getDoc(refJobsDoc);

  if (!jobb.exists()) {
    toast.error(
      `No se encontró el puesto de trabajo con ID: ${idJob} en la rama con ID: ${idBranch}`,
      { containerId: "global" }
    );
    return null;
  }
  toast.success(`Se ha obtenido el puesto de trabajo con ID: ${idJob}`, { containerId: "global" });
  return jobb.data() as JobPosition;
};

export const updateJobPositionById = async (
  idJobProfile: string,
  payload: Partial<JobPosition>
) => {
  const uid = authFirebase.currentUser?.uid;

  if (!uid) {
    toast.error("No hay un usuario autenticado para actualizar el puesto de trabajo.", {
      containerId: "global",
    });
    return;
  }
  const docRef = doc(firestore, "users", uid, "jobsProfiles", idJobProfile);
  await updateDoc(docRef, {
    jobPosition: { ...payload },
  });
  toast.success(`Se ha actualizado el puesto de trabajo con ID: ${idJobProfile}`, {
    containerId: "global",
  });
};
