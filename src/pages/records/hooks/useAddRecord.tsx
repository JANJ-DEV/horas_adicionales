import useAuth from "@/context/hooks/auth.hook";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { handleAppError } from "@/services/error.service";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import type { AddRecordActionResponse } from "@/routes/actions/records.actions";
import { rememberSelectedRecordId } from "../recordNavigation";
import { getStoredProfile, storeProfile } from "../profileSelection";

const isAddRecordSuccess = (
  data: AddRecordActionResponse | null | undefined
): data is Extract<AddRecordActionResponse, { success: true }> => {
  return Boolean(data && "success" in data && data.success);
};

export const useAddRecord = () => {
  const { currentUser } = useAuth();
  const { setSelectedProfileContext } = useUtilities();
  const navigate = useNavigate();
  const formAction = useFetcher<AddRecordActionResponse>();
  const hasCurrentUser = Boolean(currentUser?.uid);

  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(hasCurrentUser);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [estimatedHourlyRate, setEstimatedHourlyRate] = useState<number | undefined>(undefined);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedJobPositionId, setSelectedJobPositionId] = useState<string>("");
  // Actualizamos el estado en lugar de manipular el DOM directamente
  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;
    const profile = jobProfiles.find((p) => p.id === selectedProfileId);
    setSelectedProfileId(selectedProfileId);
    storeProfile(currentUser?.uid, selectedProfileId);
    setSelectedTitle(profile ? profile.title : "");
    setEstimatedHourlyRate(profile ? profile.estimatedHourlyRate : undefined);
    setSelectedBranchId(profile?.branch?.id ?? "");
    setSelectedJobPositionId(profile?.jobPosition?.id ?? "");
    setSelectedProfileContext(profile?.branch?.id ?? null, profile?.jobPosition?.id ?? null);
  };

  // Efecto para la suscripción a los perfiles
  useEffect(() => {
    if (!currentUser?.uid) {
      setSelectedProfileContext(null, null);
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setJobProfiles(profiles);
        const saved = profiles.find((profile) => profile.id === getStoredProfile(currentUser.uid));
        if (saved?.id) {
          setSelectedProfileId(saved.id);
          setSelectedTitle(saved.title);
          setEstimatedHourlyRate(saved.estimatedHourlyRate);
          setSelectedBranchId(saved.branch?.id ?? "");
          setSelectedJobPositionId(saved.jobPosition?.id ?? "");
          setSelectedProfileContext(saved.branch?.id ?? null, saved.jobPosition?.id ?? null);
        }
        setLoading(false);
      },
      (error) => {
        handleAppError(error, "useAddRecord.subscribeToJobProfiles");
        setJobProfiles([]);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    // Cleanup correcto: se ejecuta cuando el componente se desmonta
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser?.uid, setSelectedProfileContext]);

  useEffect(() => {
    if (formAction.state !== "idle") {
      return;
    }

    const recordId = isAddRecordSuccess(formAction.data) ? formAction.data.record.id : undefined;
    if (!recordId) {
      return;
    }

    rememberSelectedRecordId(recordId);
    navigate(`/records/details/${recordId}`);
  }, [formAction.data, formAction.state, navigate]);

  return {
    jobProfiles,
    loading,
    selectedTitle,
    selectedProfileId,
    handleProfileChange,
    hasCurrentUser,
    formAction,
    estimatedHourlyRate,
    selectedBranchId,
    selectedJobPositionId,
  };
};
