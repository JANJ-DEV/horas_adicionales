import Btn from "@/components/Btn";
import { updateJobProfile } from "@/services/jobsProfile.service";
import { useState, type FC, type SubmitEvent } from "react";
import CardFooter from "./CardFooter";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const EstimatedHourlyRate: FC<{ rate: number | null | undefined; jobProfileId: string }> = ({
  rate,
  jobProfileId,
}) => {
  const [isUpdatingRate, setIsUpdatingRate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const normalizedCurrentRate = Number(rate ?? 0);

  const toggleUpdatingRate = () => {
    setIsUpdatingRate(!isUpdatingRate);
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
      notify.success("Tarifa estimada actualizada correctamente", { scope: TOAST_SCOPE.PROFILE });
      setIsUpdatingRate(false);
    } catch (error) {
      console.error("Error al actualizar la tarifa estimada", error);
      notify.error("No se pudo actualizar la tarifa estimada", { scope: TOAST_SCOPE.PROFILE });
    } finally {
      setIsSaving(false);
    }
  };

  if (!rate && !isUpdatingRate) {
    return (
      <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
        <header className="flex items-center justify-between">
          <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
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
        <p className="mt-1 text-sm text-slate-300">No definida</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
      <header className="flex items-center justify-between">
        <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
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
        <p className="inline-flex items-center rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-sm font-semibold text-orange-200">
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
            className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
          />

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
