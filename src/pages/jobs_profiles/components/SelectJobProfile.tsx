import type { Branch } from "@/types";
import type { ChangeEvent, FC } from "react";
import SelectField from "@/components/SelectField";

type SelectJobProfileProps = {
  branches?: Branch[];
  onChangeSelectJobProfile?: (event: ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  value?: string;
  disabled?: boolean;
  label?: string;
};

const SelectJobProfile: FC<SelectJobProfileProps> = ({
  branches,
  onChangeSelectJobProfile,
  name = "branch",
  id = "branch",
  value,
  disabled,
  label = "Selecciona una rama:",
}) => {
  if (!branches) return null;

  return (
    <SelectField
      label={label}
      name={name}
      id={id}
      value={value}
      disabled={disabled}
      onChange={onChangeSelectJobProfile}
      placeholder="Ramas"
      options={branches.map((branch) => ({
        value: branch.id,
        label: branch.name,
      }))}
    />
  );
};

export default SelectJobProfile;
