/* eslint-disable react-hooks/exhaustive-deps */
import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// import {  toast, ToastContainer} from 'react-toastify';
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { useFilterBranches } from "@/hooks/useFilterBranches";

const JobProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { getNameJobPosition, getNameBranch } = useFilterBranches();
  // const [isError, setIsError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [jobs, setJobs] = useState<JobProfile[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToJobProfiles((profiles) => {
      setJobs(profiles);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <section className="flex flex-col">
      {isLoading && <p>Cargando...</p>}

      {/* {isError && errorMessage && (
        <section className="flex flex-col gap-4">
          <p className="text-red-300">{errorMessage}</p>
          <button
            type="button"
            className="text-white font-black py-2 px-4 border-2 border-white rounded-sm hover:bg-green-500/20"
          >
            Crea perfil de trabajo
          </button>
        </section>
      )} */}
      {/* {jobs && jobs.length > 0 && (
        <section className="w-full max-w-4xl flex flex-col gap-4">
          {jobs.map((job) => (
            <JobProfileCard key={job.id} job={job} />
          ))}
        </section>
      )} */}
      {/* {JSON.stringify(jobs)} */}
      {/* <pre className="bg-dark w-screen max-w-7xl p-4 rounded-sm">
        <code className="text-sm text-yellow-200 font-bold text-pretty">
          {JSON.stringify(branches, null, 2)}
        </code>
      </pre> */}

      <div className="grid grid-cols-2 bg-accent p-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-dark p-4 rounded-sm">
            <h2>{job.profileTitle}</h2>
            <div>
              <div>
                <h1>{getNameJobPosition(job.sectorName)}</h1>
                <p>{job.sectorDescription}</p>
              </div>
              <div>
                <h2>{getNameBranch(job.sectorName)}</h2>
                <p>{job.jobDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
