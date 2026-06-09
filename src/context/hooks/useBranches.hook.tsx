import { useContext } from "react";
import BranchesCtx from "../BranchesCtx";

const useBranches = () => {
  const ctx = useContext(BranchesCtx);
  if (!ctx) {
    throw new Error("useBranches must be used within a BranchesProvider");
  }
  return ctx;
};

export default useBranches;
