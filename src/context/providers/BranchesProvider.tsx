import type { Branch, Children } from "@/types";
import { useEffect, useState, type FC } from "react";
import BranchesCtx from "../BranchesCtx";
import { subscribeToBranches } from "@/services/branches.services";
import { toast } from "react-toastify";

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
        toast.error("Error al cargar los sectores y puestos de trabajo", {
          containerId: "global",
        });
        setIsErrorBranches(true);
      },
      () => {
        toast.info("Proceso de carga de sectores y puestos de trabajo finalizado", {
          containerId: "global",
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
