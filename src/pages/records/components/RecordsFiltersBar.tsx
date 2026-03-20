import type { Branch, JobProfile, JobPosition } from "@/types";
import { useState } from "react";

export type RecordsFiltersState = {
  branchId: string;
  jobPositionId: string;
  jobProfileId: string;
  dateFrom: string;
  dateTo: string;
  minHourlyRate: string;
  maxHourlyRate: string;
  minWorkedHours: string;
  maxWorkedHours: string;
};

type RecordsFiltersBarProps = {
  branches: Branch[];
  jobProfiles: JobProfile[];
  filters: RecordsFiltersState;
  onFilterChange: (name: keyof RecordsFiltersState, value: string) => void;
  onReset: () => void;
};

const inputCls =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition duration-200 focus:border-[var(--accent)]";

const RecordsFiltersBar = ({
  branches,
  jobProfiles,
  filters,
  onFilterChange,
  onReset,
}: RecordsFiltersBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBranch = branches.find((branch) => branch.id === filters.branchId) ?? null;
  const jobPositions: JobPosition[] = selectedBranch?.jobsPositions ?? [];
  const activeFiltersCount = Object.values(filters).filter((value) => value.trim() !== "").length;

  return (
    <div className="relative">
      <div className="w-full flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] transition duration-200 hover:border-[var(--accent)]"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="records-filters-panel"
        >
          Filtros{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
          <span className="text-[10px] text-[var(--text-soft)]">{isOpen ? "Ocultar" : "Mostrar"}</span>
        </button>
      </div>

      {/* Panel de filtros absoluto */}
      <div
        id="records-filters-panel"
        className={`z-40 ${isOpen ? "fixed" : "hidden"} top-0 left-0 w-[100vw] h-[100vh] app-surface p-6 overflow-auto transition-all duration-200 rounded-none shadow-2xl
        md:absolute md:top-auto md:left-auto md:right-0 md:mt-2 md:w-[380px] md:h-auto md:rounded-xl md:p-4 md:shadow-xl`}
        style={{maxWidth: '100vw', maxHeight: '100vh'}}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <span className="font-semibold text-lg">Filtros</span>
          <button onClick={() => setIsOpen(false)} className="text-[var(--accent)] text-xl">✕</button>
        </div>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] mb-4 md:mb-0"
          onClick={onReset}
        >
          Limpiar filtros
        </button>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Rama
          <select
            value={filters.branchId}
            onChange={(event) => onFilterChange("branchId", event.target.value)}
            className={inputCls}
          >
            <option value="">Todas</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Puesto de trabajo
          <select
            value={filters.jobPositionId}
            onChange={(event) => onFilterChange("jobPositionId", event.target.value)}
            className={inputCls}
            disabled={!filters.branchId}
          >
            <option value="">Todos</option>
            {jobPositions.map((jobPosition) => (
              <option key={jobPosition.id} value={jobPosition.id}>
                {jobPosition.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Perfil
          <select
            value={filters.jobProfileId}
            onChange={(event) => onFilterChange("jobProfileId", event.target.value)}
            className={inputCls}
          >
            <option value="">Todos</option>
            {jobProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Fecha desde
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onFilterChange("dateFrom", event.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Fecha hasta
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onFilterChange("dateTo", event.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Tarifa min
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={filters.minHourlyRate}
            onChange={(event) => onFilterChange("minHourlyRate", event.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Tarifa max
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={filters.maxHourlyRate}
            onChange={(event) => onFilterChange("maxHourlyRate", event.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Horas min
          <input
            type="number"
            min="0"
            step="0.25"
            placeholder="0"
            value={filters.minWorkedHours}
            onChange={(event) => onFilterChange("minWorkedHours", event.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          Horas max
          <input
            type="number"
            min="0"
            step="0.25"
            placeholder="0"
            value={filters.maxWorkedHours}
            onChange={(event) => onFilterChange("maxWorkedHours", event.target.value)}
            className={inputCls}
          />
        </label>
        </div>
        <p className="text-xs text-[var(--text-soft)] mt-4">
          Si defines rango de fechas, tiene prioridad sobre el selector rápido de periodo.
        </p>
      </div>
    </div>
  );
};

export default RecordsFiltersBar;
