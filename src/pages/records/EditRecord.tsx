import Btn from "@/components/Btn";
import EmptyState from "@/components/EmptyState";
import InfoTooltip from "@/components/InfoTooltip";
import Loading from "@/components/Loading";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router";
import type { RecordService } from "@/services/records.service";
import type { UtilitiesCatalog } from "@/services/utilities.service";
import { useEditRecord } from "./hooks/useEditRecord";

const UTILITY_FIELD_PREFIX = "utility__";

const UTILITY_DB_KEY_FALLBACK: Record<string, string> = {
  nombre_produccion: "production_name",
  ruta_origen_destino: "route_origin_destination",
};

const fieldCls = "flex flex-col gap-1.5";
const labelCls = "text-sm font-semibold text-slate-300";
const inputCls =
  "rounded-xl border border-slate-600 bg-slate-800/60 p-3 text-white transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50";

const toInputDate = (value?: string | Date) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const getUtilityInitialState = (catalog: UtilitiesCatalog, record: RecordService) => {
  const storageKeyToUtilityId = Object.entries(catalog.utility_definitions).reduce<
    Record<string, string>
  >((acc, [utilityId, definition]) => {
    const storageKey =
      definition.dbKey ?? definition.db_key ?? UTILITY_DB_KEY_FALLBACK[utilityId] ?? utilityId;
    acc[storageKey] = utilityId;
    return acc;
  }, {});

  const selectedIds: string[] = [];
  const values: Record<string, string> = {};

  Object.entries(record.utilitiesValues ?? {}).forEach(([storageKey, value]) => {
    const utilityId = storageKeyToUtilityId[storageKey];
    if (!utilityId) {
      return;
    }

    selectedIds.push(utilityId);
    values[utilityId] = String(value);
  });

  return {
    selectedIds: Array.from(new Set(selectedIds)),
    values,
  };
};

type EditRecordFormProps = ReturnType<typeof useEditRecord> & {
  activeUtilities: ReturnType<typeof useUtilities>["activeUtilities"];
  isLoadingUtilities: boolean;
  catalog: UtilitiesCatalog;
};

const EditRecordForm: FC<EditRecordFormProps> = ({
  record,
  jobProfiles,
  selectedProfileId,
  selectedTitle,
  handleProfileChange,
  hasCurrentUser,
  formAction,
  estimatedHourlyRate,
  selectedBranchId,
  selectedJobPositionId,
  activeUtilities,
  isLoadingUtilities,
  catalog,
}) => {
  const [selectedUtilityIds, setSelectedUtilityIds] = useState<string[]>(
    () => getUtilityInitialState(catalog, record as RecordService).selectedIds
  );
  const [utilityValues, setUtilityValues] = useState<Record<string, string>>(
    () => getUtilityInitialState(catalog, record as RecordService).values
  );

  const [startTime, setStartTime] = useState((record?.workStartTime as string | undefined) ?? "");
  const [endTime, setEndTime] = useState((record?.workEndTime as string | undefined) ?? "");
  const [localRate, setLocalRate] = useState(
    estimatedHourlyRate !== undefined ? String(estimatedHourlyRate) : ""
  );

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

  const handleUtilityValueChange = (utilityId: string, value: string) => {
    setUtilityValues((prev) => ({
      ...prev,
      [utilityId]: value,
    }));
  };

  const handleProfileChangeAndReset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUtilityIds([]);
    setUtilityValues({});
    const nextProfileId = event.target.value;
    const newProfile = jobProfiles.find((p) => p.id === nextProfileId);
    setLocalRate(newProfile?.estimatedHourlyRate !== undefined ? String(newProfile.estimatedHourlyRate) : "");
    handleProfileChange(event);
  };

  const localRateNumber = Number(localRate);
  const hasValidRate = localRate !== "" && !Number.isNaN(localRateNumber);
  const showLivePreview = hasValidRate && startTime.length > 0 && endTime.length > 0;

  return (
    <section className="mx-auto w-full max-w-2xl pb-6">
      <formAction.Form className="flex flex-col gap-5 py-4" method="post">
        <fieldset className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Perfil de trabajo
          </legend>

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
                    puesto, sucursal y tarifa horaria.
                  </p>
                }
              />
            </div>
            <select
              name="jobProfileId"
              id="jobProfileId"
              className={inputCls}
              onChange={handleProfileChangeAndReset}
              value={selectedProfileId}
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
                Perfil activo: <span className="font-medium">{selectedTitle}</span>
              </p>
            )}
          </div>

          <div className={fieldCls}>
            <div className="flex items-center gap-2">
              <label htmlFor="estimatedHourlyRate" className={labelCls}>
                Tarifa horaria estimada
              </label>
              <InfoTooltip
                ariaLabel="Información sobre la tarifa horaria estimada"
                content={
                  <p>
                    Valor por hora trabajada. Al guardar, se actualizará también en el perfil de
                    trabajo seleccionado.
                  </p>
                }
              />
            </div>
            <input
              id="estimatedHourlyRate"
              type="number"
              name="estimatedHourlyRate"
              min="0"
              step="0.01"
              className={inputCls}
              value={localRate}
              onChange={(event) => setLocalRate(event.target.value)}
              disabled={isSubmitting}
              placeholder="0.00"
            />
          </div>
        </fieldset>

        <input id="titleJobProfile" type="hidden" name="titleJobProfile" value={selectedTitle} />
        <input id="branchId" type="hidden" name="branchId" value={selectedBranchId} />
        <input id="jobPositionId" type="hidden" name="jobPositionId" value={selectedJobPositionId} />

        <fieldset className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Horario
          </legend>

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
              defaultValue={toInputDate(record?.dateTimeRecord)}
              disabled={isSubmitting}
              className={inputCls}
            />
          </div>

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
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
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
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>

          {showLivePreview && (
            <RecordCalculationSummary
              startTime={startTime}
              endTime={endTime}
              hourlyRate={localRateNumber!}
            />
          )}

          {!showLivePreview && !localRateNumber && (startTime || endTime) && (
            <p className="text-xs text-slate-500">
              Selecciona un perfil para ver el cálculo estimado.
            </p>
          )}
        </fieldset>

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

          {isLoadingUtilities && <p className="text-sm text-slate-400">Cargando utilidades...</p>}

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

          {!isLoadingUtilities &&
            selectedUtilities.map(({ id, definition }) => {
              if (!definition) return null;
              const isRequired = Boolean(definition.required ?? definition.refquired);
              const fieldName = `${UTILITY_FIELD_PREFIX}${id}`;
              const currentValue = utilityValues[id] ?? "";

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
                      value={currentValue}
                      onChange={(event) => handleUtilityValueChange(id, event.target.value)}
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
                      value={currentValue}
                      onChange={(event) => handleUtilityValueChange(id, event.target.value)}
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
                    value={currentValue}
                    onChange={(event) => handleUtilityValueChange(id, event.target.value)}
                  />
                </div>
              );
            })}
        </fieldset>

        <Btn
          type="submit"
          label={isSubmitting ? "Actualizando..." : "Actualizar registro"}
          formState={isSubmitting}
        />
      </formAction.Form>

      {formAction.data?.error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-red-700 bg-red-900/30 p-3 text-sm text-red-400"
        >
          {formAction.data.error}
        </p>
      )}
    </section>
  );
};

const EditRecord: FC = () => {
  const editRecordState = useEditRecord();
  const navigate = useNavigate();
  const { activeUtilities, isLoadingUtilities, catalog } = useUtilities();
  const { record, jobProfiles, hasCurrentUser, isLoadingProfiles, isLoadingRecord } = editRecordState;
  const hasJobProfiles = jobProfiles.length > 0;

  if (isLoadingRecord || isLoadingUtilities || (hasCurrentUser && isLoadingProfiles)) {
    return <Loading />;
  }

  if (!record) {
    return (
      <EmptyState
        title="No se encontró el registro a editar."
        actionLabel="Volver a registros"
        onAction={() => navigate("/records")}
        fullScreen
      />
    );
  }

  if (hasCurrentUser && !isLoadingProfiles && !hasJobProfiles) {
    return (
      <section className="mx-auto w-full max-w-2xl pb-6">
        <aside className="flex flex-col gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-100">
          <h2 className="text-xl font-semibold text-amber-200">Necesitas un perfil de trabajo</h2>
          <p className="text-sm text-amber-100/90">
            Para editar un registro debes contar con al menos un perfil de trabajo disponible.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/jobs-profiles/add"
              className="rounded-lg border border-cyan-400 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
            >
              Crear primer perfil
            </Link>
            <Link
              to="/jobs-profiles"
              className="rounded-lg border border-slate-500 bg-slate-700/30 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/50"
            >
              Ver perfiles de trabajo
            </Link>
          </div>
        </aside>
      </section>
    );
  }

  return (
    <EditRecordForm
      key={record.id ?? "record-edit"}
      {...editRecordState}
      activeUtilities={activeUtilities}
      isLoadingUtilities={isLoadingUtilities}
      catalog={catalog}
    />
  );
};

export default EditRecord;
