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
    <section className="flex flex-wrap items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-900/50 p-2">
      <strong className="px-2 text-xs uppercase tracking-wide text-cyan-300">Periodo</strong>
      {PERIOD_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-400/70"
                : "bg-slate-800/70 text-slate-200 hover:bg-slate-700"
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
