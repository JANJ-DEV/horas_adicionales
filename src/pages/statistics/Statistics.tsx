import { lazy, Suspense, useState } from "react";
import useAuth from "@/context/hooks/auth.hook";
import { useJobsProfiles } from "@/pages/jobs_profiles/hooks/useJobsProfiles";
import { useRecord } from "@/pages/records/hooks/useRecord";
import { getStoredProfile, UNASSIGNED_PROFILE } from "@/pages/records/profileSelection";
import {
  buildStatistics,
  localDateValue,
  shiftPeriod,
  type StatisticsPeriod,
} from "./calculations";

const StatisticsChart = lazy(() => import("./StatisticsChart"));

const periodOptions: Array<{ value: StatisticsPeriod; label: string }> = [
  { value: "year", label: "Año" },
  { value: "semester", label: "Semestre" },
  { value: "quarter", label: "Trimestre" },
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Día" },
];
const currency = (value: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(date);
const control =
  "rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text)]";

const Statistics = () => {
  const { currentUser } = useAuth();
  const { jobs, isLoading: profilesLoading, isError: profilesError } = useJobsProfiles();
  const { records, isLoading, isError } = useRecord();
  const [period, setPeriod] = useState<StatisticsPeriod>("month");
  const [reference, setReference] = useState(() => localDateValue(new Date()));
  const [chartKind, setChartKind] = useState<"table" | "bar" | "line" | "pie">("table");
  const [metric, setMetric] = useState<"totalHoursDecimal" | "totalSalary" | "count">(
    "totalHoursDecimal"
  );
  const [selectedProfile, setSelectedProfile] = useState(
    () => getStoredProfile(currentUser?.uid) || "all"
  );
  const profilesById = new Set(jobs.map((profile) => profile.id));
  const hasUnassigned = records.some(
    (record) => !record.jobProfileId || !profilesById.has(record.jobProfileId)
  );
  const profileId =
    selectedProfile === "all" ||
    (selectedProfile === UNASSIGNED_PROFILE && hasUnassigned) ||
    profilesById.has(selectedProfile)
      ? selectedProfile
      : "all";
  const profileRecords =
    profileId === "all"
      ? records
      : profileId === UNASSIGNED_PROFILE
        ? records.filter((record) => !record.jobProfileId || !profilesById.has(record.jobProfileId))
        : records.filter((record) => record.jobProfileId === profileId);
  const referenceDate = new Date(`${reference}T00:00:00`);
  const stats = buildStatistics(profileRecords, period, referenceDate);
  const inclusiveEnd = new Date(stats.end);
  inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
  const maxHours = Math.max(0, ...stats.rows.map((row) => row.totalHoursDecimal));
  const loading = isLoading || profilesLoading;
  const failed = isError || profilesError;

  return (
    <section className="flex min-w-0 flex-col gap-5 pb-6">
      <div>
        <p className="section-kicker">Resumen de actividad</p>
        <h1 className="mt-3 font-[var(--font-display)] text-3xl font-bold text-[var(--text)]">
          Estadísticas
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Consulta tus jornadas, horas y sueldo estimado por período.
        </p>
      </div>
      <section
        className="app-surface flex flex-wrap items-end gap-4 p-4"
        aria-label="Opciones de estadísticas"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Perfil
          <select
            className={control}
            aria-label="Perfil de estadísticas"
            value={profileId}
            onChange={(event) => setSelectedProfile(event.target.value)}
          >
            <option value="all">Todos los perfiles</option>
            {jobs.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.title}
              </option>
            ))}
            {!profilesLoading && hasUnassigned && (
              <option value={UNASSIGNED_PROFILE}>Sin perfil</option>
            )}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Período
          <select
            className={control}
            aria-label="Período de estadísticas"
            value={period}
            onChange={(event) => setPeriod(event.target.value as StatisticsPeriod)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Fecha de referencia
          <input
            className={control}
            type="date"
            aria-label="Fecha de referencia"
            value={reference}
            onChange={(event) => {
              if (event.target.value) setReference(event.target.value);
            }}
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className={control}
            onClick={() => setReference(localDateValue(shiftPeriod(period, referenceDate, -1)))}
            aria-label="Período anterior"
          >
            ← Anterior
          </button>
          <button
            type="button"
            className={control}
            onClick={() => setReference(localDateValue(shiftPeriod(period, referenceDate, 1)))}
            aria-label="Período siguiente"
          >
            Siguiente →
          </button>
          <button
            type="button"
            className={control}
            onClick={() => setReference(localDateValue(new Date()))}
          >
            Hoy
          </button>
        </div>
      </section>
      {loading ? (
        <p className="app-surface p-4 text-[var(--text-muted)]">Cargando estadísticas...</p>
      ) : failed ? (
        <p className="app-surface p-4 text-[var(--danger)]">
          No se pudieron cargar las estadísticas. Vuelve a intentarlo.
        </p>
      ) : (
        <>
          <p className="text-sm text-[var(--text-muted)]">
            {dateLabel(stats.start)}
            {period !== "day" && ` – ${dateLabel(inclusiveEnd)}`}
          </p>
          <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen del período">
            <article className="app-card p-4">
              <p className="text-sm text-[var(--text-muted)]">Jornadas</p>
              <strong className="mt-2 block text-2xl">{stats.count}</strong>
            </article>
            <article className="app-card p-4">
              <p className="text-sm text-[var(--text-muted)]">Horas totales</p>
              <strong className="mt-2 block text-2xl">
                {stats.totalHoursDecimal.toFixed(2)} h
              </strong>
            </article>
            <article className="app-card p-4">
              <p className="text-sm text-[var(--text-muted)]">Sueldo estimado</p>
              <strong className="mt-2 block text-2xl text-[var(--success)]">
                {currency(stats.totalSalary)}
              </strong>
            </article>
          </section>
          <section className="app-surface p-4 sm:p-5">
            <h2 className="font-[var(--font-display)] text-xl font-bold">Desglose de actividad</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Horas trabajadas por{" "}
              {period === "year" || period === "semester" || period === "quarter" ? "mes" : "día"}.
            </p>
            {stats.rows.length === 0 ? (
              <p className="mt-5 text-sm text-[var(--text-muted)]">
                No hay registros para este perfil y período.
              </p>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-1 text-sm font-semibold">
                    Vista
                    <select
                      className={control}
                      aria-label="Vista de estadísticas"
                      value={chartKind}
                      onChange={(event) => setChartKind(event.target.value as typeof chartKind)}
                    >
                      <option value="table">Tabla</option>
                      <option value="bar">Barras</option>
                      <option value="line">Líneas</option>
                      <option value="pie">Circular</option>
                    </select>
                  </label>
                  {chartKind !== "table" && (
                    <label className="flex flex-col gap-1 text-sm font-semibold">
                      Dato
                      <select
                        className={control}
                        aria-label="Dato del gráfico"
                        value={metric}
                        onChange={(event) => setMetric(event.target.value as typeof metric)}
                      >
                        <option value="totalHoursDecimal">Horas</option>
                        <option value="totalSalary">Sueldo estimado</option>
                        <option value="count">Jornadas</option>
                      </select>
                    </label>
                  )}
                </div>
                {chartKind !== "table" && (
                  <div className="mt-5">
                    <Suspense
                      fallback={
                        <p className="text-sm text-[var(--text-muted)]">Cargando gráfico...</p>
                      }
                    >
                      <StatisticsChart
                        rows={stats.rows}
                        start={stats.start}
                        end={stats.end}
                        period={period}
                        kind={chartKind}
                        metric={metric}
                      />
                    </Suspense>
                  </div>
                )}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Jornadas</th>
                        <th className="p-2">Horas</th>
                        <th className="p-2">Sueldo estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.rows.map((row) => (
                        <tr key={row.key} className="border-b border-[var(--border)]">
                          <th scope="row" className="p-2 font-medium capitalize">
                            {row.label}
                          </th>
                          <td className="p-2">{row.count}</td>
                          <td className="p-2">
                            <span>{row.totalHoursDecimal.toFixed(2)} h</span>
                            <span
                              aria-hidden="true"
                              className="mt-1 block h-1.5 w-24 overflow-hidden rounded-sm bg-[var(--bg-soft)]"
                            >
                              <span
                                className="block h-full bg-[var(--accent)]"
                                style={{
                                  width: `${maxHours ? (row.totalHoursDecimal / maxHours) * 100 : 0}%`,
                                }}
                              />
                            </span>
                          </td>
                          <td className="p-2">{currency(row.totalSalary)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </section>
  );
};
export default Statistics;
