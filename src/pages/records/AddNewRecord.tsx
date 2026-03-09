import Btn from "@/components/Btn";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { useAddRecord } from "./hooks/useAddRecord";
import { useEffect, useMemo, useState, type FC } from "react";

const UTILITY_FIELD_PREFIX = "utility__";

const AddNewRecord: FC = () => {
  const {
    jobProfiles,
    loading,
    selectedTitle,
    handleProfileChange,
    hasCurrentUser,
    formAction,
    estimatedHourlyRate,
    selectedBranchId,
    selectedJobPositionId,
  } = useAddRecord();
  const { activeUtilities, isLoadingUtilities } = useUtilities();
  const [selectedUtilityIds, setSelectedUtilityIds] = useState<string[]>([]);

  useEffect(() => {
    // Al cambiar de perfil, el usuario decide de nuevo qué utilidades usar.
    setSelectedUtilityIds([]);
  }, [selectedBranchId, selectedJobPositionId]);

  const selectedUtilities = useMemo(
    () =>
      activeUtilities.filter(
        ({ id, definition }) => Boolean(definition) && selectedUtilityIds.includes(id)
      ),
    [activeUtilities, selectedUtilityIds]
  );

  const genericUtilities = useMemo(
    () => activeUtilities.filter((utility) => utility.definition && utility.id === "comment_box"),
    [activeUtilities]
  );

  const profileSpecificUtilities = useMemo(
    () => activeUtilities.filter((utility) => utility.definition && utility.id !== "comment_box"),
    [activeUtilities]
  );

  const toggleUtilitySelection = (utilityId: string) => {
    setSelectedUtilityIds((prev) =>
      prev.includes(utilityId) ? prev.filter((id) => id !== utilityId) : [...prev, utilityId]
    );
  };

  const formResetKey = formAction.data ? JSON.stringify(formAction.data) : "initial";
  const estimatedHourlyRateValue =
    estimatedHourlyRate !== undefined ? String(estimatedHourlyRate) : "";

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
            value={estimatedHourlyRateValue}
          />
          <input id="branchId" type="hidden" name="branchId" value={selectedBranchId} />
          <input
            id="jobPositionId"
            type="hidden"
            name="jobPositionId"
            value={selectedJobPositionId}
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

        <section className="flex flex-col gap-4">
          <h3 className="text-xl">Utilidades</h3>

          {isLoadingUtilities && <p>Cargando utilidades...</p>}

          {!isLoadingUtilities && activeUtilities.length === 0 && (
            <p className="text-sm text-gray-300">Selecciona un perfil para mostrar utilidades.</p>
          )}

          {!isLoadingUtilities && activeUtilities.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-300">Elige las utilidades que deseas usar:</p>

              {genericUtilities.length > 0 && (
                <div className="rounded-md border border-gray-700 p-3">
                  <p className="text-xs text-gray-400 mb-2">Utilidades generales</p>
                  {genericUtilities.map(({ id, definition }) => {
                    if (!definition) return null;
                    const checkboxId = `selector-${id}`;

                    return (
                      <label
                        key={id}
                        htmlFor={checkboxId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          id={checkboxId}
                          type="checkbox"
                          name="selectedUtilityIds"
                          value={id}
                          checked={selectedUtilityIds.includes(id)}
                          onChange={() => toggleUtilitySelection(id)}
                        />
                        <span>{definition.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {profileSpecificUtilities.length > 0 && (
                <div className="rounded-md border border-gray-700 p-3">
                  <p className="text-xs text-gray-400 mb-2">Utilidades del puesto seleccionado</p>
                  {profileSpecificUtilities.map(({ id, definition }) => {
                    if (!definition) return null;
                    const checkboxId = `selector-${id}`;

                    return (
                      <label
                        key={id}
                        htmlFor={checkboxId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          id={checkboxId}
                          type="checkbox"
                          name="selectedUtilityIds"
                          value={id}
                          checked={selectedUtilityIds.includes(id)}
                          onChange={() => toggleUtilitySelection(id)}
                        />
                        <span>{definition.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {profileSpecificUtilities.length === 0 && selectedJobPositionId && (
                <p className="text-xs text-gray-400">
                  Este puesto no tiene utilidades específicas configuradas.
                </p>
              )}
            </div>
          )}

          {!isLoadingUtilities &&
            selectedUtilities.map(({ id, definition }) => {
              if (!definition) return null;

              const isRequired = Boolean(definition.required ?? definition.refquired);
              const fieldName = `${UTILITY_FIELD_PREFIX}${id}`;

              if (definition.type === "textarea") {
                return (
                  <div className="flex flex-col text-xl gap-2" key={id}>
                    <label htmlFor={fieldName}>{definition.label}</label>
                    <textarea
                      id={fieldName}
                      name={fieldName}
                      required={isRequired}
                      className="border p-4 rounded-xl"
                    />
                  </div>
                );
              }

              if (definition.type === "select") {
                return (
                  <div className="flex flex-col text-xl gap-2" key={id}>
                    <label htmlFor={fieldName}>{definition.label}</label>
                    <select
                      id={fieldName}
                      name={fieldName}
                      required={isRequired}
                      className="border p-4 rounded-xl"
                    >
                      <option value="">Selecciona una opción</option>
                      {(definition.options ?? []).map((option) => (
                        <option key={`${id}-${option}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div className="flex flex-col text-xl gap-2" key={id}>
                  <label htmlFor={fieldName}>{definition.label}</label>
                  <input
                    id={fieldName}
                    name={fieldName}
                    type={definition.type === "number" ? "number" : "text"}
                    required={isRequired}
                    className="border p-4 rounded-xl"
                  />
                </div>
              );
            })}
        </section>

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
