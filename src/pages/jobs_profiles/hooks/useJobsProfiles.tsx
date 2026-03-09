import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";

export const useJobsProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const customErrorMessage = "No tienes registros";
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
          setIsError(true);
          setErrorMessage(customErrorMessage);
          setIsLoading(false);
        } else {
          setJobs(profiles);
          setIsError(false);
          setErrorMessage("");
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error al suscribirse a perfiles de trabajo:", error);
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

  return {
    isLoading,
    isError,
    errorMessage,
    jobs,
    hasCurrentUser,
  };
};
