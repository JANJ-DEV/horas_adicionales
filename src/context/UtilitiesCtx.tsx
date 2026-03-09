import { createContext } from "react";
import type { UtilityDefinition, UtilitiesCatalog } from "@/services/utilities.service";

export type UtilityItem = {
  id: string;
  definition: UtilityDefinition | null;
};

export type UtilitiesContextType = {
  catalog: UtilitiesCatalog;
  isLoadingUtilities: boolean;
  isErrorUtilities: boolean;
  selectedBranchId: string | null;
  selectedJobId: string | null;
  activeUtilityIds: string[];
  activeUtilities: UtilityItem[];
  setSelectedProfileContext: (branchId: string | null, jobId: string | null) => void;
  getUtilityById: (utilityId: string) => UtilityDefinition | null;
  getUtilityByNameTool: (utilityName: string) => UtilityDefinition | null;
  createUtility: (utilityId: string, newData: UtilityDefinition) => Promise<UtilityDefinition>;
  updateUtilityById: (
    utilityId: string,
    newData: Partial<UtilityDefinition>
  ) => Promise<UtilityDefinition | null>;
  deleteUtilityById: (utilityId: string) => Promise<boolean>;
};

export const UtilitiesCtx = createContext<UtilitiesContextType | null>(null);
