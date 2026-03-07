import useBranches from "@/context/hooks/useBranches.hook.";
import { useState, type FC, useEffect } from "react";
import { useFetcher } from "react-router";
import { ToastContainer } from "react-toastify";
import SelectJobProfile from "./components/SelectJobProfile";
import { getBranchById } from "@/services/branches.services";
import type { JobPosition } from "@/types";
// Interface para los puestos de trabajo individuales

const CreateJobProfile: FC = () => {
  const { branches } = useBranches();
  const formAction = useFetcher();
  const [branchId, setBranchId] = useState<string>("");
  const [jobsPositions, setJobsPositions] = useState<JobPosition[]>([]);

  useEffect(() => {
    if (branchId) {
      getBranchById(branchId).then((branch) => {
        setJobsPositions(branch?.jobsPositions ?? []);
      });
    }
  }, [branchId]);

  const handlerOnChangeSelectedBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setBranchId(e.target.value);
  };
  const handlerOnSelectedJobPosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  return (
    <section>
      <h1>Crear nuevo perfil de trabajo</h1>
      <formAction.Form action="/job-profiles/add" method="post" className="flex flex-col gap-4">
        <input type="text" name="title" id="title" placeholder="Título del perfil de trabajo" />
        {branches && (
          <>
            <SelectJobProfile
              branches={branches}
              jobsPositions={[]}
              onChangeSelectJobProfile={handlerOnChangeSelectedBranch}
            />
            {branchId && (
              <SelectJobProfile
                jobsPositions={jobsPositions}
                onChangeSelectJobProfile={handlerOnSelectedJobPosition}
              />
            )}
          </>
        )}

        <button type="submit" disabled={formAction.state === "submitting"}>
          {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
        </button>
        {formAction.data && formAction.data.error && (
          <p className="text-red-500">{formAction.data.error}</p>
        )}
        {formAction.data && formAction.data.success && (
          <p className="text-green-500">{formAction.data.message}</p>
        )}
      </formAction.Form>
      {/* {newJob && (
        <div className="mt-4 p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-2">{newJob.name}</h2>
          <p className="mb-1"><strong>Descripción del sector:</strong> {newJob.description}</p>
        </div>
      )} */}
      <ToastContainer
        containerId="job-profiles-toast"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
};

export default CreateJobProfile;
