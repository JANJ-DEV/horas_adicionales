import type { JobPosition } from "@/types";
import { useState, type FC } from "react";
import IsUpdatingJobPosition from "./IsUpdatingJobPosition";
import Btn from "@/components/Btn";

const JobPositionCard: FC<{ jobPosition: JobPosition }> = ({ jobPosition }) => {
  const [isUpdatingJobPosition, setIsUpdatingJobPosition] = useState(false);
  const toggleUpdateJobPosition = () => {
    setIsUpdatingJobPosition(!isUpdatingJobPosition);
  };
  return (
    <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
      <header className="flex items-center justify-between">
        <strong className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
          Puesto
        </strong>
        <Btn
          size="xs"
          label={isUpdatingJobPosition ? "x" : "Editar"}
          variant={isUpdatingJobPosition ? "danger" : "outline"}
          title={`Ver detalles del perfil de trabajo: ${jobPosition.name}`}
          onClick={toggleUpdateJobPosition}
        />
      </header>
      {!isUpdatingJobPosition && (
        <article className="mt-2">
          <strong className="text-base text-white">{jobPosition.name}</strong>
          <p className="mt-1 text-sm text-slate-300">{jobPosition.description}</p>
        </article>
      )}
      <IsUpdatingJobPosition state={isUpdatingJobPosition} jobPosition={jobPosition} />
    </section>
  );
};

export default JobPositionCard;
