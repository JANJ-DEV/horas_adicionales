import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { authFirebase, firestore } from "../apis/firebase";
import { doc, setDoc } from "firebase/firestore";
import { handleAppError } from "./error.service";

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  await signInWithPopup(authFirebase, provider);
};
const signOutGoogle = async () => {
  await signOut(authFirebase);
};

const updateAccount = async ({
  displayName,
  photoURL,
}: {
  displayName?: string;
  photoURL?: string;
}) => {
  const user = authFirebase.currentUser;
  if (!user) {
    handleAppError(new Error("No hay un usuario autenticado"), "auth.service.updateAccount");
    return;
  }
  const profilePayload: { displayName?: string; photoURL?: string } = {};
  if (displayName !== undefined) profilePayload.displayName = displayName;
  if (photoURL !== undefined) profilePayload.photoURL = photoURL;

  await updateProfile(user, profilePayload);
  try {
    // Aquí puedes realizar la lógica para actualizar la cuenta del usuario
    // Ejemplo, podrías enviar una solicitud a tu backend para actualizar la información del usuario
    const refUserAccount = doc(firestore, "users", user.uid);
    const userDocPayload: {
      uid: string;
      email: string | null;
      displayName?: string;
      photoURL?: string;
    } = {
      uid: user.uid,
      email: user.email,
    };

    if (displayName !== undefined) userDocPayload.displayName = displayName;
    if (photoURL !== undefined) userDocPayload.photoURL = photoURL;

    await setDoc(refUserAccount, userDocPayload, { merge: true });
  } catch (error) {
    handleAppError(error, "auth.service.updateAccount");
    throw error;
  }
};

const authStateChanged = (callback: (user: User | null) => void) => {
  onAuthStateChanged(authFirebase, (user: User | null) => {
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  });
};
export { signInWithGoogle, signOutGoogle, updateAccount, authStateChanged };
