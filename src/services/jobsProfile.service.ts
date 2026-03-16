import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
  type FirestoreError,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { authFirebase } from "@/apis/firebase";
import type { JobProfile } from "@/types";
import { handleAppError } from "./error.service";

const nameCollection = "jobsProfiles";

export const subscribeToJobProfiles = (
  callback: (profiles: JobProfile[]) => void,
  onError: (error: FirestoreError) => void,
  onComplete: () => void
): Unsubscribe => {
  const userId = authFirebase.currentUser?.uid;
  const refUser = collection(firestore, `users/${userId}/${nameCollection}`);
  const unsubscribe = onSnapshot(
    refUser,
    (snapshot) => {
      // El arreglo se crea NUEVO en cada actualización para no duplicar datos
      const profiles: JobProfile[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as JobProfile
      );
      // Le pasamos los datos a la función callback
      callback(profiles);
    },
    (error) => {
      handleAppError(error, "jobsProfile.service.subscribeToJobProfiles");
      onError(error);
    },
    () => {
      onComplete();
    }
  );

  return unsubscribe;
};

export const saveJobProfile = async (payload: JobProfile) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    return null;
  }
  try {
    // 1. Referencia a la colección
    const collectionRef = collection(firestore, "users", userId, nameCollection);

    // 2. Crear un nuevo documento con ID automático
    const newDocRef = doc(collectionRef);

    await setDoc(newDocRef, {
      id: newDocRef.id,
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ...payload, id: newDocRef.id } as JobProfile;
  } catch (error) {
    handleAppError(error, "jobsProfile.service.saveJobProfile");
    throw error;
  }
};

export const getJobProfileById = async (id: string): Promise<JobProfile | null> => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    handleAppError(
      new Error("No hay un usuario autenticado"),
      "jobsProfile.service.getJobProfileById"
    );
    return null;
  }
  try {
    const docRef = doc(firestore, "users", userId, nameCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as JobProfile;
    } else {
      console.warn("No se encontró el perfil de trabajo con ID:", id);
      return null;
    }
  } catch (error) {
    handleAppError(error, "jobsProfile.service.getJobProfileById");
    throw error;
  }
};

export const updateJobProfile = async (id: string, payload: Partial<JobProfile>) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    handleAppError(
      new Error("No hay un usuario autenticado"),
      "jobsProfile.service.updateJobProfile"
    );
    return;
  }
  try {
    const docRef = doc(firestore, "users", userId, nameCollection, id);
    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { id, ...payload } as JobProfile;
  } catch (error) {
    handleAppError(error, "jobsProfile.service.updateJobProfile");
    throw error;
  }
};

export const deleteJobProfile = async (id: string) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    handleAppError(
      new Error("No hay un usuario autenticado"),
      "jobsProfile.service.deleteJobProfile"
    );
    return;
  }
  try {
    const docRef = doc(firestore, "users", userId, nameCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleAppError(error, "jobsProfile.service.deleteJobProfile");
    throw error;
  }
};
