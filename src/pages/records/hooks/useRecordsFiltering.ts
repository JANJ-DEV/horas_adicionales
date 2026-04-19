import { useState } from "react";
import { useSearchParams } from "react-router";
import type { RecordsQueryFilters, RecordService } from "@/services/records.service";
import {
  calculateRecordsSummary,
  filterRecordsByAdvancedFilters,
  filterRecordsByPeriod,
  getRecordReferenceDate,
  type RecordsPeriod,
} from "@/utils";
import { useRecord } from "./useRecord";
import type { RecordsFiltersState } from "../components/RecordsFiltersBar";

const parseOptionalNumber = (value: string) => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildFiltersFromSearchParams = (searchParams: URLSearchParams): RecordsFiltersState => ({
  branchId: searchParams.get("branchId") ?? "",
  jobPositionId: searchParams.get("jobPositionId") ?? "",
  jobProfileId: searchParams.get("jobProfileId") ?? "",
  dateFrom: searchParams.get("dateFrom") ?? "",
  dateTo: searchParams.get("dateTo") ?? "",
  minHourlyRate: searchParams.get("minHourlyRate") ?? "",
  maxHourlyRate: searchParams.get("maxHourlyRate") ?? "",
  minWorkedHours: searchParams.get("minWorkedHours") ?? "",
  maxWorkedHours: searchParams.get("maxWorkedHours") ?? "",
});

const buildQueryFilters = (filters: RecordsFiltersState): RecordsQueryFilters => ({
  branchId: filters.branchId || undefined,
  jobPositionId: filters.jobPositionId || undefined,
  jobProfileId: filters.jobProfileId || undefined,
  dateFrom: filters.dateFrom || undefined,
  dateTo: filters.dateTo || undefined,
});

const sortRecordsByReferenceDate = (records: RecordService[]) => {
  return [...records].sort((left, right) => {
    const leftDate = getRecordReferenceDate(left);
    const rightDate = getRecordReferenceDate(right);

    if (!leftDate && !rightDate) return 0;
    if (!leftDate) return 1;
    if (!rightDate) return -1;

    return rightDate.getTime() - leftDate.getTime();
  });
};

export const useRecordsFiltering = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState<RecordsPeriod>("week");

  const filters = buildFiltersFromSearchParams(searchParams);
  const queryFilters = buildQueryFilters(filters);

  const {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
  } = useRecord(queryFilters);

  const hasManualDateRange = Boolean(filters.dateFrom || filters.dateTo);

  const orderedRecords = sortRecordsByReferenceDate(records);

  const recordsByFilters = filterRecordsByAdvancedFilters(orderedRecords, {
    ...queryFilters,
    minHourlyRate: parseOptionalNumber(filters.minHourlyRate),
    maxHourlyRate: parseOptionalNumber(filters.maxHourlyRate),
    minWorkedHours: parseOptionalNumber(filters.minWorkedHours),
    maxWorkedHours: parseOptionalNumber(filters.maxWorkedHours),
  });

  const recordsByPeriod = hasManualDateRange
    ? recordsByFilters
    : filterRecordsByPeriod(recordsByFilters, selectedPeriod);

  const summary = calculateRecordsSummary(recordsByPeriod);
  const effectiveSummaryPeriod: RecordsPeriod | null = hasManualDateRange ? null : selectedPeriod;

  const handlePeriodChange = (nextPeriod: RecordsPeriod) => {
    setSelectedPeriod(nextPeriod);
  };

  const handleFilterChange = (name: keyof RecordsFiltersState, value: string) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (name === "branchId") {
          next.delete("jobPositionId");
        }

        if (value) {
          next.set(name, value);
        } else {
          next.delete(name);
        }

        return next;
      },
      { replace: true }
    );
  };

  return {
    filters,
    queryFilters,
    selectedPeriod,
    hasManualDateRange,
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
  };
};
