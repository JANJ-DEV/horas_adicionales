import useAuth from "@/context/hooks/auth.hook";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { handleAppError } from "@/services/error.service";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import { getRecordById, type RecordService } from "@/services/records.service";
import { notify, TOAST_SCOPE } from "@/services/toast.service";
import type { JobProfile } from "@/types";
import { useEffect, useState } from "react";
import { useFetcher, useNavigate, useParams } from "react-router";

export const useEditRecord = () => {
  const { currentUser } = useAuth();
  const { setSelectedProfileContext } = useUtilities();
  const { id } = useParams();
  const navigate = useNavigate();
  const formAction = useFetcher();
  const hasCurrentUser = Boolean(currentUser?.uid);

  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(hasCurrentUser);
  const [isLoadingRecord, setIsLoadingRecord] = useState(true);
  const [record, setRecord] = useState<RecordService | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState("");

  const selectedProfile = jobProfiles.find((profile) => profile.id === selectedProfileId) ?? null;
  const selectedTitle = selectedProfile?.title ?? record?.titleJobProfile ?? "";
  const estimatedHourlyRate = record?.estimatedHourlyRate ?? selectedProfile?.estimatedHourlyRate;
  const selectedBranchId = selectedProfile?.branch?.id ?? record?.branchId ?? "";
  const selectedJobPositionId = selectedProfile?.jobPosition?.id ?? record?.jobPositionId ?? "";

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextProfileId = event.target.value;
    const profile = jobProfiles.find((item) => item.id === nextProfileId) ?? null;

    setSelectedProfileId(nextProfileId);
    setSelectedProfileContext(profile?.branch?.id ?? null, profile?.jobPosition?.id ?? null);
  };

  useEffect(() => {
    if (!currentUser?.uid) {
      setSelectedProfileContext(null, null);
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setJobProfiles(profiles);
        setIsLoadingProfiles(false);
      },
      (error) => {
        handleAppError(error, "useEditRecord.subscribeToJobProfiles");
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
  }, [currentUser?.uid, setSelectedProfileContext]);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) {
        setIsLoadingRecord(false);
        return;
      }

      setIsLoadingRecord(true);
      const fetchedRecord = await getRecordById(id);
      if (!fetchedRecord) {
        notify.error("No se encontró el documento", { scope: TOAST_SCOPE.RECORDS });
        setRecord(null);
        setIsLoadingRecord(false);
        return;
      }

      setRecord(fetchedRecord);
      setSelectedProfileId(fetchedRecord.jobProfileId ?? "");
      setSelectedProfileContext(fetchedRecord.branchId ?? null, fetchedRecord.jobPositionId ?? null);
      setIsLoadingRecord(false);
    };

    void fetchRecord();
  }, [id, setSelectedProfileContext]);

  useEffect(() => {
    if (formAction.state !== "idle" || !formAction.data) {
      return;
    }

    if (formAction.data.error) {
      notify.error(formAction.data.error, { scope: TOAST_SCOPE.RECORDS });
      return;
    }

    if (formAction.data.success) {
      notify.success("Registro actualizado correctamente", { scope: TOAST_SCOPE.RECORDS });
      navigate("/records");
    }
  }, [formAction.data, formAction.state, navigate]);

  return {
    record,
    formAction,
    jobProfiles,
    selectedProfileId,
    selectedTitle,
    estimatedHourlyRate,
    selectedBranchId,
    selectedJobPositionId,
    handleProfileChange,
    hasCurrentUser,
    isLoadingProfiles: hasCurrentUser ? isLoadingProfiles : false,
    isLoadingRecord,
  };
};
