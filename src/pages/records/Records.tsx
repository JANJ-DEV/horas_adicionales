import { useRecord } from "./hooks/useRecord";
import RecordCard from "./components/RecordCard";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.services";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { Branch } from "@/types";
import RecordsPeriodSelector from "./components/RecordsPeriodSelector";
import RecordsSummary from "./components/RecordsSummary";
import RecordListItem from "./components/RecordListItem";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";
import {
  calculateRecordsSummary,
  filterRecordsByPeriod,
  getRecordReferenceDate,
  type RecordsPeriod,
} from "@/utils";

const PAGE_SIZE = 9;

const Records = () => {
  const {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
  } = useRecord();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [hasJobProfiles, setHasJobProfiles] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<RecordsPeriod>("week");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!hasCurrentUser) {
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setHasJobProfiles(profiles.length > 0);
        setIsLoadingProfiles(false);
      },
      () => {
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

  const orderedRecords = [...records].sort((left, right) => {
    const leftDate = getRecordReferenceDate(left);
    const rightDate = getRecordReferenceDate(right);

    if (!leftDate && !rightDate) return 0;
    if (!leftDate) return 1;
    if (!rightDate) return -1;

    return rightDate.getTime() - leftDate.getTime();
  });

  const recordsByPeriod = filterRecordsByPeriod(orderedRecords, selectedPeriod);

  const hasMore = visibleCount < recordsByPeriod.length;

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

  const visibleRecords = recordsByPeriod.slice(0, visibleCount);

  const summary = calculateRecordsSummary(recordsByPeriod);

  const handlePeriodChange = (nextPeriod: RecordsPeriod) => {
    setSelectedPeriod(nextPeriod);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="flex min-w-0 flex-col gap-4 overflow-x-hidden">
      {hasCurrentUser && (
        <>
          <RecordsPeriodSelector value={selectedPeriod} onChange={handlePeriodChange} />
          <RecordsSummary
            period={selectedPeriod}
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
            No hay registros para el periodo seleccionado.
          </aside>
        )}

      <section className="flex min-w-0 flex-col gap-4">
        {visibleRecords.map((record) => (
          <RecordListItem
            key={`mobile-${record.id}`}
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
        ))}
      </section>

      <section className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {visibleRecords.map((record) => (
          <RecordCard
            key={record.id}
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
