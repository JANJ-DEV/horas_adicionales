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
      className="flex min-w-0 flex-col rounded bg-slate-900/50"
      title="Total de horas trabajadas y salario calculado (horas:minutos / decimal)"
    >
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="min-w-0 break-words text-info">Informacion del calculo</span>
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
              <strong className="text-violet-400">Total:</strong>
              <span className="break-words">{workedHours.formatted}</span>
            </header>
            <section className="shrink-0" title="Horas trabajadas en formato decimal">
              (<small className="text-orange-300"> {workedHours.decimal}</small>)
            </section>
          </div>
          <div
            className="flex min-w-0 flex-wrap items-center gap-2"
            title="Calculos basados en horas trabajadas y tarifa horaria, configurable en el perfil de trabajo"
          >
            <strong className="text-warning">Salario estimado:</strong>
            <span className="break-words text-success">{salary}</span>
          </div>
        </div>
      )}
    </footer>
  );
};

export default RecordCalculationSummary;
