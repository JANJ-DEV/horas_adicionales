import { type FC } from "react";
import { calculateSalary, calculateWorkedHours } from "@/utils";
import HoursCalculationTooltip from "@/components/HoursCalculationTooltip";

interface RecordCalculationSummaryProps {
  startTime?: string;
  endTime?: string;
  hourlyRate: number;
}

const RecordCalculationSummary: FC<RecordCalculationSummaryProps> = ({
  startTime,
  endTime,
  hourlyRate,
}) => {
  const hasWorkedTime = Boolean(startTime && endTime);
  const workedHours = hasWorkedTime
    ? calculateWorkedHours(startTime as string, endTime as string)
    : null;
  const salary = workedHours ? calculateSalary(workedHours.decimal, hourlyRate) : 0;

  return (
    <footer
      className="app-panel flex min-w-0 flex-col overflow-hidden"
      title="Total de horas trabajadas y salario calculado (horas:minutos / decimal)"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <span className="min-w-0 break-words text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Informacion del calculo
        </span>
        {hasWorkedTime && startTime && endTime && (
          <HoursCalculationTooltip
            startTime={startTime}
            endTime={endTime}
            hourlyRate={hourlyRate}
          />
        )}
      </div>

      {hasWorkedTime && workedHours && (
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <header
              className="flex min-w-0 flex-wrap items-center gap-2"
              title="Horas trabajadas en formato horas:minutos"
            >
              <strong className="text-[var(--accent-strong)]">Total:</strong>
              <span className="break-words text-[var(--text)]">{workedHours.formatted}</span>
            </header>
            <section className="shrink-0" title="Horas trabajadas en formato decimal">
              (<small className="text-[var(--accent-warm)]"> {workedHours.decimal}</small>)
            </section>
          </div>
          <div
            className="flex min-w-0 flex-wrap items-center gap-2"
            title="Calculos basados en horas trabajadas y tarifa horaria, configurable en el perfil de trabajo"
          >
            <strong className="text-[var(--accent-warm)]">Salario estimado:</strong>
            <span className="break-words text-[var(--success)]">{salary}</span>
          </div>
        </div>
      )}
    </footer>
  );
};

export default RecordCalculationSummary;
