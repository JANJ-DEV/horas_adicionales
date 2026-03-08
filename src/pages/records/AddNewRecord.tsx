import Btn from "@/components/Btn";
import { useAddRecord } from "./hooks/useAddRecord";
import { type FC } from "react";

const AddNewRecord: FC = () => {
  const {
    jobProfiles,
    loading,
    selectedTitle,
    handleProfileChange,
    hasCurrentUser,
    formAction,
    estimatedHourlyRate,
  } = useAddRecord();

  const formResetKey = formAction.data ? JSON.stringify(formAction.data) : "initial";

  return (
    <section>
      {/* La key fuerza un remount tras éxito y limpia el formulario + estado local */}
      <formAction.Form key={formResetKey} className="flex flex-col gap-4" method="post">
        {hasCurrentUser && loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="flex flex-col text-xl gap-4">
            <label htmlFor="jobProfileId">Perfiles de trabajo guardados</label>
            <select
              name="jobProfileId"
              id="jobProfileId"
              className="border p-4 rounded-xl"
              onChange={handleProfileChange}
              required // Recomendable hacer requerido el select
            >
              <option value="">Selecciona un perfil de trabajo</option>
              {(hasCurrentUser ? jobProfiles : []).map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <>
          {/* Input oculto ahora controlado por React */}
          <input id="titleJobProfile" type="hidden" name="titleJobProfile" value={selectedTitle} />
          <input
            id="estimatedHourlyRate"
            type="hidden"
            name="estimatedHourlyRate"
            value={estimatedHourlyRate}
          />
        </>
        <div className="flex flex-col text-xl gap-4">
          <label htmlFor="dateTimeRecord">Fecha</label>
          <input
            id="dateTimeRecord"
            title="Fecha"
            type="date"
            name="dateTimeRecord"
            required
            className="border p-4 rounded-xl"
          />
        </div>

        <div className="flex flex-col text-xl gap-4">
          <label htmlFor="workStartTime">Hora de entrada</label>
          <input
            id="workStartTime"
            title="Hora de entrada"
            type="time"
            name="workStartTime"
            className="border p-4 rounded-xl"
            required
          />
        </div>

        <div className="flex flex-col text-xl gap-4">
          <label htmlFor="workEndTime">Hora de salida</label>
          <input
            id="workEndTime"
            title="Hora de salida"
            type="time"
            name="workEndTime"
            className="border p-4 rounded-xl"
            required
          />
        </div>
        <Btn
          type="submit"
          label={formAction.state === "submitting" ? "Guardando..." : "Guardar"}
          formState={formAction.state === "submitting"}
        />

        {/* <button
          type="submit"
          disabled={formAction.state === "submitting"}
          className="bg-blue-500 text-white p-4 rounded-xl disabled:bg-gray-400"
        >
          {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
        </button> */}
      </formAction.Form>

      {/* Mensaje de éxito */}
      {formAction.data && formAction.state === "idle" && (
        <p className="text-green-500">
          Registro para {formAction.data.titleJobProfile} guardado con éxito.
        </p>
      )}
    </section>
  );
};

export default AddNewRecord;
