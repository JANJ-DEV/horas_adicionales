import type { Branch } from "@/types";
import { createContext } from "react";

interface BranchesContextType {
  branches: Branch[];
  isLoadingBranches: boolean;
  isErrorBranches: boolean;
}

const BranchesCtx = createContext<BranchesContextType | null>(null);

export default BranchesCtx;
