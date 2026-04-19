import type { RecordsPeriod } from "@/utils";

type RecordsPeriodSelectorProps = {
  value: RecordsPeriod;
  onChange: (nextValue: RecordsPeriod) => void;
  disabled?: boolean;
};

const PERIOD_OPTIONS: Array<{ value: RecordsPeriod; label: string }> = [
  { value: "day", label: "Dia" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

const RecordsPeriodSelector = ({ value, onChange, disabled = false }: RecordsPeriodSelectorProps) => {
  return (
    <section className="flex items-center gap-2">
      <strong className="px-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        Periodo
      </strong>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as RecordsPeriod)}
          disabled={disabled}
          aria-label="Seleccionar periodo"
          className={`appearance-none rounded-full border border-[var(--border)] bg-[var(--bg-soft)] pl-4 pr-12 py-2 text-sm font-semibold transition duration-300 focus:border-[var(--accent)] focus:outline-none ${
            disabled
              ? "cursor-not-allowed text-[var(--text-muted)] opacity-60"
              : "cursor-pointer text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-soft)]"
        >
          ▼
        </span>
      </div>
    </section>
  );
};

export default RecordsPeriodSelector;
