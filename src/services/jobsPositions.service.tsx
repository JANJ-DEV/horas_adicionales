import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { JobPosition } from "@/types";

const nameCollection = "branches";
const nameRefJobsPositions = "jobsPositions";

export const getJobById = async (idJob: string, idBranch: string): Promise<JobPosition | null> => {
  const refBranches = collection(firestore, nameCollection);
  const refDoc = doc(refBranches, idBranch);
  const refJobsCollection = collection(refDoc, nameRefJobsPositions);
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
