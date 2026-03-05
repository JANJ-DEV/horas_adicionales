/* eslint-disable react-hooks/exhaustive-deps */
import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import {  toast, ToastContainer} from 'react-toastify';
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { subscribeToBranches } from "@/services/branches.services";
import { useJobsProfile } from "./useJobsProfile";

const JobProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { branches, setBranches } = useJobsProfile();
  // const [isError, setIsError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [jobs, setJobs] = useState<JobProfile[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const handlerOnChangeBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    console.log(branchId);
    setSelectedBranch(branchId);
    toast.info(`Rama seleccionada: ${branchId}`, { containerId: "profile" });
    // Aquí podrías filtrar los perfiles de trabajo según la rama seleccionada
  };
  const [selectedJobPosition, setSelectedjobposition] = useState<string>("");
  const handlerOnChangeJobPosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobPositionId = e.target.value;
    console.log(jobPositionId);
    setSelectedjobposition(jobPositionId);
    toast.info(`Puesto de trabajo seleccionado: ${jobPositionId}`, { containerId: "profile" });
    // Aquí podrías filtrar los perfiles de trabajo según el puesto de trabajo seleccionado
  };
  const getJobPosition = (selectedJobPosition: string) => {
    const branch = branches.find((branch) => branch.id === selectedBranch);
    if (!branch) return undefined;
    const jobPosition = branch.puestos_de_trabajo.find((job) => job.id === selectedJobPosition);
    return jobPosition;
  };
  const getBranch = (selectedBranch: string) =>
    branches.find((branch) => branch.id === selectedBranch)?.puestos_de_trabajo.map((job) => job);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToJobProfiles((profiles) => {
      setJobs(profiles);
      setIsLoading(false);
    });
    subscribeToBranches((branches) => {
      console.log(branches);
      setBranches(branches.data);
      setIsLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center">
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
      <section className="flex flex-col gap-4">
        <select
          id="branches"
          name="branches"
          title="Selecciona tu sector"
          className="bg-dark text-white p-2 rounded-sm"
          onChange={handlerOnChangeBranch}
        >
          <option value="">Selecciona tu sector</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.sector}
            </option>
          ))}
        </select>
        {selectedBranch && (
          <select
            name="jobPosition"
            id="jobPosition"
            title="Selecciona tu puesto de trabajo"
            onChange={handlerOnChangeJobPosition}
          >
            <option value="">Selecciona tu puesto de trabajo</option>
            {getBranch(selectedBranch)?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.nombre}
              </option>
            ))}
          </select>
        )}
        {branches.length > 0 && selectedBranch && (
          <span>{branches.find((branch) => branch.id === selectedBranch)?.sector}</span>
        )}
        {getJobPosition && <span>{getJobPosition(selectedJobPosition)?.nombre}</span>}
      </section>
      <div>
        {jobs.map((job) => (
          <div key={job.id}>{job.profileTitle}</div>
        ))}
      </div>
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
