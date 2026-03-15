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
    <section className="app-surface flex flex-col gap-5 p-4 sm:p-6">
      <div>
        <p className="section-kicker">Nuevo perfil</p>
        <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold text-[var(--text)] lg:text-4xl">
          Añadir perfil de trabajo
        </h2>
      </div>
      <formAction.Form action="/jobs-profiles/add" method="post" className="flex flex-col gap-5">
        <section className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-semibold text-[var(--text)] sm:text-base">
            Título del perfil de trabajo:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="ej. Transportes SL"
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] outline-none transition duration-300 focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
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
          <label
            htmlFor="estimatedHourlyRate"
            className="text-sm font-semibold text-[var(--text)] sm:text-base"
          >
            Tarifa horaria estimada:
          </label>
          <input
            type="text"
            name="estimatedHourlyRate"
            id="estimatedHourlyRate"
            placeholder="ej. 20€/hora"
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] outline-none transition duration-300 focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
          />
        </section>

        <Btn
          type="submit"
          label={formAction.state === "submitting" ? "Guardando..." : "Guardar"}
          formState={formAction.state === "submitting"}
        />
        {/* Mensaje de error */}
        {formAction.data && formAction.data.error && (
          <p className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm font-semibold text-[var(--danger)]">
            {formAction.data.error}
          </p>
        )}
        {/* Mensaje de éxito */}
        {formAction.data && formAction.data.success && (
          <aside className="app-card flex flex-col gap-3 p-4">
            <p className="font-semibold text-[var(--success)]">{formAction.data.message}</p>
            <Link
              to="/records/add"
              className="w-fit rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
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
