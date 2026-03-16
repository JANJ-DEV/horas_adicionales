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
import type { FirebaseError } from "firebase/app";
import { handleAppError } from "@/services/error.service";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthResolved, setIsAuthResolved] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    let cancellingTimer: ReturnType<typeof setTimeout> | null = null;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    try {
      setIsLoading(true);
      setIsCancelling(false);
      // Tras 3 s sin respuesta, asumimos que el usuario cerró el popup → icono "Cancelando"
      cancellingTimer = setTimeout(() => {
        setIsLoading(false);
        setIsCancelling(true);
      }, 3_000);
      // Fallback de seguridad absoluto a los 12 s
      safetyTimer = setTimeout(() => {
        setIsLoading(false);
        setIsCancelling(false);
      }, 12_000);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const user = await signInWithPopup(authFirebase, provider);
      if (user)
        notify.info("Bienvenido " + user.user.displayName, {
          scope: TOAST_SCOPE.GLOBAL,
          autoClose: 3000,
        });
    } catch (error) {
      handleAppError(error, "AuthProvider.signInWithGoogle");
      const firebaseError = error as FirebaseError;
      // El usuario cerró el popup voluntariamente — no es un error, solo restaurar estado
      const ignoredCodes = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];
      if (!ignoredCodes.includes(firebaseError.code)) {
        notify.error(
          firebaseError.code === "auth/popup-blocked"
            ? "El navegador bloqueó el popup. Permite las ventanas emergentes e inténtalo de nuevo."
            : "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
          { scope: TOAST_SCOPE.GLOBAL }
        );
        setIsError(true);
      }
    } finally {
      if (cancellingTimer !== null) clearTimeout(cancellingTimer);
      if (safetyTimer !== null) clearTimeout(safetyTimer);
      setIsLoading(false);
      setIsCancelling(false);
    }
  };

  const signOutGoogle = () => {
    signOut(authFirebase)
      .then(() => {
        notify.info("Sesión cerrada, te esperamos pronto 😘😘", {
          scope: TOAST_SCOPE.GLOBAL,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        handleAppError(error, "AuthProvider.signOutGoogle");
        notify.error("No se pudo cerrar la sesión", {
          scope: TOAST_SCOPE.GLOBAL,
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

      setIsAuthResolved(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        isAuthenticated,
        isAuthResolved,
        isError,
        isLoading,
        isCancelling,
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
