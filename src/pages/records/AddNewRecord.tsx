import type { FC } from "react";
import { useFetcher } from "react-router";

const AddNewRecord: FC = () => {
  const formAction = useFetcher();

  return (
    <section>
      <formAction.Form className="flex flex-col gap-4" method="post">
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="nombre-empresa">Nombre de la empresa</label>
          <input
            id="nombre-empresa"
            title="Nombre de la empresa"
            type="text"
            name="nombre-empresa"
            placeholder=""
            required
          />
        </div>
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="fecha">Fecha</label>
          <input id="fecha" title="Fecha" type="date" name="fecha" placeholder="" required />
        </div>
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="hora-entrada">Hora de entrada</label>
          <input
            id="hora-entrada"
            title="Hora de entrada"
            type="time"
            name="hora-entrada"
            placeholder=""
            required
          />
        </div>
        <div className="flex flex-col text-xl border p-4 rounded-xl gap-4">
          <label htmlFor="hora-salida">Hora de salida</label>
          <input
            id="hora-salida"
            title="Hora de salida"
            type="time"
            name="hora-salida"
            placeholder=""
            required
          />
        </div>
        <button type="submit" disabled={formAction.state === "submitting"}>
          {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
        </button>
      </formAction.Form>
      {formAction.data && <p className="text-green-500">{formAction.data.nombreEmpresa}</p>}
    </section>
  );
};

export default AddNewRecord;
