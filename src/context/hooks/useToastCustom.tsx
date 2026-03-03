import { useContext } from "react";
import { ToastCtx } from "../ToastCtx";

const useToastCustom = () => {
  try {
    const ctx = useContext(ToastCtx);
    if (!ctx) {
      throw new Error("useToastCustom must be used within a ToastCustomProvider");
    }
    return ctx;
  } catch (error) {
    console.error(error);
    throw new Error("useToastCustom must be used within a ToastCustomProvider");
  }
};

export default useToastCustom; 