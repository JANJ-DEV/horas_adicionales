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

const JobProfileCard: FC<{ jobProfile: JobProfile }> = ({ jobProfile }) => {
  const [isRemoveProfile, setIsRemoveProfile] = useState(false);
  const handleDeleteProfile = () => {
    // Aquí puedes implementar la lógica para eliminar el perfil de trabajo
    // Por ejemplo, podrías mostrar una confirmación antes de eliminar el perfil de trabajo
    const confirmDelete =
      window.prompt(
        `Escribe "Borrar" para confirmar la eliminación del perfil de trabajo: ${jobProfile.id}`
      ) === "Borrar";
    if (confirmDelete) {
      // Lógica para eliminar el perfil de trabajo usando su ID
      setIsRemoveProfile(true);
      // Aquí podrías hacer una llamada a una API para eliminar el perfil de trabajo
    }
    setTimeout(() => {
      setIsRemoveProfile(false);
    }, 3000);
  };

  return (
    <ProfileCardSkeleton variant="default">
      <GlitterEffect />
      <Header type="card">
        <ProfileTitle title={jobProfile.title} />
      </Header>
      <CardBody variant="card">
        <BranchCard branch={jobProfile.branch} />
        <JobPositionCard jobPosition={jobProfile.jobPosition} />
        <EstimatedHourlyRate rate={jobProfile.estimatedHourlyRate} />
      </CardBody>
      <CardFooter variant="card">
        <IsRemoveProfile state={isRemoveProfile} message="Eliminando..." />
        {!isRemoveProfile && (
          <Btn label="Eliminar" size="xs" variant="danger" onClick={handleDeleteProfile} />
        )}
      </CardFooter>
    </ProfileCardSkeleton>
  );
};

export default JobProfileCard;
