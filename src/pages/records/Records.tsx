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
      setHasJobProfiles(false);
      setIsLoadingProfiles(false);
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
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">Cargando registros...</p>
        </aside>
      )}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}

      {!isLoading && !isError && !isLoadingProfiles && hasCurrentUser && recordsByPeriod.length === 0 && !hasJobProfiles && (
        <aside className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
          <h3 className="text-base font-semibold text-amber-200">Tu cuenta esta lista para empezar</h3>
          <p className="mt-2 text-sm text-amber-100/90">
            Solo falta crear tu primer perfil de trabajo para poder registrar jornadas.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/jobs-profiles/add"
              className="rounded-md border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/30"
            >
              Crear primer perfil
            </Link>
            <Link
              to="/jobs-profiles"
              className="rounded-md border border-slate-500 bg-slate-700/30 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/50"
            >
              Ver perfiles
            </Link>
          </div>
        </aside>
      )}

      {!isLoading && !isError && !isLoadingProfiles && hasCurrentUser && recordsByPeriod.length === 0 && hasJobProfiles && (
        <aside className="rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
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
                ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ?? "")
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
                ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ?? "")
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

      {hasCurrentUser && !isLoading && !isError && !isLoadingProfiles && !hasMore && visibleRecords.length > 0 && (
        <p className="text-center text-xs text-slate-400">Has llegado al final de los registros.</p>
      )}

    </section>
  );
};

export default Records;
