import { useEffect, type FC } from "react";
import { useFetcher } from "react-router";
import { toast, ToastContainer } from "react-toastify";
// Interface para los puestos de trabajo individuales
export interface PuestoDeTrabajo {
  id: string;
  nombre: string;
  puestoTrabajoDescripcion: string;
}

// Interface para cada sector principal
export interface Sector {
  id: string;
  sector: string;
  descripcion_sector: string;
  puestos_de_trabajo: PuestoDeTrabajo[];
}

// Interface para la raíz del documento JSON
export interface SectoresData {
  sectores_y_puestos: Sector[];
}

const CreateJobProfile: FC = () => {
  const formAction = useFetcher();

  useEffect(() => {
    if (formAction.data && formAction.data.error) {
      toast.error(formAction.data.error, { containerId: "job-profiles-toast" });
    } else if (formAction.data && formAction.data.success) {
      toast.success(formAction.data.message, { containerId: "job-profiles-toast" });
    }
  }, [formAction.data]);

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
                <select name="sectorName" id="sectorName">
                  <option value="" disabled>
                    Elige tu sector
                  </option>
                  <option value="1">Transporte</option>
                </select>
              </div>
              <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                <label htmlFor="sectorDescription">Descripción</label>
                <textarea
                  rows={4}
                  id="sectorDescription"
                  title="Descripción del sector"
                  name="sectorDescription"
                  placeholder="ejemplo: Conductor de autobús encargado de rutas urbanas, con experiencia en atención al cliente y manejo de vehículos de gran tamaño."
                />
              </div>
            </section>
            <section className="flex flex-col gap-4 justify-around">
              <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                <label htmlFor="jobPosition">Cual es tu puesto de trabajo?</label>
                <select name="jobPosition" id="jobPosition">
                  <option value="" disabled>
                    Elige tu puesto de trabajo
                  </option>
                  <option value={"monitor"}>Monitor</option>
                </select>
              </div>
              <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
                <label htmlFor="jobDescription">Descripción</label>
                <textarea
                  rows={4}
                  id="jobDescription"
                  title="Descripción del puesto de trabajo"
                  name="jobDescription"
                  placeholder="ejemplo: Conductor de autobús encargado de rutas urbanas, con experiencia en atención al cliente y manejo de vehículos de gran tamaño."
                />
              </div>
            </section>
          </article>
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
