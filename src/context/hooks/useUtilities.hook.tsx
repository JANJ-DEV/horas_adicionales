import { useContext } from "react";
import { UtilitiesCtx } from "../UtilitiesCtx";
import type { UtilitiesContextType } from "../UtilitiesCtx";

const useUtilities = (): UtilitiesContextType => {
  const ctx = useContext(UtilitiesCtx);
  if (!ctx) {
    throw new Error("useUtilities must be used within a UtilitiesProvider");
  }
  return ctx;
};

export default useUtilities;
