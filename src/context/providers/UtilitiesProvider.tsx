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
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
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

  const setSelectedProfileContext = useCallback((branchId: string | null, jobId: string | null) => {
    setSelectedBranchId(branchId);
    setSelectedJobId(jobId);
  }, []);

  const getUtilityByIdFromCatalog = useCallback(
    (utilityId: string) => getUtilityById(utilityId, catalog),
    [catalog]
  );

  const getUtilityByNameFromCatalog = useCallback(
    (utilityName: string) => {
      const found = getUtilityByNameTool(utilityName, catalog);
      return found instanceof Promise ? null : found;
    },
    [catalog]
  );

  const createUtilityFromProvider = useCallback(
    async (utilityId: string, newData: UtilityDefinition) => {
      const created = await createUtility(utilityId, newData);
      setCatalog((prev) => ({
        ...prev,
        utility_definitions: {
          ...prev.utility_definitions,
          [utilityId]: created,
        },
      }));
      return created;
    },
    []
  );

  const updateUtilityFromProvider = useCallback(
    async (utilityId: string, newData: Partial<UtilityDefinition>) => {
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
    },
    []
  );

  const deleteUtilityFromProvider = useCallback(async (utilityId: string) => {
    const deleted = await deleteUtilityById(utilityId);

    if (deleted) {
      setCatalog((prev) => {
        const { [utilityId]: _removed, ...rest } = prev.utility_definitions;
        return {
          ...prev,
          utility_definitions: rest,
        };
      });
    }

    return deleted;
  }, []);

  const activeUtilityIds = useMemo(() => {
    return getActiveUtilityIdsForProfile(catalog, selectedBranchId, selectedJobId);
  }, [catalog, selectedBranchId, selectedJobId]);

  const activeUtilities = useMemo(
    () => activeUtilityIds.map((id) => ({ id, definition: catalog.utility_definitions[id] ?? null })),
    [activeUtilityIds, catalog.utility_definitions]
  );

  const value = useMemo(
    () => ({
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
    }),
    [
      catalog,
      isLoadingUtilities,
      isErrorUtilities,
      selectedBranchId,
      selectedJobId,
      activeUtilityIds,
      activeUtilities,
      setSelectedProfileContext,
      getUtilityByIdFromCatalog,
      getUtilityByNameFromCatalog,
      createUtilityFromProvider,
      updateUtilityFromProvider,
      deleteUtilityFromProvider,
    ]
  );

  return <UtilitiesCtx.Provider value={value}>{children}</UtilitiesCtx.Provider>;
};

export default UtilitiesProvider;