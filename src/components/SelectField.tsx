import type { ChangeEvent, FC } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  label: string;
  name: string;
  id?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
};

const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  id,
  options,
  value,
  onChange,
  disabled,
  placeholder = "Selecciona una opción",
  className = "w-full rounded border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60 lg:text-base",
  labelClassName = "text-sm font-medium text-slate-200 lg:text-base",
  containerClassName = "flex flex-col gap-2",
}) => {
  const selectId = id ?? name;

  return (
    <section className={containerClassName}>
      <label htmlFor={selectId} className={labelClassName}>
        {label}
      </label>
      <select
        name={name}
        id={selectId}
        aria-label={label}
        onChange={onChange}
        className={className}
        value={value}
        disabled={disabled}
      >
        <option value="" disabled className="bg-slate-900 text-slate-400">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-slate-900 text-slate-100"
          >
            {option.label}
          </option>
        ))}
      </select>
    </section>
  );
};

export default SelectField;
