import { useState, type FC } from "react";
import type { JobProfile } from "@/types";
import JobPositionCard from "./JobPositionCard";
import BranchCard from "./BranchCard";
import Header from "@/components/Header";
import ProfileTitle from "./ProfileTitle";
import CardBody from "./CardBody";
import EstimatedHourlyRate from "./EstimatedHourlyRate";
import Btn from "@/components/Btn";
import CardFooter from "./CardFooter";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import GlitterEffect from "./GlitterEffect";
import IsRemoveProfile from "./IsRemoveProfile";
import { deleteJobProfile } from "@/services/jobsProfile.service";
import { toast } from "react-toastify";

const JobProfileCard: FC<{ jobProfile: JobProfile }> = ({ jobProfile }) => {
  const [isRemoveProfile, setIsRemoveProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (!jobProfile.id) {
      toast.error("No se encontró el identificador del perfil", { containerId: "profile" });
      return;
    }

    const confirmDelete =
      window.prompt(
        `Escribe "Borrar" para confirmar la eliminación del perfil de trabajo: ${jobProfile.title}`
      ) === "Borrar";

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      setIsRemoveProfile(true);
      await deleteJobProfile(jobProfile.id);
      toast.success("Perfil de trabajo eliminado correctamente", { containerId: "profile" });
    } catch (error) {
      console.error("Error al eliminar el perfil de trabajo", error);
      toast.error("No se pudo eliminar el perfil de trabajo", { containerId: "profile" });
      setIsRemoveProfile(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProfileCardSkeleton variant="default">
      <GlitterEffect />
      <Header type="card">
        <ProfileTitle title={jobProfile.title} jobProfileId={jobProfile.id as string} />
      </Header>
      <CardBody variant="card">
        <BranchCard branch={jobProfile.branch} jobProfileId={jobProfile.id as string} />
        <JobPositionCard jobProfile={jobProfile} />
        <EstimatedHourlyRate
          rate={jobProfile.estimatedHourlyRate}
          jobProfileId={jobProfile.id as string}
        />
      </CardBody>
      <CardFooter variant="card">
        <IsRemoveProfile state={isRemoveProfile} message="Eliminando..." />
        {!isRemoveProfile && (
          <Btn
            label={isDeleting ? "Eliminando..." : "Eliminar"}
            size="xs"
            variant={isDeleting ? "loading" : "danger"}
            onClick={handleDeleteProfile}
            formState={isDeleting}
          />
        )}
      </CardFooter>
    </ProfileCardSkeleton>
  );
};

export default JobProfileCard;
