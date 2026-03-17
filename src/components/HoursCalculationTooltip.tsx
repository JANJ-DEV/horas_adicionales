import { type FC } from "react";
import { calculateSalary, calculateWorkedHours } from "@/utils";
import InfoTooltip from "@/components/InfoTooltip";

interface HoursCalculationTooltipProps {
  startTime: string;
  endTime: string;
  hourlyRate: number;
}

const HoursCalculationTooltip: FC<HoursCalculationTooltipProps> = ({
  startTime,
  endTime,
  hourlyRate,
}) => {
  const workedHours = calculateWorkedHours(startTime, endTime);
  const salary = calculateSalary(workedHours.decimal, hourlyRate);

  return (
    <InfoTooltip
      ariaLabel="Ver como se calcula el total de horas"
      content={
        <>
          <p className="font-semibold text-[var(--text)]">Como se calcula:</p>
          <p>1. Se calcula la diferencia entre entrada y salida.</p>
          <p>2. Se muestra en formato horas:minutos: {workedHours.formatted}.</p>
          <p>3. Se convierte a formato decimal: {workedHours.decimal}.</p>
          <p>
            4. Salario = horas decimales x tarifa ({hourlyRate}) = {salary}.
          </p>
        </>
      }
    />
  );
};

export default HoursCalculationTooltip;
