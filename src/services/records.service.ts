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
  deleteField,
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

type RecordWithLegacyDate = RecordService & {
  fecha?: string | Date;
};

export type RecordsQueryFilters = {
  branchId?: string;
  jobPositionId?: string;
  jobProfileId?: string;
  dateFrom?: string;
  dateTo?: string;
};

const getRecordDateValue = (record: RecordWithLegacyDate): string | Date | undefined => {
  return record.dateTimeRecord ?? record.fecha;
};

const normalizeRecordDate = (record: RecordWithLegacyDate) => {
  const recordWithoutLegacyDate = { ...record };
  delete recordWithoutLegacyDate.fecha;
  const normalizedDate = getRecordDateValue(record);

  return {
    ...recordWithoutLegacyDate,
    ...(normalizedDate ? { dateTimeRecord: normalizedDate } : {}),
  };
};

const migrateLegacyRecordIfNeeded = async (
  userId: string,
  recordId: string,
  rawData: RecordWithLegacyDate
) => {
  if (rawData.fecha === undefined) return;

  try {
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    const normalizedDate = rawData.dateTimeRecord ?? rawData.fecha;
    if (normalizedDate) {
      await updateDoc(docRef, {
        dateTimeRecord: normalizedDate,
        fecha: deleteField(),
        updatedAt: serverTimestamp(),
      });
      console.log(`[Migration] Migrated legacy record ${recordId} (transferred 'fecha' to 'dateTimeRecord')`);
    }
  } catch (error) {
    console.warn(`[Migration] Failed to migrate legacy record ${recordId}:`, error);
  }
};

const processDocAndNormalize = (
  userId: string,
  docId: string,
  rawData: RecordWithLegacyDate
): RecordService => {
  void migrateLegacyRecordIfNeeded(userId, docId, rawData);
  return normalizeRecordDate({
    id: docId,
    ...rawData,
  }) as RecordService;
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
      const records = snapshot.docs.map((doc) =>
        processDocAndNormalize(
          userId,
          doc.id,
          doc.data() as RecordWithLegacyDate
        )
      );
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

export const saveRecord = async (record: RecordService): Promise<RecordService> => {
  const userId = authFirebase.currentUser?.uid;

  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.saveRecord");
    throw authError;
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
    throw error;
  }
};

export const getRecords = async (userId: string): Promise<RecordService[]> => {
  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.getRecords");
    throw authError;
  }

  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) =>
      processDocAndNormalize(
        userId,
        doc.id,
        doc.data() as RecordWithLegacyDate
      )
    );
    return records as RecordService[];
  } catch (error) {
    handleAppError(error, "records.service.getRecords");
    throw error;
  }
};

export const updateRecord = async (
  userId: string,
  recordId: string,
  updatedData: Partial<RecordService>
): Promise<true> => {
  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.updateRecord");
    throw authError;
  }

  try {
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleAppError(error, "records.service.updateRecord");
    throw error;
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
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.getRecordById");
    throw authError;
  }

  try {
    const docRef = doc(firestore, "users", userId, NAME_COLLECTION, recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return processDocAndNormalize(
        userId,
        docSnap.id,
        docSnap.data() as RecordWithLegacyDate
      );
    } else {
      return null;
    }
  } catch (error) {
    handleAppError(error, "records.service.getRecordById");
    throw error;
  }
};

export const getRecordsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<RecordService[]> => {
  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.getRecordsByDateRange");
    throw authError;
  }

  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) =>
      processDocAndNormalize(
        userId,
        doc.id,
        doc.data() as RecordWithLegacyDate
      )
    );
    // Filtrar registros por rango de fechas
    const filteredRecords = records.filter((record) => {
      const recordDateValue = getRecordDateValue(record as RecordWithLegacyDate);
      if (!recordDateValue) {
        return false;
      }

      const recordDate = new Date(recordDateValue);
      if (Number.isNaN(recordDate.getTime())) {
        return false;
      }

      return recordDate >= startDate && recordDate <= endDate;
    });
    return filteredRecords;
  } catch (error) {
    handleAppError(error, "records.service.getRecordsByDateRange");
    throw error;
  }
};

export const getRecordsByCompanyName = async (
  userId: string,
  companyName: string
): Promise<RecordService[]> => {
  if (!userId) {
    const authError = new Error("No hay un usuario autenticado");
    handleAppError(authError, "records.service.getRecordsByCompanyName");
    throw authError;
  }

  try {
    const collectionRef = collection(firestore, "users", userId, NAME_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    const records = querySnapshot.docs.map((doc) =>
      processDocAndNormalize(
        userId,
        doc.id,
        doc.data() as RecordWithLegacyDate
      )
    );
    // Filtrar registros por nombre de empresa
    const filteredRecords = records.filter((record) =>
      record.titleJobProfile.toLowerCase().includes(companyName.toLowerCase())
    );
    return filteredRecords;
  } catch (error) {
    handleAppError(error, "records.service.getRecordsByCompanyName");
    throw error;
  }
};
