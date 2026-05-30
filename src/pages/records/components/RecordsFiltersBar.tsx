import type { Branch, JobProfile, JobPosition } from "@/types";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { MdFilterListOff } from "react-icons/md";

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
};

const EMPTY_FILTERS: RecordsFiltersState = {
  branchId: "",
  jobPositionId: "",
  jobProfileId: "",
  dateFrom: "",
  dateTo: "",
  minHourlyRate: "",
  maxHourlyRate: "",
  minWorkedHours: "",
  maxWorkedHours: "",
};

const inputCls =
  "w-full h-[38px] rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition duration-200 focus:border-[var(--accent)]";

const RecordsFiltersBar = ({
  branches,
  jobProfiles,
  filters,
  onFilterChange,
}: RecordsFiltersBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<RecordsFiltersState>(filters);

  const handleToggleFilters = () => {
    if (!isOpen) {
      setDraftFilters(filters);
    }

    setIsOpen((current) => !current);
  };

  const isMobileViewport = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const handleDraftChange = (name: keyof RecordsFiltersState, value: string) => {
    setDraftFilters((current) => {
      const next = { ...current, [name]: value };

      if (name === "branchId") {
        next.jobPositionId = "";
      }

      return next;
    });
  };

  const handleApply = () => {
    const keys = Object.keys(draftFilters) as Array<keyof RecordsFiltersState>;

    keys.forEach((key) => {
      if (draftFilters[key] !== filters[key]) {
        onFilterChange(key, draftFilters[key]);
      }
    });

    if (isMobileViewport()) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setDraftFilters(filters);
    setIsOpen(false);
  };

  const handleResetDraft = () => {
    setDraftFilters(EMPTY_FILTERS);
  };

  const selectedBranch = branches.find((branch) => branch.id === draftFilters.branchId) ?? null;
  const jobPositions: JobPosition[] = selectedBranch?.jobsPositions ?? [];
  const activeFiltersCount = Object.values(filters).filter((value) => value.trim() !== "").length;

  return (
    <div className="relative shrink-0">
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full  px-3 py-1.5 text-[var(--accent)] transition duration-200 hover:border-[var(--accent)]"
          onClick={handleToggleFilters}
          aria-expanded={isOpen}
          aria-controls="records-filters-panel"
        >
          Filtros{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
          <span className="text-[10px] text-[var(--text-soft)]">
            {isOpen ? (
              <MdFilterListOff size={32} className="text-red-300" />
            ) : (
              <MdFilterList size={32} />
            )}
          </span>
        </button>
      </div>

      {/* Panel de filtros absoluto */}
      <div
        id="records-filters-panel"
        className={`z-100 ${isOpen ? "fixed" : "hidden"} top-0 left-0 w-[100vw] h-[100vh] app-surface p-6 pb-24 overflow-auto transition-all duration-200 rounded-none shadow-2xl md:absolute md:top-15 md:left-auto md:right-0 md:mt-2 md:w-[480px] md:h-auto md:rounded-xl md:p-6 md:shadow-2xl md:border md:border-[var(--border)]`}
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      >
        <div className="flex justify-between items-center mb-4 mt-2">
          <span className="font-semibold text-lg md:hidden">Filtros Avanzados</span>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={handleResetDraft}
          >
            Limpiar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Rama
            <select
              value={draftFilters.branchId}
              onChange={(event) => handleDraftChange("branchId", event.target.value)}
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

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            <span className="truncate" title="Puesto de trabajo">Puesto</span>
            <select
              value={draftFilters.jobPositionId}
              onChange={(event) => handleDraftChange("jobPositionId", event.target.value)}
              className={inputCls}
              disabled={!draftFilters.branchId}
            >
              <option value="">Todos</option>
              {jobPositions.map((jobPosition) => (
                <option key={jobPosition.id} value={jobPosition.id}>
                  {jobPosition.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Perfil
            <select
              value={draftFilters.jobProfileId}
              onChange={(event) => handleDraftChange("jobProfileId", event.target.value)}
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

          <div className="col-span-1 md:col-span-3 h-px bg-[var(--border)] my-1" />

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Fecha desde
            <input
              type="date"
              value={draftFilters.dateFrom}
              onChange={(event) => handleDraftChange("dateFrom", event.target.value)}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Fecha hasta
            <input
              type="date"
              value={draftFilters.dateTo}
              onChange={(event) => handleDraftChange("dateTo", event.target.value)}
              className={inputCls}
            />
          </label>
          
          <div className="hidden md:block"></div>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Tarifa min
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={draftFilters.minHourlyRate}
              onChange={(event) => handleDraftChange("minHourlyRate", event.target.value)}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Tarifa max
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={draftFilters.maxHourlyRate}
              onChange={(event) => handleDraftChange("maxHourlyRate", event.target.value)}
              className={inputCls}
            />
          </label>
          
          <div className="hidden md:block"></div>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Horas min
            <input
              type="number"
              min="0"
              step="0.25"
              placeholder="0"
              value={draftFilters.minWorkedHours}
              onChange={(event) => handleDraftChange("minWorkedHours", event.target.value)}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Horas max
            <input
              type="number"
              min="0"
              step="0.25"
              placeholder="0"
              value={draftFilters.maxWorkedHours}
              onChange={(event) => handleDraftChange("maxWorkedHours", event.target.value)}
              className={inputCls}
            />
          </label>
        </div>
        
        <div className="mt-5 rounded-lg bg-[var(--bg-soft)] p-3 text-center border border-[var(--border)]">
          <p className="text-[11px] leading-relaxed text-[var(--text-soft)]">
            <strong className="text-[var(--text)]">Nota:</strong> El rango de fechas manual tiene prioridad sobre el selector rápido de periodo.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 mt-4 flex items-center justify-center gap-2 border-t border-[var(--border)] bg-[var(--bg)] px-6 py-3 md:static md:z-auto md:mx-0 md:mt-4 md:justify-center md:border-t-0 md:bg-transparent md:p-0">
          <button
            type="button"
            className="w-full md:w-auto rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-2.5 text-xs font-bold tracking-wide text-[var(--text)] transition duration-200 hover:border-[var(--border-strong)]"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="w-full md:w-auto rounded-full border border-[var(--accent)] bg-[var(--accent)] px-8 py-2.5 text-xs font-bold tracking-wide text-white transition duration-200 shadow-md hover:bg-[var(--accent-strong)] hover:shadow-lg"
            onClick={handleApply}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordsFiltersBar;
