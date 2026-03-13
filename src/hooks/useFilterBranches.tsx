import useBranches from "@/context/hooks/useBranches.hook.";
import type { Branch, JobPosition } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

export const useFilterBranches = () => {
  const { branches } = useBranches();
  const [filteredbranches, setFilteredBranches] = useState<Branch[]>(branches);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>("");

  const handlerOnChangeBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
    toast.info(`Rama seleccionada: ${branchId}`, { containerId: "profile" });
  };

  const handlerOnChangeJobPosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobPositionId = e.target.value;
    setSelectedJobPosition(jobPositionId);
    toast.info(`Puesto de trabajo seleccionado: ${jobPositionId}`, { containerId: "profile" });
  };

  const getJobPositionByBranch = (selectedJobPosition: string) => {
    const branch = branches.find((branch: Branch) => branch.id === selectedBranch);
    if (!branch) return undefined;
    const jobPosition = branch.jobsPositions?.find(
      (job: JobPosition) => job.id === selectedJobPosition
    );
    return jobPosition;
  };

  const getBranch = (selectedBranch: string) =>
    branches
      .find((branch: Branch) => branch.id === selectedBranch)
      ?.jobsPositions?.map((job: JobPosition) => job);
  const getNameBranch = (selectedBranch: string) =>
    branches.find((branch: Branch) => branch.id === selectedBranch)?.name;
  const getNameJobPosition = (selectedJobPosition: string) => {
    const branch = branches.find((branch: Branch) => branch.id === selectedBranch);
    if (!branch) return undefined;
    const jobPosition = branch.jobsPositions?.find(
      (job: JobPosition) => job.id === selectedJobPosition
    );
    return jobPosition?.name;
  };
  return {
    filteredbranches,
    setFilteredBranches,
    selectedBranch,
    setSelectedBranch,
    handlerOnChangeBranch,
    selectedJobPosition,
    setSelectedJobPosition,
    handlerOnChangeJobPosition,
    getJobPositionByBranch,
    getBranch,
    getNameBranch,
    getNameJobPosition,
  };
};
