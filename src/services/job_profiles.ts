import { collection, doc, setDoc, serverTimestamp,type Timestamp} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import {authFirebase} from "@/apis/firebase";

const nameCollection = 'job_profiles';

export interface JobProfile {
  id?: string;
  nombrePerfil: string;
  puestoTrabajo: string;
  descripcion?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const saveJobProfile = async (payload: JobProfile) => {
   const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
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
    console.error("Error al crear el perfil de trabajo:", error);
    throw error;
  }
};
