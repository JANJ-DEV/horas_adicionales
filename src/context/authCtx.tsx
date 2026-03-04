import type { User } from "firebase/auth";
import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  isError: boolean;
  isLoading: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signInWithGoogle: () => void;
  signOutGoogle: () => void;
};

export const AuthCtx = createContext<AuthContextType | null>(null);
