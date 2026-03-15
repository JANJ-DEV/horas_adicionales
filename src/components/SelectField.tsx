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
  className = "w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition duration-300 focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]/15 disabled:cursor-not-allowed disabled:opacity-60 lg:text-base",
  labelClassName = "text-sm font-semibold text-[var(--text)] lg:text-base",
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
        <option value="" disabled className="bg-[var(--surface-strong)] text-[var(--text-soft)]">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-[var(--surface-strong)] text-[var(--text)]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </section>
  );
};

export default SelectField;
