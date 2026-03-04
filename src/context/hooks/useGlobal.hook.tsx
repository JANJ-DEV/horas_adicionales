import { useContext } from "react";
import GlobalCtx from "../GlobalCtx";

const useGlobal = () => {
  const ctx = useContext(GlobalCtx);
  if (!ctx) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return ctx;
};

export default useGlobal;
