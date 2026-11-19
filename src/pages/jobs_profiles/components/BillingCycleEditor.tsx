import { useState } from "react";
import { updateJobProfile } from "@/services/jobsProfile.service";
import { notify, TOAST_SCOPE } from "@/services/toast.service";
import type { JobProfile } from "@/types";

const BillingCycleEditor = ({ profile }: { profile: JobProfile }) => {
  const [day, setDay] = useState(String(profile.billingCycleStartDay ?? ""));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const value = Number(day);
    if (!Number.isInteger(value) || value < 1 || value > 28 || !profile.id) {
      notify.error("Indica un día entre 1 y 28", { scope: TOAST_SCOPE.PROFILE });
      return;
    }
    try {
      setSaving(true);
      await updateJobProfile(profile.id, { billingCycleStartDay: value });
      notify.success("Ciclo de facturación guardado", { scope: TOAST_SCOPE.PROFILE });
    } catch {
      notify.error("No se pudo guardar el ciclo de facturación", { scope: TOAST_SCOPE.PROFILE });
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="app-panel flex flex-col gap-2 p-3 text-sm">
      <label htmlFor={`cycle-${profile.id}`} className="font-semibold">
        Inicio del ciclo de facturación
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`cycle-${profile.id}`}
          type="number"
          min="1"
          max="28"
          value={day}
          onChange={(event) => setDay(event.target.value)}
          placeholder="Día"
          className="w-20 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg border border-[var(--border)] px-3 py-2"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        {profile.billingCycleStartDay
          ? `Día actual: ${profile.billingCycleStartDay} de cada mes.`
          : "Sin configurar."}{" "}
        Cambiarlo recalcula los ciclos de registros anteriores.
      </p>
    </section>
  );
};
export default BillingCycleEditor;
