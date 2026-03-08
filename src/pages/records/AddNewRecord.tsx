import useAuth from "@/context/hooks/auth.hook";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { useEffect, useState, type FC } from "react";
import { useFetcher } from "react-router";

const AddNewRecord: FC = () => {
  const { currentUser } = useAuth();
  const formAction = useFetcher();
  const hasCurrentUser = Boolean(currentUser?.uid);

  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // Actualizamos el estado en lugar de manipular el DOM directamente
  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = event.target.value;
    const profile = jobProfiles.find((p) => p.id === selectedProfileId);
    setSelectedTitle(profile ? profile.title : "");
  };

  // Efecto para la suscripción a los perfiles
  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setJobProfiles(profiles);
        setLoading(false);
      },
      (error) => {
        console.error("Error al suscribirse a perfiles de trabajo:", error);
        setJobProfiles([]);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    // Cleanup correcto: se ejecuta cuando el componente se desmonta
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

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

        {/* Input oculto ahora controlado por React */}
        <input
          id="titleJobProfile"
          title="Nombre de la empresa"
          type="hidden"
          name="titleJobProfile"
          value={selectedTitle}
        />

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

        <button
          type="submit"
          disabled={formAction.state === "submitting"}
          className="bg-blue-500 text-white p-4 rounded-xl disabled:bg-gray-400"
        >
          {formAction.state === "submitting" ? "Guardando..." : "Guardar"}
        </button>
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
