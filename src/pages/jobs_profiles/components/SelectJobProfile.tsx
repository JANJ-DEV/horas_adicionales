import type { Branch, JobPosition } from "@/types";
import type { FC } from "react";

type SelectJobProfileProps = {
  branches?: Branch[];
  jobsPositions?: JobPosition[];
  onChangeSelectJobProfile?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
// import { useFilterBranches } from "@/hooks/useFilterBranches"; --- IGNORE ---
// Este componente tiene que devolver un select con las ramas o puestos de trabajo dependiendo de lo que se le pase por props

const SelectJobProfile: FC<SelectJobProfileProps> = ({
  branches,
  jobsPositions,
  onChangeSelectJobProfile,
}) => {
  if (branches) {
    return (
      <section className="flex flex-col gap-2">
        <label htmlFor="branch" className="text-2xl">Selecciona una rama:</label>
        <select
          name="branch"
          id="branch"
          aria-label="Select branch"
          onChange={onChangeSelectJobProfile}
          className="border py-2 rounded"
        >
          <option value="" disabled selected>
            Ramas
          </option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <label htmlFor="jobPosition" className="text-2xl">Selecciona un puesto de trabajo:</label>
      <select name="jobPosition" id="jobPosition" aria-label="Select job position" className="border py-2 rounded">
        <option value="" disabled selected className="text-xl">
          Puesto de trabajo
        </option>
        {jobsPositions?.map((job) => (
          <option key={job.id} value={job.id}>
            {job.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default SelectJobProfile;
