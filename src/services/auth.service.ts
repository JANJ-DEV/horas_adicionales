import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { authFirebase } from "../apis/firebase";


const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
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
}
const signOutGoogle = () => {
  signOut(authFirebase).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.error(error);
  });
}
const authStateChanged = (callback: (user: User | null) => void)=>{
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
}
export { signInWithGoogle, signOutGoogle, authStateChanged };
