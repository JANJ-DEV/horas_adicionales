import { useRecord } from "./hooks/useRecord";
import RecordCard from "./components/RecordCard";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.services";
import type { Branch } from "@/types";
import RecordsPeriodSelector from "./components/RecordsPeriodSelector";
import RecordsSummary from "./components/RecordsSummary";
import RecordListItem from "./components/RecordListItem";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
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
  const [selectedPeriod, setSelectedPeriod] = useState<RecordsPeriod>("week");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

      {!isLoading && !isError && hasCurrentUser && recordsByPeriod.length === 0 && (
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

      {hasCurrentUser && !isLoading && !isError && !hasMore && visibleRecords.length > 0 && (
        <p className="text-center text-xs text-slate-400">Has llegado al final de los registros.</p>
      )}

    </section>
  );
};

export default Records;
