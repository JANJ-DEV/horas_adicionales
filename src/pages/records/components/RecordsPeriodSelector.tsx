import type { RecordsPeriod } from "@/utils";

type RecordsPeriodSelectorProps = {
  value: RecordsPeriod;
  onChange: (nextValue: RecordsPeriod) => void;
  cycleStartDay?: number;
  onChangeCycleStartDay?: (day: number) => void;
  disabled?: boolean;
};

const PERIOD_OPTIONS: Array<{ value: RecordsPeriod; label: string }> = [
  { value: "day", label: "Dia" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes Natural" },
  { value: "custom_cycle", label: "Ciclo de Facturación" },
];

const RecordsPeriodSelector = ({
  value,
  onChange,
  cycleStartDay = 1,
  onChangeCycleStartDay,
  disabled = false,
}: RecordsPeriodSelectorProps) => {
  return (
    <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
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
      </div>

      {value === "custom_cycle" && (
        <div className="flex items-center gap-2 ml-2 sm:ml-0 animate-fade-in">
          <strong className="px-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
            Día Inicio:
          </strong>
          <input
            type="number"
            min="1"
            max="28"
            value={cycleStartDay || ""}
            onChange={(e) => {
              const strVal = e.target.value;
              if (strVal === "") {
                onChangeCycleStartDay?.(0); // 0 temporalmente para poder vaciar el input
                return;
              }
              const val = parseInt(strVal, 10);
              if (!isNaN(val)) {
                onChangeCycleStartDay?.(val);
              }
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10);
              if (isNaN(val) || val < 1) onChangeCycleStartDay?.(1);
              if (val > 28) onChangeCycleStartDay?.(28);
            }}
            disabled={disabled}
            className={`w-16 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-center text-sm font-semibold transition duration-300 focus:border-[var(--accent)] focus:outline-none ${
              disabled
                ? "cursor-not-allowed text-[var(--text-muted)] opacity-60"
                : "text-[var(--text)]"
            }`}
            aria-label="Día de inicio del ciclo"
            title="Día del mes en el que empieza tu ciclo de facturación (1-28)"
          />
        </div>
      )}
    </section>
  );
};

export default RecordsPeriodSelector;
