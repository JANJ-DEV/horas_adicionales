import RecordCard from "./components/RecordCard";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.services";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { Branch, JobProfile } from "@/types";
import RecordsPeriodSelector from "./components/RecordsPeriodSelector";
import RecordsSummary from "./components/RecordsSummary";
import RecordListItem from "./components/RecordListItem";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";
import RecordsFiltersBar, { type RecordsFiltersState } from "./components/RecordsFiltersBar";
import { useRecordsFiltering } from "./hooks/useRecordsFiltering";
import { clearPendingSelectedRecordId, getPendingSelectedRecordId } from "./recordNavigation";

const PAGE_SIZE = 9;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

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
    pendingSelectedRecordIndex >= 0 ? Math.max(visibleCount, pendingSelectedRecordIndex + 1) : visibleCount;

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

  const handleFilterChangeWithPaginationReset = (name: keyof RecordsFiltersState, value: string) => {
    handleFilterChange(name, value);
    setVisibleCount(PAGE_SIZE);
  };

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

    const isDesktopViewport = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
    const variant = isDesktopViewport ? "desktop" : "mobile";
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
  ]);

  return (
    <section className="flex min-w-0 min-h-[60vh] flex-col gap-4 overflow-x-hidden">
      {hasCurrentUser && (
        <>
          <div className="app-surface flex items-center justify-between gap-2 p-4">
            <RecordsPeriodSelector
              value={selectedPeriod}
              onChange={handlePeriodChangeWithPaginationReset}
              disabled={hasManualDateRange}
            />
            <RecordsFiltersBar
              branches={branches}
              jobProfiles={jobProfiles}
              filters={filters}
              onFilterChange={handleFilterChangeWithPaginationReset}
            />
          </div>
          <RecordsSummary
            period={effectiveSummaryPeriod}
            recordsCount={recordsByPeriod.length}
            totalHoursDecimal={summary.totalHoursDecimal}
            totalSalary={summary.totalSalary}
          />
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

      <section className="flex min-w-0 flex-col gap-4">
        {visibleRecords.map((record) => (
          <div key={`mobile-${record.id}`} data-record-anchor={record.id} data-record-variant="mobile">
            <RecordListItem
              record={record}
              branchName={record.branchId ? (branchNameById[record.branchId] ?? "") : ""}
              jobPositionName={
                record.branchId && record.jobPositionId
                  ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ??
                    "")
                  : ""
              }
              onViewDetails={handlerViewDetails}
              onDeleteRecord={handleDeleteRecord}
            />
          </div>
        ))}
      </section>

      <section className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {visibleRecords.map((record) => (
          <div key={record.id} data-record-anchor={record.id} data-record-variant="desktop">
            <RecordCard
              record={record}
              branchName={record.branchId ? (branchNameById[record.branchId] ?? "") : ""}
              jobPositionName={
                record.branchId && record.jobPositionId
                  ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ??
                    "")
                  : ""
              }
              handlerViewDetails={handlerViewDetails}
              handleDeleteRecord={handleDeleteRecord}
            />
          </div>
        ))}
      </section>

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
