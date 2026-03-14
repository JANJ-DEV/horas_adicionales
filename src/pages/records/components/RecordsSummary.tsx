import type { RecordsPeriod } from "@/utils";

type RecordsSummaryProps = {
  period: RecordsPeriod;
  recordsCount: number;
  totalHoursDecimal: number;
  totalSalary: number;
};

const periodLabel: Record<RecordsPeriod, string> = {
  day: "hoy",
  week: "esta semana",
  month: "este mes",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const RecordsSummary = ({
  period,
  recordsCount,
  totalHoursDecimal,
  totalSalary,
}: RecordsSummaryProps) => {
  return (
    <section className="grid gap-3 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4 sm:grid-cols-3">
      <article className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-300">Registros ({periodLabel[period]})</p>
        <strong className="text-2xl text-cyan-100">{recordsCount}</strong>
      </article>
      <article className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-300">Horas totales</p>
        <strong className="text-2xl text-cyan-100">{totalHoursDecimal.toFixed(2)}h</strong>
      </article>
      <article className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-300">Sueldo estimado</p>
        <strong className="text-2xl text-emerald-300">{formatCurrency(totalSalary)}</strong>
      </article>
    </section>
  );
};

export default RecordsSummary;
