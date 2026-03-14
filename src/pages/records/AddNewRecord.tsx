import Btn from "@/components/Btn";
import InfoTooltip from "@/components/InfoTooltip";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { useAddRecord } from "./hooks/useAddRecord";
import { useState, type FC } from "react";

const UTILITY_FIELD_PREFIX = "utility__";

const todayISO = () => new Date().toISOString().split("T")[0];

const fieldCls = "flex flex-col gap-1.5";
const labelCls = "text-sm font-semibold text-slate-300";
const inputCls =
  "rounded-xl border border-slate-600 bg-slate-800/60 p-3 text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50";

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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const isSubmitting = formAction.state === "submitting";

  const selectedUtilities = activeUtilities.filter(
    ({ id, definition }) => Boolean(definition) && selectedUtilityIds.includes(id)
  );

  const genericUtilities = activeUtilities.filter(
    (utility) => utility.definition && utility.id === "comment_box"
  );

  const profileSpecificUtilities = activeUtilities.filter(
    (utility) => utility.definition && utility.id !== "comment_box"
  );

  const toggleUtilitySelection = (utilityId: string) => {
    setSelectedUtilityIds((prev) =>
      prev.includes(utilityId) ? prev.filter((id) => id !== utilityId) : [...prev, utilityId]
    );
  };

  const handleProfileChangeAndReset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUtilityIds([]);
    handleProfileChange(event);
  };

  const formResetKey = formAction.data ? JSON.stringify(formAction.data) : "initial";
  const estimatedHourlyRateValue =
    estimatedHourlyRate !== undefined ? String(estimatedHourlyRate) : "";

  const showLivePreview =
    Boolean(estimatedHourlyRate) &&
    startTime.length > 0 &&
    endTime.length > 0;

  return (
    <section className="mx-auto w-full max-w-2xl pb-6">
      {/* La key fuerza un remount tras éxito y limpia el formulario */}
      <formAction.Form key={formResetKey} className="flex flex-col gap-5 py-4" method="post">
        {/* ── Perfil de trabajo ── */}
        <fieldset className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Perfil de trabajo
          </legend>

          {hasCurrentUser && loading ? (
            <p className="text-sm text-slate-400">Cargando perfiles...</p>
          ) : (
            <div className={fieldCls}>
              <div className="flex items-center gap-2">
                <label htmlFor="jobProfileId" className={labelCls}>
                  Perfil <span className="text-red-400">*</span>
                </label>
                <InfoTooltip
                  ariaLabel="Información sobre el perfil de trabajo"
                  content={
                    <p>
                      Elige el perfil que corresponda a esta jornada. Cada perfil tiene asociado un
                      puesto, sucursal y tarifa horaria. Si no tienes perfiles, créalos en{" "}
                      <strong>Perfiles de trabajo</strong>.
                    </p>
                  }
                />
              </div>
              <select
                name="jobProfileId"
                id="jobProfileId"
                className={inputCls}
                onChange={handleProfileChangeAndReset}
                defaultValue=""
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Selecciona un perfil de trabajo
                </option>
                {(hasCurrentUser ? jobProfiles : []).map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.title}
                  </option>
                ))}
              </select>
              {selectedTitle && (
                <p className="text-xs text-cyan-400">
                  Perfil activo:{" "}
                  <span className="font-medium">{selectedTitle}</span>
                </p>
              )}
            </div>
          )}
        </fieldset>

        {/* Hidden inputs */}
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

        {/* ── Horario ── */}
        <fieldset className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Horario
          </legend>

          {/* Fecha */}
          <div className={fieldCls}>
            <div className="flex items-center gap-2">
              <label htmlFor="dateTimeRecord" className={labelCls}>
                Fecha <span className="text-red-400">*</span>
              </label>
              <InfoTooltip
                ariaLabel="Información sobre la fecha del registro"
                content={<p>Día en el que trabajaste las horas adicionales.</p>}
              />
            </div>
            <input
              id="dateTimeRecord"
              type="date"
              name="dateTimeRecord"
              required
              defaultValue={todayISO()}
              disabled={isSubmitting}
              className={inputCls}
            />
          </div>

          {/* Hora entrada / salida — 2 cols en md+ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={fieldCls}>
              <div className="flex items-center gap-2">
                <label htmlFor="workStartTime" className={labelCls}>
                  Hora de entrada <span className="text-red-400">*</span>
                </label>
                <InfoTooltip
                  ariaLabel="Información sobre la hora de entrada"
                  content={
                    <p>
                      Hora a la que empezaste a trabajar. Se usa junto con la hora de salida para
                      calcular el total de horas y el salario estimado.
                    </p>
                  }
                />
              </div>
              <input
                id="workStartTime"
                type="time"
                name="workStartTime"
                required
                disabled={isSubmitting}
                className={inputCls}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className={fieldCls}>
              <div className="flex items-center gap-2">
                <label htmlFor="workEndTime" className={labelCls}>
                  Hora de salida <span className="text-red-400">*</span>
                </label>
                <InfoTooltip
                  ariaLabel="Información sobre la hora de salida"
                  content={
                    <p>
                      Hora a la que terminaste. Se usa junto con la hora de entrada para calcular
                      el total de horas y el salario estimado.
                    </p>
                  }
                />
              </div>
              <input
                id="workEndTime"
                type="time"
                name="workEndTime"
                required
                disabled={isSubmitting}
                className={inputCls}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Resumen en tiempo real */}
          {showLivePreview && (
            <RecordCalculationSummary
              startTime={startTime}
              endTime={endTime}
              hourlyRate={estimatedHourlyRate!}
            />
          )}

          {!showLivePreview && !estimatedHourlyRate && (startTime || endTime) && (
            <p className="text-xs text-slate-500">
              Selecciona un perfil para ver el cálculo estimado.
            </p>
          )}
        </fieldset>

        {/* ── Utilidades ── */}
        <fieldset className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <legend className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Utilidades
            </span>
            <InfoTooltip
              ariaLabel="Información sobre las utilidades"
              content={
                <p>
                  Campos adicionales opcionales o requeridos según tu puesto. Aparecen al
                  seleccionar un perfil de trabajo.
                </p>
              }
            />
          </legend>

          {isLoadingUtilities && (
            <p className="text-sm text-slate-400">Cargando utilidades...</p>
          )}

          {!isLoadingUtilities && activeUtilities.length === 0 && (
            <p className="text-sm text-slate-500">
              Selecciona un perfil para mostrar las utilidades disponibles.
            </p>
          )}

          {!isLoadingUtilities && activeUtilities.length > 0 && (
            <div className="flex flex-col gap-3">
              {genericUtilities.length > 0 && (
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-400">Utilidades generales</p>
                  <div className="flex flex-col gap-1">
                    {genericUtilities.map(({ id, definition }) => {
                      if (!definition) return null;
                      const checkboxId = `selector-${id}`;
                      return (
                        <label
                          key={id}
                          htmlFor={checkboxId}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-700/50"
                        >
                          <input
                            id={checkboxId}
                            type="checkbox"
                            name="selectedUtilityIds"
                            value={id}
                            checked={selectedUtilityIds.includes(id)}
                            onChange={() => toggleUtilitySelection(id)}
                            className="accent-cyan-500"
                            disabled={isSubmitting}
                          />
                          <span>{definition.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {profileSpecificUtilities.length > 0 && (
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Utilidades del puesto seleccionado
                  </p>
                  <div className="flex flex-col gap-1">
                    {profileSpecificUtilities.map(({ id, definition }) => {
                      if (!definition) return null;
                      const checkboxId = `selector-${id}`;
                      return (
                        <label
                          key={id}
                          htmlFor={checkboxId}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-700/50"
                        >
                          <input
                            id={checkboxId}
                            type="checkbox"
                            name="selectedUtilityIds"
                            value={id}
                            checked={selectedUtilityIds.includes(id)}
                            onChange={() => toggleUtilitySelection(id)}
                            className="accent-cyan-500"
                            disabled={isSubmitting}
                          />
                          <span>{definition.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {profileSpecificUtilities.length === 0 && selectedJobPositionId && (
                <p className="text-xs text-slate-500">
                  Este puesto no tiene utilidades específicas configuradas.
                </p>
              )}
            </div>
          )}

          {/* Campos de utilidades seleccionadas */}
          {!isLoadingUtilities &&
            selectedUtilities.map(({ id, definition }) => {
              if (!definition) return null;
              const isRequired = Boolean(definition.required ?? definition.refquired);
              const fieldName = `${UTILITY_FIELD_PREFIX}${id}`;

              if (definition.type === "textarea") {
                return (
                  <div className={fieldCls} key={id}>
                    <label htmlFor={fieldName} className={labelCls}>
                      {definition.label}
                      {isRequired && <span className="ml-1 text-red-400">*</span>}
                    </label>
                    <textarea
                      id={fieldName}
                      name={fieldName}
                      required={isRequired}
                      disabled={isSubmitting}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                );
              }

              if (definition.type === "select") {
                return (
                  <div className={fieldCls} key={id}>
                    <label htmlFor={fieldName} className={labelCls}>
                      {definition.label}
                      {isRequired && <span className="ml-1 text-red-400">*</span>}
                    </label>
                    <select
                      id={fieldName}
                      name={fieldName}
                      required={isRequired}
                      disabled={isSubmitting}
                      className={inputCls}
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
                <div className={fieldCls} key={id}>
                  <label htmlFor={fieldName} className={labelCls}>
                    {definition.label}
                    {isRequired && <span className="ml-1 text-red-400">*</span>}
                  </label>
                  <input
                    id={fieldName}
                    name={fieldName}
                    type={definition.type === "number" ? "number" : "text"}
                    required={isRequired}
                    disabled={isSubmitting}
                    className={inputCls}
                  />
                </div>
              );
            })}
        </fieldset>

        <Btn
          type="submit"
          label={isSubmitting ? "Guardando..." : "Guardar registro"}
          formState={isSubmitting}
        />
      </formAction.Form>

      {/* Mensajes de estado */}
      {formAction.data?.error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-700 bg-red-900/30 p-3 text-sm text-red-400"
        >
          {formAction.data.error}
        </p>
      )}
      {formAction.data && formAction.state === "idle" && !formAction.data?.error && (
        <p
          role="status"
          className="mt-3 rounded-xl border border-green-700 bg-green-900/30 p-3 text-sm text-green-400"
        >
          Registro para <strong>{formAction.data.titleJobProfile}</strong> guardado con éxito.
        </p>
      )}
    </section>
  );
};

export default AddNewRecord;
