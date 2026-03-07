import { useContext } from "react";
import BranchesCtx from "../BranchesCtx";

const useBranches = () => {
  try {
    const ctx = useContext(BranchesCtx);
    if (!ctx) {
      throw new Error("useBranches must be used within a BranchesProvider");
    }
    return ctx;
  } catch (error) {
    console.error(error);
    throw new Error("useBranches must be used within a BranchesProvider");
  }
};

export default useBranches;
