import useAuth from "@/context/hooks/auth.hook";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export const useAddRecord = () => {
  const { currentUser } = useAuth();
  const formAction = useFetcher();
  const hasCurrentUser = Boolean(currentUser?.uid);

  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [estimatedHourlyRate, setEstimatedHourlyRate] = useState<number | undefined>(undefined);
  // Actualizamos el estado en lugar de manipular el DOM directamente
  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;
    const profile = jobProfiles.find((p) => p.id === selectedProfileId);
    setSelectedTitle(profile ? profile.title : "");
    setEstimatedHourlyRate(profile ? profile.estimatedHourlyRate : undefined);
  };

  // Efecto para la suscripción a los perfiles
  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setJobProfiles(profiles);
        setLoading(false);
      },
      (error) => {
        console.error("Error al suscribirse a perfiles de trabajo:", error);
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
  }, [currentUser?.uid]);

  return {
    jobProfiles,
    loading,
    selectedTitle,
    handleProfileChange,
    hasCurrentUser,
    formAction,
    estimatedHourlyRate,
  };
};
