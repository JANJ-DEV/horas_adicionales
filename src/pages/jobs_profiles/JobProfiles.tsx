import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// import {  toast, ToastContainer} from 'react-toastify';
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";

const JobProfiles = () => {
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

  return (
    <section className="flex flex-col gap-4 bg-slate-800/50">
      {hasCurrentUser && isLoading && <p>Cargando...</p>}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}
      {(hasCurrentUser ? jobs : []).map((jobProfile) => {
        return (
          <div key={jobProfile.id} className="p-4 border rounded-sm">
            <h3 className="text-lg font-semibold">{jobProfile.title}</h3>
            <strong>{jobProfile.branch.name}</strong>
            <p className="font-medium">{jobProfile.branch.description}</p>
            <strong>{jobProfile.jobPosition.name}</strong>
            <p className="font-medium">{jobProfile.jobPosition.description}</p>
            {jobProfile.estimatedHourlyRate !== undefined && (
              <p className="font-medium">
                Tarifa horaria estimada: {jobProfile.estimatedHourlyRate}€/hora
              </p>
            )}
          </div>
        );
      })}
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
