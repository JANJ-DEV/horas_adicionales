import { useContext } from "react";
import { UtilitiesCtx } from "../UtilitiesCtx";

const useUtilities = () => {
  const ctx = useContext(UtilitiesCtx);
  if (!ctx) {
    throw new Error("useUtilities must be used within a UtilitiesProvider");
  }
  return ctx;
};

export default useUtilities;
