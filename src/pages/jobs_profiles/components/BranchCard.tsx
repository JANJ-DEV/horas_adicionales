import type { Branch } from "@/types";
import Btn from "@/components/Btn";
import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { toast } from "react-toastify";
import { updateJobProfile } from "@/services/jobsProfile.service";
import useBranches from "@/context/hooks/useBranches.hook.";
import SelectJobProfile from "./SelectJobProfile";

const BranchCard: FC<{ branch: Branch; jobProfileId: string }> = ({ branch, jobProfileId }) => {
  const { branches } = useBranches();
  const [isUpdatingBranch, setIsUpdatingBranch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(branch.id);

  const toggleUpdateBranch = () => {
    if (!isUpdatingBranch) {
      setSelectedBranchId(branch.id);
    }
    setIsUpdatingBranch(!isUpdatingBranch);
  };

  const handleChangeBranch = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranchId(event.target.value);
  };

  const selectedBranch =
    branches.find((branchItem) => branchItem.id === selectedBranchId) ?? branch;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBranchId) {
      toast.error("Debes seleccionar una rama", { containerId: "profile" });
      return;
    }

    if (!selectedBranch) {
      toast.error("No se encontró la rama seleccionada", { containerId: "profile" });
      return;
    }

    if (selectedBranchId === branch.id) {
      toast.info("No hay cambios para guardar", { containerId: "profile" });
      setIsUpdatingBranch(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateJobProfile(jobProfileId, {
        branch: {
          ...selectedBranch,
        },
      });
      toast.success("Rama actualizada correctamente", { containerId: "profile" });
      setIsUpdatingBranch(false);
    } catch (error) {
      console.error("Error al actualizar la rama del perfil", error);
      toast.error("No se pudo actualizar la rama", { containerId: "profile" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
      <header className="flex items-center justify-between">
        <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
          Rama
        </strong>
        <Btn
          size="xs"
          label={isUpdatingBranch ? "x" : "Editar"}
          variant={isUpdatingBranch ? "danger" : "outline"}
          title={`Ver detalles del perfil de trabajo: ${branch.name}`}
          onClick={toggleUpdateBranch}
          formState={isSaving}
        />
      </header>

      {isUpdatingBranch ? (
        <form onSubmit={handleSubmit}>
          <article className="mt-2">
            <SelectJobProfile
              branches={branches}
              onChangeSelectJobProfile={handleChangeBranch}
              name={`branch-${jobProfileId}`}
              id={`branch-${jobProfileId}`}
              value={selectedBranchId}
              disabled={isSaving}
              label="Selecciona una rama:"
            />
          </article>

          <p className="mt-2 text-sm text-slate-300">{selectedBranch.description}</p>

          <footer className="mt-4 flex justify-end gap-4 items-center">
            <Btn
              size="xs"
              label="Cancelar"
              variant="danger"
              title={`Cancelar cambios del perfil de trabajo: ${branch.name}`}
              type="button"
              onClick={toggleUpdateBranch}
              formState={isSaving}
            />
            <Btn
              size="xs"
              label={isSaving ? "Guardando..." : "Guardar"}
              variant={isSaving ? "loading" : "success"}
              title={`Guardar cambios del perfil de trabajo: ${branch.name}`}
              type="submit"
              formState={isSaving}
            />
          </footer>
        </form>
      ) : (
        <>
          <article className="mt-2">
            <strong className="text-base text-white">{branch.name}</strong>
          </article>
          <p className="mt-1 text-sm text-slate-300">{branch.description}</p>
        </>
      )}
    </section>
  );
};

export default BranchCard;
