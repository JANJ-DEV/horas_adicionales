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
  writeBatch,
  query,
  where,
  orderBy,
  type QueryConstraint,
  type FirestoreError,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/apis/firebase";
import { authFirebase } from "@/apis/firebase";
import { handleAppError } from "./error.service";
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
const BATCH_WRITE_LIMIT = 500;

type LegacyRecordMatcher = {
  titleJobProfile: string;
  branchId?: string;
  jobPositionId?: string;
};

export type RecordsQueryFilters = {
  branchId?: string;
  jobPositionId?: string;
  jobProfileId?: string;
  dateFrom?: string;
  dateTo?: string;
};

const buildRecordsQueryConstraints = (filters?: RecordsQueryFilters) => {
  const constraints: QueryConstraint[] = [];

  if (!filters) {
    return constraints;
  }

  if (filters.branchId) {
    constraints.push(where("branchId", "==", filters.branchId));
  }

  if (filters.jobPositionId) {
    constraints.push(where("jobPositionId", "==", filters.jobPositionId));
  }

  if (filters.jobProfileId) {
    constraints.push(where("jobProfileId", "==", filters.jobProfileId));
  }

  if (filters.dateFrom) {
    constraints.push(where("dateTimeRecord", ">=", filters.dateFrom));
  }

  if (filters.dateTo) {
    constraints.push(where("dateTimeRecord", "<=", filters.dateTo));
  }

  if (filters.dateFrom || filters.dateTo) {
    constraints.push(orderBy("dateTimeRecord", "desc"));
  }

  return constraints;
};

export const subscribeToRecords = (
  onUpdate: (records: RecordService[]) => void,
  onError: (error: FirestoreError) => void,
  onComplete: () => void,
  filters?: RecordsQueryFilters
) => {
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    handleAppError(
      new Error("No hay un usuario autenticado"),
      "records.service.subscribeToRecords"
    );
    return;
  }

  const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
  const constraints = buildRecordsQueryConstraints(filters);
  const recordsQuery =
    constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

  const unsubscribe = onSnapshot(
    recordsQuery,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onUpdate(records as RecordService[]);
    },
    (error) => {
      handleAppError(error, "records.service.subscribeToRecords");
      onError(error);
    },
    () => {
      onComplete();
    }
  );

  return unsubscribe;
};

export const saveRecord = async (record: RecordService) => {
  const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    handleAppError(new Error("No hay un usuario autenticado"), "records.service.saveRecord");
    return null;
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
    return { ...record, id: newDocRef.id } as RecordService;
  } catch (error) {
    handleAppError(error, "records.service.saveRecord");
    return null;
  }
};

export const getRecords = async (userId: string) => {
  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return records;
  } catch (error) {
    handleAppError(error, "records.service.getRecords");
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
    return true;
  } catch (error) {
    handleAppError(error, "records.service.updateRecord");
    return false;
  }
};

export const updateEstimatedHourlyRateByJobProfile = async (
  jobProfileId: string,
  estimatedHourlyRate: number,
  legacyMatcher?: LegacyRecordMatcher
): Promise<number> => {
  try {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) {
      handleAppError(
        new Error("No hay un usuario autenticado"),
        "records.service.updateEstimatedHourlyRateByJobProfile"
      );
      return 0;
    }

    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const matchedDocs = querySnapshot.docs.filter((recordDoc) => {
      const data = recordDoc.data() as RecordService;

      if (data.jobProfileId === jobProfileId) {
        return true;
      }

      if (!legacyMatcher || data.jobProfileId) {
        return false;
      }

      return (
        data.titleJobProfile === legacyMatcher.titleJobProfile &&
        data.branchId === legacyMatcher.branchId &&
        data.jobPositionId === legacyMatcher.jobPositionId
      );
    });

    if (matchedDocs.length === 0) {
      return 0;
    }

    for (let index = 0; index < matchedDocs.length; index += BATCH_WRITE_LIMIT) {
      const batch = writeBatch(firestore);
      const docsChunk = matchedDocs.slice(index, index + BATCH_WRITE_LIMIT);

      docsChunk.forEach((recordDoc) => {
        batch.update(recordDoc.ref, {
          estimatedHourlyRate,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    }

    return matchedDocs.length;
  } catch (error) {
    handleAppError(error, "records.service.updateEstimatedHourlyRateByJobProfile");
    throw error;
  }
};

export const deleteRecord = async (recordId: string): Promise<boolean> => {
  try {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) {
      handleAppError(new Error("No hay un usuario autenticado"), "records.service.deleteRecord");
      return false;
    }
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleAppError(error, "records.service.deleteRecord");
    return false;
  }
};

export const getRecordById = async (recordId: string): Promise<RecordService | null> => {
  try {
    const userId = authFirebase.currentUser?.uid;
    if (!userId) {
      handleAppError(new Error("No hay un usuario autenticado"), "records.service.getRecordById");
      return null;
    }
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as RecordService;
    } else {
      return null;
    }
  } catch (error) {
    handleAppError(error, "records.service.getRecordById");
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
    handleAppError(error, "records.service.getRecordsByDateRange");
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
    handleAppError(error, "records.service.getRecordsByCompanyName");
    return [];
  }
};
