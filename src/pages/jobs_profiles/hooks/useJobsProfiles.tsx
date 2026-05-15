import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { handleAppError } from "@/services/error.service";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";

export const useJobsProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobProfile[]>([]);
  const hasCurrentUser = Boolean(currentUser?.uid);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        if (!profiles || profiles.length === 0) {
          setJobs([]);
          setIsError(false);
          setErrorMessage(null);
          setIsLoading(false);
        } else {
          setJobs(profiles);
          setIsError(false);
          setErrorMessage(null);
          setIsLoading(false);
        }
      },
      (error) => {
        handleAppError(error, "useJobsProfiles.subscribeToJobProfiles");
        setJobs([]);
        setIsError(true);
        setErrorMessage("Error al cargar los perfiles de trabajo");
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

  const normalizedJobs = hasCurrentUser ? jobs : [];
  const normalizedIsError = hasCurrentUser ? isError : false;
  const normalizedErrorMessage = hasCurrentUser ? errorMessage : null;
  const normalizedIsLoading = hasCurrentUser ? isLoading : false;

  return {
    isLoading: normalizedIsLoading,
    isError: normalizedIsError,
    errorMessage: normalizedErrorMessage,
    jobs: normalizedJobs,
    hasCurrentUser,
  };
};
