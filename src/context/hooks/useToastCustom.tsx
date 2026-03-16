import { useContext } from "react";
import { ToastCtx } from "../ToastCtx";

const useToastCustom = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    throw new Error("useToastCustom must be used within a ToastCustomProvider");
  }
  return ctx;
};

export default useToastCustom;
