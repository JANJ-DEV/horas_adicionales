import useBranches from "@/context/hooks/useBranches.hook.";
import { useFilterBranches } from "@/hooks/useFilterBranches";
import type { Branch, JobPosition } from "@/types";
import { type FC } from "react";
import { useFetcher } from "react-router";
import { ToastContainer } from "react-toastify";
// Interface para los puestos de trabajo individuales

const CreateJobProfile: FC = () => {
  const { branches } = useBranches();
  const formAction = useFetcher();
  const {
    selectedBranch,
    handlerOnChangeBranch,
    selectedJobPosition,
    handlerOnChangeJobPosition,
    getJobPositionByBranch,
    getBranch,
  } = useFilterBranches();

  return (
    <section>
      <h1>Crear nuevo perfil de trabajo</h1>
      <formAction.Form action="/job-profiles/add" method="post" className="flex flex-col gap-4">
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="profileTitle">Nombre del perfil de trabajo</label>
          <input
            id="profileTitle"
            title="Nombre del perfil de trabajo"
            type="text"
            name="profileTitle"
            placeholder="ejemplo: Conductor de autobús urbano"
            required
          />
        </div>

        <section className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label className="col-span-2">Información del perfil</label>
          <article className="flex flex-col lg:grid lg:grid-cols-2 text-xl border p-4 rounded-xl gap-4">
            <section className="flex flex-col gap-4 justify-around">
              <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                <label htmlFor="sectorName" title="Selecciona tu sector">
                  Cual es tu sector?
                </label>
                <select
                  id="sectorName"
                  name="sectorName"
                  title="Selecciona tu sector"
                  className="bg-dark text-white p-2 rounded-sm"
                  onChange={handlerOnChangeBranch}
                >
                  <option value="">Selecciona tu sector</option>
                  {branches.map((branch: Branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.sector}
                    </option>
                  ))}
                </select>
              </div>
              {selectedBranch && (
                <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                  <label htmlFor="sectorDescription">Descripción</label>
                  <textarea
                    value={
                      branches.find((branch: Branch) => branch.id === selectedBranch)
                        ?.descripcion_sector || ""
                    }
                    rows={4}
                    id="sectorDescription"
                    title="Descripción del sector"
                    name="sectorDescription"
                    placeholder="ejemplo: Conductor de autobús encargado de rutas urbanas, con experiencia en atención al cliente y manejo de vehículos de gran tamaño."
                  />
                </div>
              )}
            </section>
            <section className="flex flex-col gap-4 justify-around">
              <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                <label htmlFor="jobPosition">Cual es tu puesto de trabajo?</label>
                {selectedBranch && (
                  <>
                    <select
                      name="jobPosition"
                      id="jobPosition"
                      title="Selecciona tu puesto de trabajo"
                      onChange={handlerOnChangeJobPosition}
                    >
                      <option value="">Selecciona tu puesto de trabajo</option>
                      {getBranch(selectedBranch)?.map((job: JobPosition) => (
                        <option key={job.id} value={job.id}>
                          {job.nombre}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              {selectedJobPosition && (
                <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                  <label htmlFor="jobDescription">Descripción</label>
                  <textarea
                    value={getJobPositionByBranch(selectedJobPosition)?.descripcion || ""}
                    rows={4}
                    id="jobDescription"
                    title="Descripción del puesto de trabajo"
                    name="jobDescription"
                    placeholder="ejemplo: Conductor de autobús encargado de rutas urbanas, con experiencia en atención al cliente y manejo de vehículos de gran tamaño."
                  />
                </div>
              )}
            </section>
          </article>
        </section>

        <section className="flex flex-col gap-4">
          {branches.length > 0 && selectedBranch && (
            <span>{branches.find((branch: Branch) => branch.id === selectedBranch)?.sector}</span>
          )}
          {getJobPositionByBranch && (
            <span>{getJobPositionByBranch(selectedJobPosition)?.nombre}</span>
          )}
        </section>

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
          <h2 className="text-2xl font-bold mb-2">{newJob.sector}</h2>
          <p className="mb-1"><strong>Descripción del sector:</strong> {newJob.descripcion_sector}</p>
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
