import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { authFirebase, firestore } from "@/apis/firebase";
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
    return null;
  }
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
    return null;
  }
  return jobb.data() as JobPosition;
};

export const updateJobPositionById = async (
  idJobProfile: string,
  payload: Partial<JobPosition>
): Promise<boolean> => {
  const uid = authFirebase.currentUser?.uid;

  if (!uid) {
    return false;
  }
  const docRef = doc(firestore, "users", uid, "jobsProfiles", idJobProfile);
  await updateDoc(docRef, {
    jobPosition: { ...payload },
  });
  return true;
};
