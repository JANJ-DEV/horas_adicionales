import type { RecordsPeriod } from "@/utils";
import { MdDateRange, MdEventRepeat } from "react-icons/md";

type RecordsPeriodSelectorProps = {
  value: RecordsPeriod;
  onChange: (nextValue: RecordsPeriod) => void;
  sinceDate: string;
  onChangeSinceDate: (date: string) => void;
  cycleOptions: Array<{ key: string; monthLabel: string; groupLabel: string }>;
  selectedCycle: string;
  onChangeCycle: (cycle: string) => void;
  disabled?: boolean;
};

const PERIOD_OPTIONS: Array<{ value: RecordsPeriod; label: string }> = [
  { value: "all", label: "Todos los registros" },
  { value: "day", label: "Dia" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes Natural" },
  { value: "quarter", label: "Trimestre natural" },
  { value: "semester", label: "Semestre natural" },
  { value: "since", label: "Desde una fecha" },
  { value: "custom_cycle", label: "Ciclo de Facturación" },
];

const RecordsPeriodSelector = ({
  value,
  onChange,
  sinceDate,
  onChangeSinceDate,
  cycleOptions,
  selectedCycle,
  onChangeCycle,
  disabled = false,
}: RecordsPeriodSelectorProps) => {
  const groupedCycles = new Map<string, RecordsPeriodSelectorProps["cycleOptions"]>();
  for (const cycle of cycleOptions) {
    const group = groupedCycles.get(cycle.groupLabel) ?? [];
    group.push(cycle);
    groupedCycles.set(cycle.groupLabel, group);
  }
  return (
    <section className="flex min-w-0 w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-4">
      <div className="flex min-w-0 items-center gap-2">
        <MdDateRange
          aria-hidden="true"
          className="shrink-0 text-xl text-[var(--accent)] md:hidden"
        />
        <strong className="sr-only md:not-sr-only md:px-2 md:text-xs md:uppercase md:tracking-[0.18em] md:text-[var(--accent)]">
          Período
        </strong>
        <div className="relative min-w-0 w-full md:w-auto">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value as RecordsPeriod)}
            disabled={disabled}
            aria-label="Seleccionar periodo"
            className={`w-full min-w-0 appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] pl-3 pr-9 py-2 text-sm font-semibold transition duration-300 focus:border-[var(--accent)] focus:outline-none md:w-auto md:pl-4 md:pr-12 ${
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

      {value === "since" && (
        <label className="flex min-w-0 items-center gap-2 text-sm text-[var(--text)]">
          <MdDateRange
            aria-hidden="true"
            className="shrink-0 text-xl text-[var(--accent)] md:hidden"
          />
          <span className="sr-only md:not-sr-only">Desde</span>
          <input
            type="date"
            value={sinceDate}
            onChange={(event) => onChangeSinceDate(event.target.value)}
            disabled={disabled}
            className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 md:w-auto"
          />
        </label>
      )}
      {value === "custom_cycle" && (
        <label className="flex min-w-0 items-center gap-2 text-sm text-[var(--text)]">
          <MdEventRepeat
            aria-hidden="true"
            className="shrink-0 text-xl text-[var(--accent)] md:hidden"
          />
          <span className="sr-only md:not-sr-only">Ciclo</span>
          <select
            aria-label="Seleccionar ciclo de facturación"
            value={selectedCycle}
            onChange={(event) => onChangeCycle(event.target.value)}
            disabled={disabled || cycleOptions.length === 0}
            className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[var(--text)] md:w-auto md:max-w-full"
          >
            {cycleOptions.length === 0 && (
              <option value="">No hay perfiles con ciclo configurado</option>
            )}
            {Array.from(groupedCycles, ([groupLabel, cycles]) => (
              <optgroup key={groupLabel} label={groupLabel}>
                {cycles.map((cycle) => (
                  <option key={cycle.key} value={cycle.key}>
                    {cycle.monthLabel}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      )}
    </section>
  );
};

export default RecordsPeriodSelector;
