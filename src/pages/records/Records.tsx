import RecordCard from "./components/RecordCard";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.services";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { Branch, JobProfile } from "@/types";
import RecordsPeriodSelector from "./components/RecordsPeriodSelector";
import RecordsSummary from "./components/RecordsSummary";
import RecordsListGrid from "./components/RecordsListGrid";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";
import RecordsFiltersBar, { type RecordsFiltersState } from "./components/RecordsFiltersBar";
import { MdViewList, MdViewAgenda, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useRecordsFiltering } from "./hooks/useRecordsFiltering";
import { clearPendingSelectedRecordId, getPendingSelectedRecordId } from "./recordNavigation";

const PAGE_SIZE = 9;
const VIEW_MODE_STORAGE_KEY = "records:view-mode";
const SUMMARY_VISIBLE_STORAGE_KEY = "records:summary-visible";

type ViewMode = "card" | "list";

const getStoredViewMode = (): ViewMode => {
  if (typeof window === "undefined") return "card";
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return stored === "list" ? "list" : "card";
  } catch {
    return "card";
  }
};

const setStoredViewMode = (mode: ViewMode) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    // localStorage no disponible
  }
};

const getStoredSummaryVisible = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(SUMMARY_VISIBLE_STORAGE_KEY);
    return stored !== "false";
  } catch {
    return true;
  }
};

const setStoredSummaryVisible = (isVisible: boolean) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUMMARY_VISIBLE_STORAGE_KEY, String(isVisible));
  } catch {
    // localStorage no disponible
  }
};

const Records = () => {
  const {
    filters,
    hasManualDateRange,
    selectedPeriod,
    recordsByPeriod,
    summary,
    effectiveSummaryPeriod,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
    handlePeriodChange,
    handleFilterChange,
  } = useRecordsFiltering();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [hasJobProfiles, setHasJobProfiles] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingSelectedRecordId, setPendingSelectedRecordId] = useState<string | null>(() =>
    getPendingSelectedRecordId()
  );
  const [viewMode, setViewMode] = useState<ViewMode>(() => getStoredViewMode());
  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(() =>
    getStoredSummaryVisible()
  );

  useEffect(() => {
    if (!hasCurrentUser) {
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setJobProfiles(profiles);
        setHasJobProfiles(profiles.length > 0);
        setIsLoadingProfiles(false);
      },
      () => {
        setJobProfiles([]);
        setIsLoadingProfiles(false);
      },
      () => {
        setIsLoadingProfiles(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [hasCurrentUser]);

  useEffect(() => {
    const unsubscribe = subscribeToBranches((nextBranches) => {
      setBranches(nextBranches);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const branchNameById = Object.fromEntries(
    branches.map((branch) => [branch.id, branch.name])
  ) as Record<string, string>;

  const jobPositionNameByCompositeKey = branches.reduce<Record<string, string>>((acc, branch) => {
    (branch.jobsPositions ?? []).forEach((job) => {
      acc[`${branch.id}:${job.id}`] = job.name;
    });

    return acc;
  }, {});

  const pendingSelectedRecordIndex = pendingSelectedRecordId
    ? recordsByPeriod.findIndex((record) => record.id === pendingSelectedRecordId)
    : -1;
  const effectiveVisibleCount =
    pendingSelectedRecordIndex >= 0
      ? Math.max(visibleCount, pendingSelectedRecordIndex + 1)
      : visibleCount;

  const hasMore = effectiveVisibleCount < recordsByPeriod.length;

  const loadMoreRecords = () => {
    setVisibleCount((current) => {
      if (current >= recordsByPeriod.length) return current;
      return Math.min(current + PAGE_SIZE, recordsByPeriod.length);
    });
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMoreRecords,
    hasMore,
    disabled: !hasCurrentUser || isLoading || isError,
  });

  const visibleRecords = recordsByPeriod.slice(0, effectiveVisibleCount);

  const handlePeriodChangeWithPaginationReset = (nextPeriod: "day" | "week" | "month") => {
    handlePeriodChange(nextPeriod);
    setVisibleCount(PAGE_SIZE);
  };

  const handleFilterChangeWithPaginationReset = (
    name: keyof RecordsFiltersState,
    value: string
  ) => {
    handleFilterChange(name, value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setStoredViewMode(mode);
  };

  const handleSummaryVisibilityToggle = () => {
    setIsSummaryVisible((current) => {
      const next = !current;
      setStoredSummaryVisible(next);
      return next;
    });
  };

  const renderViewModeToggle = () => (
    <div className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] p-1">
      <button
        type="button"
        onClick={() => handleViewModeChange("card")}
        className={`rounded-full p-2 transition duration-200 ${
          viewMode === "card"
            ? "bg-[var(--accent)] text-slate-950"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        title="Vista de tarjetas"
        aria-label="Vista de tarjetas"
        aria-pressed={viewMode === "card"}
      >
        <MdViewAgenda size={20} />
      </button>
      <button
        type="button"
        onClick={() => handleViewModeChange("list")}
        className={`rounded-full p-2 transition duration-200 ${
          viewMode === "list"
            ? "bg-[var(--accent)] text-slate-950"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        title="Vista de listado"
        aria-label="Vista de listado"
        aria-pressed={viewMode === "list"}
      >
        <MdViewList size={20} />
      </button>
    </div>
  );

  useEffect(() => {
    if (!pendingSelectedRecordId || !hasCurrentUser || isLoading || isError) {
      return;
    }

    if (pendingSelectedRecordIndex === -1) {
      clearPendingSelectedRecordId();
      window.setTimeout(() => {
        setPendingSelectedRecordId(null);
      }, 0);
      return;
    }

    const variant = viewMode === "card" ? "desktop" : "mobile";
    const targetElement = document.querySelector<HTMLElement>(
      `[data-record-anchor="${pendingSelectedRecordId}"][data-record-variant="${variant}"]`
    );

    if (!targetElement) {
      return;
    }

    if (effectiveVisibleCount > visibleCount) {
      window.setTimeout(() => {
        setVisibleCount((current) => Math.max(current, effectiveVisibleCount));
      }, 0);
    }

    targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    clearPendingSelectedRecordId();
    window.setTimeout(() => {
      setPendingSelectedRecordId(null);
    }, 0);
  }, [
    pendingSelectedRecordId,
    pendingSelectedRecordIndex,
    hasCurrentUser,
    isLoading,
    isError,
    effectiveVisibleCount,
    visibleCount,
    viewMode,
  ]);

  return (
    <section className="flex min-w-0 min-h-[60vh] flex-col gap-4 overflow-x-hidden">
      {hasCurrentUser && (
        <>
          <div className="app-surface flex flex-wrap items-center justify-between gap-2 p-4">
            <RecordsPeriodSelector
              value={selectedPeriod}
              onChange={handlePeriodChangeWithPaginationReset}
              disabled={hasManualDateRange}
            />
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <button
                type="button"
                onClick={handleSummaryVisibilityToggle}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-1.5 text-sm font-semibold text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] md:px-3"
                aria-pressed={isSummaryVisible}
                aria-label={isSummaryVisible ? "Ocultar resumen" : "Mostrar resumen"}
                title={isSummaryVisible ? "Ocultar resumen" : "Mostrar resumen"}
              >
                {isSummaryVisible ? (
                  <MdVisibilityOff className="text-[24px] md:text-[18px]" />
                ) : (
                  <MdVisibility className="text-[24px] md:text-[18px]" />
                )}
                <span className="hidden md:inline">
                  {isSummaryVisible ? "Ocultar resumen" : "Mostrar resumen"}
                </span>
              </button>
              {renderViewModeToggle()}
              <RecordsFiltersBar
                branches={branches}
                jobProfiles={jobProfiles}
                filters={filters}
                onFilterChange={handleFilterChangeWithPaginationReset}
              />
            </div>
          </div>
          {isSummaryVisible && (
            <RecordsSummary
              period={effectiveSummaryPeriod}
              recordsCount={recordsByPeriod.length}
              totalHoursDecimal={summary.totalHoursDecimal}
              totalSalary={summary.totalSalary}
            />
          )}
        </>
      )}

      {hasCurrentUser && isLoading && (
        <aside className="app-card flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold text-[var(--accent-warm)]">Cargando registros...</p>
        </aside>
      )}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="app-card flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold text-[var(--danger)]">{errorMessage}</p>
        </aside>
      )}

      {!isLoading &&
        !isError &&
        !isLoadingProfiles &&
        hasCurrentUser &&
        recordsByPeriod.length === 0 &&
        !hasJobProfiles && (
          <aside className="app-surface p-4 text-[var(--text)]">
            <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--accent-warm)]">
              Tu cuenta esta lista para empezar
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Solo falta crear tu primer perfil de trabajo para poder registrar jornadas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/jobs-profiles/add"
                className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
              >
                Crear primer perfil
              </Link>
              <Link
                to="/jobs-profiles"
                className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                Ver perfiles
              </Link>
            </div>
          </aside>
        )}

      {!isLoading &&
        !isError &&
        !isLoadingProfiles &&
        hasCurrentUser &&
        recordsByPeriod.length === 0 &&
        hasJobProfiles && (
          <aside className="app-card p-4 text-[var(--text-muted)]">
            No hay registros que coincidan con los filtros seleccionados.
          </aside>
        )}

      {viewMode === "list" ? (
        <RecordsListGrid
          records={visibleRecords}
          branchNameById={branchNameById}
          jobPositionNameByCompositeKey={jobPositionNameByCompositeKey}
          onViewDetails={handlerViewDetails}
          onDeleteRecord={handleDeleteRecord}
        />
      ) : (
        <section className="grid min-w-0 gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {visibleRecords.map((record) => (
            <div key={record.id} data-record-anchor={record.id} data-record-variant="desktop">
              <RecordCard
                record={record}
                branchName={record.branchId ? (branchNameById[record.branchId] ?? "") : ""}
                jobPositionName={
                  record.branchId && record.jobPositionId
                    ? (jobPositionNameByCompositeKey[
                        `${record.branchId}:${record.jobPositionId}`
                      ] ?? "")
                    : ""
                }
                handlerViewDetails={handlerViewDetails}
                handleDeleteRecord={handleDeleteRecord}
              />
            </div>
          ))}
        </section>
      )}

      {hasCurrentUser && !isLoading && !isError && hasMore && (
        <div ref={sentinelRef} className="h-8 w-full" aria-hidden="true" />
      )}

      {hasCurrentUser &&
        !isLoading &&
        !isError &&
        !isLoadingProfiles &&
        !hasMore &&
        visibleRecords.length > 0 && (
          <p className="text-center text-xs text-[var(--text-soft)]">
            Has llegado al final de los registros.
          </p>
        )}
    </section>
  );
};

export default Records;
