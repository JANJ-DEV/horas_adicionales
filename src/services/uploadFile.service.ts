import { storageFirebase } from "@/apis/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { authFirebase } from "@/apis/firebase";

export const uploadFile = async (file: File): Promise<string> => {
  const storageRef = ref(storageFirebase, `users/${authFirebase.currentUser?.uid}/${file.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
};