import Btn from "@/components/Btn";
import { handleAppError } from "@/services/error.service";
import { updateJobProfile } from "@/services/jobsProfile.service";
import { updateEstimatedHourlyRateByJobProfile } from "@/services/records.service";
import { useState, type FC, type SubmitEvent } from "react";
import CardFooter from "./CardFooter";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const EstimatedHourlyRate: FC<{
  rate: number | null | undefined;
  jobProfileId: string;
  profileTitle: string;
  branchId?: string;
  jobPositionId?: string;
}> = ({ rate, jobProfileId, profileTitle, branchId, jobPositionId }) => {
  const [isUpdatingRate, setIsUpdatingRate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncExistingRecords, setSyncExistingRecords] = useState(false);

  const normalizedCurrentRate = Number(rate ?? 0);

  const toggleUpdatingRate = () => {
    setIsUpdatingRate(!isUpdatingRate);
    setSyncExistingRecords(false);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputValue = String(formData.get(`estimated-hourly-rate-${jobProfileId}`) ?? "")
      .trim()
      .replace(",", ".");

    if (!inputValue) {
      notify.error("La tarifa estimada es obligatoria", { scope: TOAST_SCOPE.PROFILE });
      return;
    }

    const parsedRate = Number(inputValue);
    if (Number.isNaN(parsedRate) || parsedRate <= 0) {
      notify.error("La tarifa debe ser un número mayor a 0", { scope: TOAST_SCOPE.PROFILE });
      return;
    }

    if (parsedRate === normalizedCurrentRate) {
      notify.info("No hay cambios para guardar", { scope: TOAST_SCOPE.PROFILE });
      setIsUpdatingRate(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateJobProfile(jobProfileId, { estimatedHourlyRate: parsedRate });

      if (syncExistingRecords) {
        const updatedRecordsCount = await updateEstimatedHourlyRateByJobProfile(
          jobProfileId,
          parsedRate,
          {
            titleJobProfile: profileTitle,
            branchId,
            jobPositionId,
          }
        );

        notify.success(
          updatedRecordsCount > 0
            ? `Tarifa actualizada y aplicada a ${updatedRecordsCount} registros existentes`
            : "Tarifa actualizada. No habia registros existentes para sincronizar",
          { scope: TOAST_SCOPE.PROFILE }
        );
      } else {
        notify.success("Tarifa estimada actualizada correctamente", { scope: TOAST_SCOPE.PROFILE });
      }

      setIsUpdatingRate(false);
    } catch (error) {
      handleAppError(error, "EstimatedHourlyRate.handleSubmit");
      notify.error("No se pudo actualizar la tarifa estimada", { scope: TOAST_SCOPE.PROFILE });
    } finally {
      setIsSaving(false);
    }
  };

  if (!rate && !isUpdatingRate) {
    return (
      <section className="app-panel p-3">
        <header className="flex items-center justify-between">
          <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-strong)]">
            Tarifa estimada
          </strong>
          <Btn
            size="xs"
            label="Editar"
            variant="outline"
            title="Actualizar tarifa estimada"
            onClick={toggleUpdatingRate}
          />
        </header>
        <p className="mt-1 text-sm text-[var(--text-muted)]">No definida</p>
      </section>
    );
  }

  return (
    <section className="app-panel p-3">
      <header className="flex items-center justify-between">
        <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-strong)]">
          Tarifa estimada
        </strong>
        <Btn
          size="xs"
          label={isUpdatingRate ? "x" : "Editar"}
          variant={isUpdatingRate ? "danger" : "outline"}
          title="Actualizar tarifa estimada"
          onClick={toggleUpdatingRate}
          formState={isSaving}
        />
      </header>

      {!isUpdatingRate && (
        <p className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[color:var(--accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          Tarifa estimada: {currencyFormatter.format(normalizedCurrentRate)}/hora
        </p>
      )}

      {isUpdatingRate && (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="0.01"
            min="0"
            name={`estimated-hourly-rate-${jobProfileId}`}
            id={`estimated-hourly-rate-${jobProfileId}`}
            defaultValue={normalizedCurrentRate ? normalizedCurrentRate.toFixed(2) : ""}
            disabled={isSaving}
            className="form-input mt-2 w-full rounded px-4 py-2 text-sm focus:outline-none lg:text-base"
          />

          <label className="mt-3 flex items-start gap-3 text-sm text-[var(--text-muted)]">
            <input
              type="checkbox"
              checked={syncExistingRecords}
              onChange={(event) => setSyncExistingRecords(event.target.checked)}
              disabled={isSaving}
              className="mt-1 h-4 w-4 rounded border-[var(--border)]"
            />
            <span>Aplicar esta tarifa tambien a los registros ya creados con este perfil</span>
          </label>

          <CardFooter variant="card">
            <Btn
              size="xs"
              label="Cancelar"
              variant="danger"
              title="Cancelar cambios de tarifa estimada"
              type="button"
              onClick={toggleUpdatingRate}
              formState={isSaving}
            />
            <Btn
              size="xs"
              label={isSaving ? "Guardando..." : "Guardar"}
              variant={isSaving ? "loading" : "success"}
              title="Guardar cambios de tarifa estimada"
              type="submit"
              formState={isSaving}
            />
          </CardFooter>
        </form>
      )}
    </section>
  );
};

export default EstimatedHourlyRate;
