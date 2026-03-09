import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  type FirestoreError,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { authFirebase } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { UtilityFieldValue } from "./utilities.service";

export interface RecordService {
  id?: string;
  jobProfileId?: string;
  branchId?: string;
  jobPositionId?: string;
  titleJobProfile: string;
  dateTimeRecord: string | Date;
  workStartTime?: string;
  workEndTime?: string;
  estimatedHourlyRate?: number;
  utilitiesValues?: Record<string, UtilityFieldValue>;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

const NAME_COLLECTION = "records";

export const subscribeToRecords = (
  onUpdate: (records: RecordService[]) => void,
  onError: (error: FirestoreError) => void,
  onComplete: () => void
) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
  }

  const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onUpdate(records as RecordService[]);
    },
    (error) => {
      console.error("Error al suscribirse a registros:", error);
      onError(error);
    },
    () => {
      console.log("Suscripción a registros completada");
      onComplete();
    }
  );

  return unsubscribe;
};

export const saveRecord = async (record: RecordService) => {
  const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
  }

  try {
    // 1. Referencia a la colección
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);

    // 2. Crear un nuevo documento con ID automático
    const newDocRef = doc(collectionRef);

    await setDoc(newDocRef, {
      id: newDocRef.id, // Guardamos el ID dentro del doc por comodidad
      jobProfileId: record.jobProfileId,
      branchId: record.branchId,
      jobPositionId: record.jobPositionId,
      titleJobProfile: record.titleJobProfile,
      dateTimeRecord: record.dateTimeRecord, // La fecha del registro (la que eligió el usuario)
      workStartTime: record.workStartTime,
      workEndTime: record.workEndTime,
      createdAt: serverTimestamp(), // Fecha de creación real
      updatedAt: serverTimestamp(), // Fecha de última actualización
      estimatedHourlyRate: record.estimatedHourlyRate,
      utilitiesValues: record.utilitiesValues ?? {},
    });

    toast.success("Registro guardado con éxito", { containerId: "records" });
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

export const getRecords = async (userId: string) => {
  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return records;
  } catch (error) {
    console.error("Error al obtener registros:", error);
    return [];
  }
};

export const updateRecord = async (
  userId: string,
  recordId: string,
  updatedData: Partial<RecordService>
) => {
  try {
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    toast.success("Registro actualizado con éxito", { containerId: "records" });
  } catch (error) {
    console.error("Error al actualizar registro:", error);
  }
};

export const deleteRecord = async (recordId: string) => {
  try {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) {
      console.error("No hay un usuario autenticado");
      return;
    }
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    await deleteDoc(docRef);
    toast.success("Registro eliminado con éxito", { containerId: "records" });
  } catch (error) {
    console.error("Error al eliminar registro:", error);
  }
};

export const getRecordById = async (recordId: string): Promise<RecordService | null> => {
  try {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) {
      console.error("No hay un usuario autenticado");
      return null;
    }
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as RecordService;
    } else {
      toast.error("No se encontró el documento", { containerId: "records" });
      return null;
    }
  } catch (error) {
    console.error("Error al obtener registro por ID:", error);
    return null;
  }
};

export const getRecordsByDateRange = async (userId: string, startDate: Date, endDate: Date) => {
  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      titleJobProfile: doc.data().titleJobProfile,
      fecha: doc.data().fecha,
      ...doc.data(),
    }));
    // Filtrar registros por rango de fechas
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.fecha as string | Date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    return filteredRecords;
  } catch (error) {
    console.error("Error al obtener registros por rango de fechas:", error);
    return [];
  }
};

export const getRecordsByCompanyName = async (userId: string, companyName: string) => {
  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      titleJobProfile: doc.data().titleJobProfile,
      fecha: doc.data().fecha,
      ...doc.data(),
    }));
    // Filtrar registros por nombre de empresa
    const filteredRecords = records.filter((record) =>
      record.titleJobProfile.toLowerCase().includes(companyName.toLowerCase())
    );
    return filteredRecords;
  } catch (error) {
    console.error("Error al obtener registros por nombre de empresa:", error);
    return [];
  }
};
