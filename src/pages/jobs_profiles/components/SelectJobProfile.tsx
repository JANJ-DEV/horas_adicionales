import type { Branch } from "@/types";
import type { FC } from "react";

type SelectJobProfileProps = {
  branches?: Branch[];
  onChangeSelectJobProfile?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectJobProfile: FC<SelectJobProfileProps> = ({ branches, onChangeSelectJobProfile }) => {
  return (
    branches && (
      <section className="flex flex-col gap-2">
        <label htmlFor="branch" className="text-2xl">
          Selecciona una rama:
        </label>
        <select
          name="branch"
          id="branch"
          aria-label="Select branch"
          onChange={onChangeSelectJobProfile}
          className="border py-2 rounded"
        >
          <option value="" disabled>
            Ramas
          </option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </section>
    )
  );
};

export default SelectJobProfile;
