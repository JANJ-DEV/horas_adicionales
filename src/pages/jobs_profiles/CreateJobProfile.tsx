import useBranches from "@/context/hooks/useBranches.hook.";
import { useState, type FC, useEffect, type ChangeEvent } from "react";
import { Link, useFetcher } from "react-router";
import SelectJobProfile from "./components/SelectJobProfile";
import { getBranchById } from "@/services/branches.services";
import type { JobPosition } from "@/types";
import Btn from "@/components/Btn";
import SelectJobPositionFromBranchId from "./components/SelectJobPosition";
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

  const onChangeSelectJobProfile = (e: ChangeEvent<HTMLSelectElement>) => {
    setBranchId(e.target.value);
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-3xl lg:text-4xl">Añadir perfil de trabajo</h2>
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
                onChangeSelectJobProfile={onChangeSelectJobProfile}
              />
            </section>
            {jobsPositions && branchId && <SelectJobPositionFromBranchId branchId={branchId} />}
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

        <Btn
          type="submit"
          label={formAction.state === "submitting" ? "Guardando..." : "Guardar"}
          formState={formAction.state === "submitting"}
        />
        {/* Mensaje de error */}
        {formAction.data && formAction.data.error && (
          <p className="text-red-500">{formAction.data.error}</p>
        )}
        {/* Mensaje de éxito */}
        {formAction.data && formAction.data.success && (
          <aside className="flex flex-col gap-3 rounded-xl border border-green-700 bg-green-900/30 p-4">
            <p className="text-green-300">{formAction.data.message}</p>
            <Link
              to="/records/add"
              className="w-fit rounded-lg border border-cyan-400 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
            >
              Ir a registrar horas
            </Link>
          </aside>
        )}
      </formAction.Form>
    </section>
  );
};

export default CreateJobProfile;
