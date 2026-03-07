import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// import {  toast, ToastContainer} from 'react-toastify';
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";

const JobProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // const [isError, setIsError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [jobs, setJobs] = useState<JobProfile[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToJobProfiles(currentUser.uid, (profiles) => {
      setJobs(profiles);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <section className="flex flex-col gap-4">
      {isLoading && <p>Cargando...</p>}
      {jobs.map((jobProfile) => {
        return (
          <div key={jobProfile.id} className="p-4 border rounded-sm">
            <h3 className="text-lg font-semibold">{jobProfile.title}</h3>
            <strong>{jobProfile.branch.name}</strong>
            <p className="font-medium">{jobProfile.branch.description}</p>
            <strong>{jobProfile.jobPosition.name}</strong>
            <p className="font-medium">{jobProfile.jobPosition.description}</p>
          </div>
        );
      })}
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
