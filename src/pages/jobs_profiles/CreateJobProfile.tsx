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
    // console.log(e.target.value);
    setBranchId(e.target.value);
  };

  return (
    <section className="flex flex-col justify-evenly lg:justify-start items-center lg:gap-8 h-[80vh]">
      <h2 className="text-3xl mt-12 lg:text-4xl ">Añadir perfil de trabajo</h2>
      <section className="lg:max-w-96">
        <formAction.Form action="/jobs-profiles/add" method="post" className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <label htmlFor="title" className="text-2xl">
              Título del perfil de trabajo:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="ej. Transportes SL"
              className="border py-2 px-4 rounded"
            />
          </section>
          {branches && (
            <>
              <section>
                <SelectJobProfile
                  branches={branches}
                  jobsPositions={[]}
                  onChangeSelectJobProfile={handlerOnChangeSelectedBranch}
                />
              </section>
              {branchId && <SelectJobProfile jobsPositions={jobsPositions} />}
            </>
          )}
          <section className="flex flex-col gap-2">
            <label htmlFor="estimatedHourlyRate" className="text-2xl">
              Tarifa horaria estimada:
            </label>
            <input
              type="text"
              name="estimatedHourlyRate"
              id="estimatedHourlyRate"
              placeholder="ej. 20€/hora"
              className="border py-2 px-4 rounded"
            />
          </section>
          <button
            type="submit"
            disabled={formAction.state === "submitting"}
            className="text-xl border border-green-300 font-bold py-2 px-4 rounded"
          >
            {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
          </button>
          {/*         
        {formAction.data && formAction.data.error && (
          <p className="text-red-500">{formAction.data.error}</p>
        )}
        {formAction.data && formAction.data.success && (
          <p className="text-green-500">{formAction.data.message}</p>
        )} */}
        </formAction.Form>
      </section>

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
