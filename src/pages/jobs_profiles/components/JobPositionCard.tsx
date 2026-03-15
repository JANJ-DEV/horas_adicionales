import type { JobProfile } from "@/types";
import { useState, type FC } from "react";
import IsUpdatingJobPosition from "./IsUpdatingJobPosition";
import Btn from "@/components/Btn";

const JobPositionCard: FC<{ jobProfile: JobProfile }> = ({ jobProfile }) => {
  const [isUpdatingJobPosition, setIsUpdatingJobPosition] = useState(false);
  const toggleUpdateJobPosition = () => {
    setIsUpdatingJobPosition(!isUpdatingJobPosition);
  };
  return (
    <section className="app-panel p-3">
      <header className="flex items-center justify-between">
        <strong className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Puesto
        </strong>
        <Btn
          size="xs"
          label={isUpdatingJobPosition ? "x" : "Editar"}
          variant={isUpdatingJobPosition ? "danger" : "outline"}
          title={`Ver detalles del perfil de trabajo: ${jobProfile.jobPosition.name}`}
          onClick={toggleUpdateJobPosition}
        />
      </header>
      {!isUpdatingJobPosition && (
        <article className="mt-2">
          <strong className="text-base text-[var(--text)]">{jobProfile.jobPosition.name}</strong>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {jobProfile.jobPosition.description}
          </p>
        </article>
      )}
      <IsUpdatingJobPosition
        state={isUpdatingJobPosition}
        jobProfile={jobProfile}
        onClose={() => setIsUpdatingJobPosition(false)}
      />
    </section>
  );
};

export default JobPositionCard;
