import { collection, doc, setDoc } from "firebase/firestore";
import dataSectores from "../json/sectores_y_puestos_de_trabajo.json";
import { firestore } from "@/apis/firebase";
import type { FirebaseError } from "firebase/app";

export interface Collections {
  RAMAS: string;
  USERS: string;
  JOB_PROFILES: string;
  RECORDS: string;
}

export const COLLECTIONS: Collections = {
  RAMAS: "ramas",
  USERS: "users",
  JOB_PROFILES: "job_profiles",
  RECORDS: "records",
};

async function populateSectors(jsonData: object, collectionName?: string) {
  const ref = collection(firestore, COLLECTIONS.RAMAS);
  try {
    if (!collectionName || collectionName.length === 0) collectionName = `sectores`;
    await setDoc(doc(ref, collectionName), jsonData);
    console.log("Datos de sectores y puestos de trabajo añadidos correctamente");
  } catch (error) {
    const firebaseError = error as FirebaseError;
    console.error("Error al añadir documento: ", { ...firebaseError });
    throw firebaseError;
  }
}

populateSectors(dataSectores);
