import { getBranchById } from "@/services/branches.services";
import type { JobPosition } from "@/types";
import { useEffect, useState, type ChangeEvent, type FC } from "react";
import SelectField from "@/components/SelectField";

type SelectJobPositionProps = {
  branchId?: string;
  name?: string;
  value?: string;
  jobsPositions?: JobPosition[];
  variant?: "name" | "id";
  onChangeSelectJobPosition?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectJobPositionFromBranchId: FC<SelectJobPositionProps> = ({
  branchId,
  name = "jobPosition",
  value,
  variant = "id",
  onChangeSelectJobPosition,
}) => {
  const [jobsPositions, setJobsPositions] = useState<JobPosition[]>([]);
  useEffect(() => {
    if (branchId) {
      getBranchById(branchId).then((branch) => {
        setJobsPositions(branch?.jobsPositions ?? []);
      });
    }
  }, [branchId]);

  return (
    <SelectField
      label="Selecciona un puesto de trabajo:"
      name={name}
      id={name}
      value={value}
      onChange={onChangeSelectJobPosition}
      placeholder="Puesto de trabajo"
      options={jobsPositions.map((jobPosition) => ({
        value: variant === "id" ? jobPosition.id : jobPosition.name,
        label: jobPosition.name,
      }))}
    />
  );
};

export default SelectJobPositionFromBranchId;
