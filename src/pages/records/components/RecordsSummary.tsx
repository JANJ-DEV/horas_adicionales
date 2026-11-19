import type { RecordsPeriod } from "@/utils";

type RecordsSummaryProps = {
  period: RecordsPeriod | null;
  recordsCount: number;
  totalHoursDecimal: number;
  totalSalary: number;
};

const periodLabel: Record<RecordsPeriod | "range", string> = {
  all: "total",
  day: "hoy",
  week: "esta semana",
  month: "este mes",
  quarter: "este trimestre",
  semester: "este semestre",
  since: "desde la fecha",
  custom_cycle: "ciclo seleccionado",
  range: "periodo seleccionado",
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
    <section className="grid gap-1 text-xs">
      <article className="flex items-center justify-between gap-2">
        <p className="text-[var(--text-soft)]">Registros ({periodLabel[period ?? "range"]})</p>
        <strong className="text-sm text-[var(--text)]">{recordsCount}</strong>
      </article>
      <article className="flex items-center justify-between gap-2">
        <p className="text-[var(--text-soft)]">Horas totales</p>
        <strong className="text-sm text-[var(--text)]">{totalHoursDecimal.toFixed(2)}h</strong>
      </article>
      <article className="flex items-center justify-between gap-2">
        <p className="text-[var(--text-soft)]">Sueldo estimado</p>
        <strong className="text-sm text-[var(--success)]">{formatCurrency(totalSalary)}</strong>
      </article>
    </section>
  );
};

export default RecordsSummary;
