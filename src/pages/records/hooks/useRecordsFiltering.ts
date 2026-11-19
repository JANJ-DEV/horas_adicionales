import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { RecordService } from "@/services/records.service";
import type { JobProfile } from "@/types";
import {
  calculateRecordsSummary,
  filterRecordsByPeriod,
  getRecordReferenceDate,
  type RecordsPeriod,
} from "@/utils";
import { useRecord } from "./useRecord";
import { getBillingCycle } from "../billingCycle";
import { getStoredProfile, storeProfile, UNASSIGNED_PROFILE } from "../profileSelection";

const sortRecords = (records: RecordService[]) =>
  [...records].sort((a, b) => {
    const left = getRecordReferenceDate(a)?.getTime() ?? -Infinity;
    const right = getRecordReferenceDate(b)?.getTime() ?? -Infinity;
    return right - left;
  });

export const useRecordsFiltering = (jobProfiles: JobProfile[] = [], profilesReady = true) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState<RecordsPeriod>("all");
  const [sinceDate, setSinceDate] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    currentUserId,
    handleDeleteRecord,
    handlerViewDetails,
  } = useRecord();
  const profileIds = new Set(jobProfiles.map((profile) => profile.id).filter(Boolean));
  const isReady = profilesReady && !isLoading && !isError;
  const unassignedRecords = isReady
    ? records.filter((record) => !record.jobProfileId || !profileIds.has(record.jobProfileId))
    : [];
  const requestedProfile = searchParams.get("jobProfileId");
  const savedProfile = getStoredProfile(currentUserId);
  const isValidSelection = (id: string | null) =>
    Boolean(
      id && (profileIds.has(id) || (id === UNASSIGNED_PROFILE && unassignedRecords.length > 0))
    );
  const selectedProfileId = !isReady
    ? ""
    : isValidSelection(requestedProfile)
      ? requestedProfile!
      : isValidSelection(savedProfile)
        ? savedProfile
        : (jobProfiles.find((profile) => profile.id)?.id ??
          (unassignedRecords.length ? UNASSIGNED_PROFILE : ""));

  useEffect(() => {
    if (isReady && selectedProfileId) storeProfile(currentUserId, selectedProfileId);
  }, [currentUserId, isReady, selectedProfileId]);

  const profileRecords = sortRecords(
    selectedProfileId === UNASSIGNED_PROFILE
      ? unassignedRecords
      : selectedProfileId
        ? records.filter((record) => record.jobProfileId === selectedProfileId)
        : []
  );
  const profile = jobProfiles.find((item) => item.id === selectedProfileId);
  const currentCycle = profile
    ? getBillingCycle(
        { jobProfileId: profile.id, titleJobProfile: profile.title, dateTimeRecord: new Date() },
        jobProfiles
      )
    : null;
  const cycleOptions = Array.from(
    new Map([
      ...(currentCycle ? [[currentCycle.key, currentCycle] as const] : []),
      ...profileRecords.flatMap((record) => {
        const cycle = getBillingCycle(record, jobProfiles);
        return cycle ? [[cycle.key, cycle] as const] : [];
      }),
    ]).values()
  );
  const effectiveCycle =
    cycleOptions.find((cycle) => cycle.key === selectedCycle)?.key ?? cycleOptions[0]?.key ?? "";
  const recordsByPeriod =
    selectedPeriod === "custom_cycle"
      ? profileRecords.filter(
          (record) => getBillingCycle(record, jobProfiles)?.key === effectiveCycle
        )
      : selectedPeriod === "since" && sinceDate
        ? profileRecords.filter((record) => {
            const date = getRecordReferenceDate(record);
            return date && date >= new Date(`${sinceDate}T00:00:00`);
          })
        : filterRecordsByPeriod(profileRecords, selectedPeriod, new Date());

  const handleProfileChange = (id: string) => {
    if (!isValidSelection(id)) return;
    storeProfile(currentUserId, id);
    setSearchParams({ jobProfileId: id }, { replace: true });
    setSelectedPeriod("all");
    setSelectedCycle("");
    setSinceDate("");
  };
  const handlePeriodChange = (period: RecordsPeriod) => {
    if (period === "custom_cycle") setSelectedCycle("");
    setSelectedPeriod(period);
  };

  return {
    selectedProfileId,
    hasUnassignedRecords: unassignedRecords.length > 0,
    profile,
    selectedPeriod,
    recordsByPeriod,
    summary: calculateRecordsSummary(recordsByPeriod),
    effectiveSummaryPeriod: selectedPeriod,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
    handlePeriodChange,
    handleProfileChange,
    sinceDate,
    setSinceDate,
    cycleOptions,
    selectedCycle: effectiveCycle,
    setSelectedCycle,
  };
};
