import { collection, doc, setDoc, serverTimestamp, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import {authFirebase} from "@/apis/firebase";

export interface RecordService {
  id?: string;
  nombreEmpresa: string;
  fecha: string | Date;
  hora_entrada?: string;
  hora_salida?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export const saveRecord = async (record: RecordService) => {
  const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
  }

  try {
    // 1. Referencia a la colección
    const collectionRef = collection(firestore, "users", userId, "records");
    
    // 2. Crear un nuevo documento con ID automático
    const newDocRef = doc(collectionRef); 

    await setDoc(newDocRef, {
      id: newDocRef.id, // Guardamos el ID dentro del doc por comodidad
      nombreEmpresa: record.nombreEmpresa,
      fecha: record.fecha, // La fecha del registro (la que eligió el usuario)
      hora_entrada: record.hora_entrada,
      hora_salida: record.hora_salida,
      createdAt: serverTimestamp(), // Fecha de creación real
      updatedAt: serverTimestamp(), // Fecha de última actualización
    });

    console.log("Documento guardado con éxito");
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

export const getRecords = async (userId: string) => {
  try {
    const collectionRef = collection(firestore, "users", userId, "records");
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return records;
  } catch (error) {
    console.error("Error al obtener registros:", error);
    return [];
  }
};

export const updateRecord = async (userId: string, recordId: string, updatedData: Partial<RecordService>) => {
  try {
    const docRef = doc(firestore, "users", userId, "records", recordId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    console.log("Registro actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar registro:", error);
  }
};

export const deleteRecord = async (userId: string, recordId: string) => {
  try {
    const docRef = doc(firestore, "users", userId, "records", recordId);
    await deleteDoc(docRef);
    console.log("Registro eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar registro:", error);
  }
};
export const getRecordById = async (userId: string, recordId: string) => {
  try {
    const docRef = doc(firestore, "users", userId, "records", recordId);
    const docSnap = await getDoc(docRef);       
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener registro por ID:", error);
    return null;
  }
};
export const getRecordsByDateRange = async (userId: string, startDate: Date, endDate: Date) => {
  try {
    const collectionRef = collection(firestore, "users", userId, "records");
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({ id: doc.id, nombreEmpresa: doc.data().nombreEmpresa, fecha: doc.data().fecha, ...doc.data() }));
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
    const collectionRef = collection(firestore, "users", userId, "records");
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({ id: doc.id, nombreEmpresa: doc.data().nombreEmpresa, fecha: doc.data().fecha, ...doc.data() }));   
    // Filtrar registros por nombre de empresa
    const filteredRecords = records.filter((record) => record.nombreEmpresa.toLowerCase().includes(companyName.toLowerCase()));   
    return filteredRecords;
  } catch (error) {
    console.error("Error al obtener registros por nombre de empresa:", error);
    return [];
  }
};

