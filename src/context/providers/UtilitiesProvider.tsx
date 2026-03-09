import type { Children } from "@/types";
import {
  createUtility,
  deleteUtilityById,
  getActiveUtilityIdsForProfile,
  getUtilityById,
  getUtilityByNameTool,
  subscribeToUtilities,
  updateUtilityById,
  type UtilitiesCatalog,
  type UtilityDefinition,
} from "@/services/utilities.service";
import { useEffect, useState, type FC } from "react";
import { UtilitiesCtx } from "../UtilitiesCtx";
import { toast } from "react-toastify";

const EMPTY_CATALOG: UtilitiesCatalog = {
  global_utilities: [],
  branch_utilities: {},
  utility_definitions: {},
};

const UtilitiesProvider: FC<Children> = ({ children }) => {
  const [catalog, setCatalog] = useState<UtilitiesCatalog>(EMPTY_CATALOG);
  const [isLoadingUtilities, setIsLoadingUtilities] = useState(true);
  const [isErrorUtilities, setIsErrorUtilities] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUtilities(
      (nextCatalog) => {
        setCatalog(nextCatalog);
        setIsLoadingUtilities(false);
        setIsErrorUtilities(false);
      },
      () => {
        setIsErrorUtilities(true);
        setIsLoadingUtilities(false);
        toast.error("Error al cargar utilidades", { containerId: "global" });
      }
    );

    return () => unsubscribe();
  }, []);

  const [setSelectedProfileContext] = useState(
    () => (branchId: string | null, jobId: string | null) => {
      setSelectedBranchId(branchId);
      setSelectedJobId(jobId);
    }
  );

  const getUtilityByIdFromCatalog = (utilityId: string) => getUtilityById(utilityId, catalog);

  const getUtilityByNameFromCatalog = (utilityName: string) => {
    const found = getUtilityByNameTool(utilityName, catalog);
    return found instanceof Promise ? null : found;
  };

  const createUtilityFromProvider = async (utilityId: string, newData: UtilityDefinition) => {
    const created = await createUtility(utilityId, newData);
    setCatalog((prev) => ({
      ...prev,
      utility_definitions: {
        ...prev.utility_definitions,
        [utilityId]: created,
      },
    }));
    return created;
  };

  const updateUtilityFromProvider = async (
    utilityId: string,
    newData: Partial<UtilityDefinition>
  ) => {
    const updated = await updateUtilityById(utilityId, newData);
    if (!updated) return null;

    setCatalog((prev) => ({
      ...prev,
      utility_definitions: {
        ...prev.utility_definitions,
        [utilityId]: updated,
      },
    }));
    return updated;
  };

  const deleteUtilityFromProvider = async (utilityId: string) => {
    const deleted = await deleteUtilityById(utilityId);

    if (deleted) {
      setCatalog((prev) => {
        const rest = { ...prev.utility_definitions };
        delete rest[utilityId];
        return {
          ...prev,
          utility_definitions: rest,
        };
      });
    }

    return deleted;
  };

  const activeUtilityIds = getActiveUtilityIdsForProfile(catalog, selectedBranchId, selectedJobId);

  const activeUtilities = activeUtilityIds.map((id) => ({
    id,
    definition: catalog.utility_definitions[id] ?? null,
  }));

  const value = {
    catalog,
    isLoadingUtilities,
    isErrorUtilities,
    selectedBranchId,
    selectedJobId,
    activeUtilityIds,
    activeUtilities,
    setSelectedProfileContext,
    getUtilityById: getUtilityByIdFromCatalog,
    getUtilityByNameTool: getUtilityByNameFromCatalog,
    createUtility: createUtilityFromProvider,
    updateUtilityById: updateUtilityFromProvider,
    deleteUtilityById: deleteUtilityFromProvider,
  };

  return <UtilitiesCtx.Provider value={value}>{children}</UtilitiesCtx.Provider>;
};

export default UtilitiesProvider;
