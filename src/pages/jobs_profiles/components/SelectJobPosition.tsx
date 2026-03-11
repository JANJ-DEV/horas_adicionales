import { getBranchById } from "@/services/branches.services";
import type { JobPosition } from "@/types";
import { useEffect, useState, type ChangeEvent, type FC } from "react";

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
    <section className="flex flex-col gap-2">
      <label htmlFor={name} className="text-2xl">
        Selecciona un puesto de trabajo:
      </label>
      <select
        name={name}
        id={name}
        aria-label="Select job position"
        onChange={onChangeSelectJobPosition}
        className="border py-2 rounded"
        value={value}
      >
        <option value="" disabled>
          Puesto de trabajo
        </option>
        {jobsPositions.map((jobPosition) => (
          <option key={jobPosition.id} value={variant === "id" ? jobPosition.id : jobPosition.name}>
            {jobPosition.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default SelectJobPositionFromBranchId;
