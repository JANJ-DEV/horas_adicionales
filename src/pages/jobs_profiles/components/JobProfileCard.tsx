import type { JobProfile } from "@/types";
import { useState, type FC } from "react";
import JobPositionCard from "./JobPositionCard";
import BranchCard from "./BranchCard";
import Header from "@/components/Header";
import ProfileTitle from "./ProfileTitle";
import CardBody from "./CardBody";
import EstimatedHourlyRate from "./EstimatedHourlyRate";
import Btn from "@/components/Btn";
import CardFooter from "./CardFooter";
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
    <article className="group relative overflow-hidden rounded-xl border border-cyan-400/25 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-5 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-cyan-500/20">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <Header type="card">
        <ProfileTitle title={jobProfile.title} />
      </Header>
      <CardBody variant="card">
        <BranchCard branch={jobProfile.branch} />
        <JobPositionCard jobPosition={jobProfile.jobPosition} />
        <EstimatedHourlyRate rate={jobProfile.estimatedHourlyRate} />
      </CardBody>
      <CardFooter variant="card">
        {isRemoveProfile && (
          <span className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white font-bold text-lg rounded-xl">
            Eliminando...
          </span>
        )}
        {!isRemoveProfile && <Btn label="Eliminar" onClick={handleDeleteProfile} />}
      </CardFooter>
    </article>
  );
};

export default JobProfileCard;
