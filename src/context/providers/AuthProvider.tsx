import { useEffect, useState } from "react";
import { AuthCtx } from "../authCtx";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { authFirebase } from "@/apis/firebase";
import { toast } from "react-toastify";
import type { FirebaseError } from "firebase/app";

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
        prompt: "select_account",
      });
      const user = await signInWithPopup(authFirebase, provider);
      if (user)
        toast.success("Signed in with Google successfully", {
          containerId: "global",
          autoClose: 1500,
        });
      toast.info("Bienvenido " + user.user.displayName, {
        containerId: "global",
        autoClose: 3000,
        delay: 1500,
      });
    } catch (error) {
      // Handle Errors here.
      const firebaseError = error as FirebaseError;
      // console.log("Error signing in with Google", error);
      toast.error(firebaseError.message || "Error signing in with Google", {
        containerId: "global",
      });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutGoogle = () => {
    signOut(authFirebase)
      .then(() => {
        toast.info("Sesión cerrada, te esperamos pronto 😘😘", {
          containerId: "global",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        // An error happened.
        toast.error((error as FirebaseError).message || "Error signing out", {
          containerId: "global",
        });
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, (user: User | null) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading,
        currentUser,
        setCurrentUser: () => {},
        signInWithGoogle,
        signOutGoogle,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthProvider;
