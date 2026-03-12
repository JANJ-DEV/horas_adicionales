import { useEffect, useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import type { JobPosition, JobProfile } from "@/types";
import { getBranchById } from "@/services/branches.services";
import { updateJobProfile } from "@/services/jobsProfile.service";
import { toast } from "react-toastify";
import SelectJobPositionFromBranchId from "./SelectJobPosition";
import Btn from "@/components/Btn";
import CardFooter from "./CardFooter";

type Props = {
  state: boolean;
  jobProfile: JobProfile;
  onClose: () => void;
};

const IsUpdatingJobPosition: FC<Props> = ({ state, jobProfile, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [jobsPositionsFromBranch, setJobsPositionsFromBranch] = useState<JobPosition[]>([]);
  const [selectedJobPositionId, setSelectedJobPositionId] = useState(jobProfile.jobPosition.id);

  useEffect(() => {
    if (!state) return;

    getBranchById(jobProfile.branch.id)
      .then((branch) => {
        setJobsPositionsFromBranch(branch?.jobsPositions ?? []);
      })
      .catch((error) => {
        console.error("Error al obtener puestos de la rama", error);
      });
  }, [state, jobProfile.branch.id]);

  const handleChangeSelectJobPosition = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobPositionId(event.target.value);
  };

  const selectedJobPosition =
    jobsPositionsFromBranch.find((job) => job.id === selectedJobPositionId) ??
    jobProfile.jobPosition;

  const handlerSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!jobProfile.id) {
      toast.error("No se encontró el identificador del perfil", { containerId: "profile" });
      return;
    }

    if (!selectedJobPositionId) {
      toast.error("Debes seleccionar un puesto de trabajo", { containerId: "profile" });
      return;
    }

    if (selectedJobPositionId === jobProfile.jobPosition.id) {
      toast.info("No hay cambios para guardar", { containerId: "profile" });
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      await updateJobProfile(jobProfile.id, {
        jobPosition: {
          id: selectedJobPosition.id,
          name: selectedJobPosition.name,
          description: selectedJobPosition.description,
        },
      });
      toast.success("Puesto actualizado correctamente", { containerId: "profile" });
      onClose();
    } catch (error) {
      console.error("Error al actualizar el puesto del perfil", error);
      toast.error("No se pudo actualizar el puesto", { containerId: "profile" });
    } finally {
      setIsSaving(false);
    }
  };

  return state ? (
    <form className="bg-dark text-white text-2xl" onSubmit={handlerSubmit}>
      <SelectJobPositionFromBranchId
        name={`job-position-${jobProfile.id ?? "unknown"}`}
        variant="id"
        branchId={jobProfile.branch.id}
        value={selectedJobPositionId}
        onChangeSelectJobPosition={handleChangeSelectJobPosition}
      />
      {selectedJobPosition.description && (
        <p className="mt-2 text-sm text-slate-300">{selectedJobPosition.description}</p>
      )}

      <CardFooter variant="card">
        <Btn
          size="xs"
          label="Cancelar"
          variant="danger"
          title={`Cancelar cambios del puesto: ${jobProfile.jobPosition.name}`}
          type="button"
          onClick={onClose}
          formState={isSaving}
        />
        <Btn
          size="xs"
          label={isSaving ? "Guardando..." : "Guardar"}
          variant={isSaving ? "loading" : "success"}
          title={`Guardar cambios del puesto: ${jobProfile.jobPosition.name}`}
          type="submit"
          formState={isSaving}
        />
      </CardFooter>
    </form>
  ) : null;
};

export default IsUpdatingJobPosition;
