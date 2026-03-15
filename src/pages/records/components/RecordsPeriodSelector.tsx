import type { RecordsPeriod } from "@/utils";

type RecordsPeriodSelectorProps = {
  value: RecordsPeriod;
  onChange: (nextValue: RecordsPeriod) => void;
};

const PERIOD_OPTIONS: Array<{ value: RecordsPeriod; label: string }> = [
  { value: "day", label: "Dia" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];

const RecordsPeriodSelector = ({ value, onChange }: RecordsPeriodSelectorProps) => {
  return (
    <section className="app-surface flex flex-wrap items-center gap-2 p-2.5">
      <strong className="px-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        Periodo
      </strong>
      {PERIOD_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
              isActive
                ? "bg-[var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)]"
                : "bg-[var(--bg-soft)] text-[var(--text)] hover:text-[var(--accent)]"
            }`}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </section>
  );
};

export default RecordsPeriodSelector;
