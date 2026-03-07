import { createContext } from "react";

export type ToastContextType = {
  containerId: string;
  updateContainerId: (id: string) => void;
};

export const ToastCtx = createContext<ToastContextType | null>(null);
