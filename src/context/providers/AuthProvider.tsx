import { useEffect, useState } from "react";
import { AuthCtx } from "../authCtx";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { authFirebase } from "@/apis/firebase";




const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      await signInWithPopup(authFirebase, provider);

    } catch (error) {
      // Handle Errors here.
      console.log("Error signing in with Google", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }
  
  const signOutGoogle = () => {
    signOut(authFirebase).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, (user: User | null) => {
      if (user) {
        // User is signed in, see docs for a list of available properties 
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        console.log("User signed out");
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => {
      unsubscribe();
    }
  }, [])


  return (
    <AuthCtx.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading,
        currentUser,
        setCurrentUser: () => { },
        signInWithGoogle,
        signOutGoogle
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
};

export default AuthProvider;