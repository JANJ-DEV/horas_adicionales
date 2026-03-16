import { appFirebase, authFirebase } from "@/apis/firebase";
import { handleAppError } from "./error.service";

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const { getDownloadURL, getStorage, ref, uploadBytes } = await import("firebase/storage");
    const storageFirebase = getStorage(appFirebase);
    const storageRef = ref(storageFirebase, `users/${authFirebase.currentUser?.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    handleAppError(error, "uploadFile.service.uploadFile");
    throw error;
  }
};
