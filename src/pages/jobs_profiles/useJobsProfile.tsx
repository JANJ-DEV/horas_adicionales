import type { Branch } from "@/types";
import { useState } from "react";

export const useJobsProfile = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  return {
    branches,
    setBranches,
  };
};
