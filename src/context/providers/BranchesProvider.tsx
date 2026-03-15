import type { Branch, Children } from "@/types";
import { useEffect, useState, type FC } from "react";
import BranchesCtx from "../BranchesCtx";
import { subscribeToBranches } from "@/services/branches.services";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

const BranchesProvider: FC<Children> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isErrorBranches, setIsErrorBranches] = useState(false);

  const value = {
    branches,
    isLoadingBranches,
    isErrorBranches,
  };

  useEffect(() => {
    const unsubscribe = subscribeToBranches(
      (branches) => {
        setIsLoadingBranches(true);
        if (branches) {
          setBranches(branches);
          setIsLoadingBranches(false);
        }
      },
      () => {
        notify.error("Error al cargar los sectores y puestos de trabajo", {
          scope: TOAST_SCOPE.GLOBAL,
        });
        setIsErrorBranches(true);
      },
      () => {
        notify.info("Proceso de carga de sectores y puestos de trabajo finalizado", {
          scope: TOAST_SCOPE.GLOBAL,
        });
        setIsLoadingBranches(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return <BranchesCtx.Provider value={{ ...value }}>{children}</BranchesCtx.Provider>;
};

export default BranchesProvider;
