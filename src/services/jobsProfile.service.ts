import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { authFirebase } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { JobProfile } from "@/types";

const nameCollection = "job_profiles";

export const saveJobProfile = async (payload: JobProfile) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    toast.error("No hay un usuario autenticado", { containerId: "job-profiles-toast" });
    console.error("No hay un usuario autenticado");
    return;
  }
  console.log("Guardando perfil de trabajo para el usuario:", userId);
  console.table(payload);

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
    console.error("Error al crear el perfil de trabajo:", error);
    throw error;
  }
};

export const subscribeToJobProfiles = (
  callback: (profiles: JobProfile[]) => void
): Unsubscribe | void => {
  const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
  }

  const refUser = collection(firestore, `users/${userId}/job_profiles`);

  // Retornamos la función unsubscribe para poder detener la escucha cuando el componente se desmonte
  const unsubscribe = onSnapshot(refUser, (snapshot) => {
    // El arreglo se crea NUEVO en cada actualización para no duplicar datos
    const profiles: JobProfile[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as JobProfile
    );

    console.log("Perfiles actualizados:", profiles);
    // Le pasamos los datos a la función callback
    callback(profiles);
  });

  return unsubscribe;
};
export const getJobProfileById = async (id: string): Promise<JobProfile | null> => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
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
    console.error("Error al obtener el perfil de trabajo por ID:", error);
    throw error;
  }
};

export const updateJobProfile = async (id: string, payload: Partial<JobProfile>) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
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
    console.error("Error al actualizar el perfil de trabajo:", error);
    throw error;
  }
};

export const deleteJobProfile = async (id: string) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
  }
  try {
    const docRef = doc(firestore, "users", userId, nameCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar el perfil de trabajo:", error);
    throw error;
  }
};
