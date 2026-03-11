import type { FC } from "react";

const EstimatedHourlyRate: FC<{ rate: number | null | undefined }> = ({ rate }) => {
  if (!rate) return null;
  return (
    <p className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
      Tarifa estimada: {rate} EUR/hora
    </p>
  );
};

export default EstimatedHourlyRate;
