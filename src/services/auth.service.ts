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

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(authFirebase, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.table({
        user,
        token,
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage, email, credential);
    });
};
const signOutGoogle = () => {
  signOut(authFirebase)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
    });
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
    console.error("No hay un usuario autenticado");
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
    console.error("Error al actualizar el documento de usuario:", error);
    throw error;
  }
};

const authStateChanged = (callback: (user: User | null) => void) => {
  onAuthStateChanged(authFirebase, (user: User | null) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log("User signed in", user);
      callback(user);
    } else {
      // User is signed out
      console.log("User signed out");
      callback(null);
    }
  });
};
export { signInWithGoogle, signOutGoogle, updateAccount, authStateChanged };
