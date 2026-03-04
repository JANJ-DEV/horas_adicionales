import type { FC } from "react";
import { useFetcher } from "react-router";
import { ToastContainer } from "react-toastify";

const CreateJobProfile: FC = () => {
  const formAction = useFetcher();
  const { jobProfile } = formAction.data || {};
  return (
    <section>
      <h1>Crear nuevo perfil de trabajo</h1>
      <formAction.Form action="/job-profiles/add" method="post" className="flex flex-col gap-4">
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="nombre-perfil">Nombre del perfil de trabajo</label>
          <input
            id="nombre-perfil"
            title="Nombre del perfil de trabajo"
            type="text"
            name="nombre-perfil"
            placeholder=""
            required
          />
        </div>
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="puesto-trabajo">Puesto de trabajo</label>
          <input
            id="puesto-trabajo"
            title="Puesto de trabajo"
            type="text"
            name="puesto-trabajo"
            placeholder=""
            required
          />
        </div>
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="descripcion">Descripción del perfil de trabajo</label>
          <textarea
            id="descripcion"
            title="Descripción del perfil de trabajo"
            name="descripcion"
            placeholder=""
          />
        </div>
        <button type="submit" disabled={formAction.state === "submitting"}>
          {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
        </button>
        {formAction.data && formAction.data.error && (
          <p className="text-red-500">{formAction.data.error}</p>
        )}
        {formAction.data && formAction.data.success && (
          <p className="text-green-500">{formAction.data.message}</p>
        )}
        {jobProfile && (
          <p className="text-green-500">Perfil de trabajo creado: {jobProfile.nombrePerfil}</p>
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
