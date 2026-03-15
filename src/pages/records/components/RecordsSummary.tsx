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
    <section className="app-surface grid gap-3 p-4 sm:grid-cols-3">
      <article className="app-card p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Registros ({periodLabel[period]})
        </p>
        <strong className="mt-2 block text-2xl text-[var(--text)]">{recordsCount}</strong>
      </article>
      <article className="app-card p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Horas totales</p>
        <strong className="mt-2 block text-2xl text-[var(--text)]">
          {totalHoursDecimal.toFixed(2)}h
        </strong>
      </article>
      <article className="app-card p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Sueldo estimado
        </p>
        <strong className="mt-2 block text-2xl text-[var(--success)]">
          {formatCurrency(totalSalary)}
        </strong>
      </article>
    </section>
  );
};

export default RecordsSummary;
