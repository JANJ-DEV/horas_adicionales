import type { Branch } from "@/types";
import Btn from "@/components/Btn";
import { useState, type FC } from "react";

const BranchCard: FC<{ branch: Branch }> = ({ branch }) => {
  const [isUpdatingBranch, setIsUpdatingBranch] = useState(false);
  const toggleUpdateBranch = () => {
    setIsUpdatingBranch(!isUpdatingBranch);
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
        />
      </header>
      <article className="mt-2">
        {isUpdatingBranch ? (
          <input
            type="text"
            name="jobName"
            defaultValue={branch.name}
            className="w-full border py-2 px-4 rounded text-sm lg:text-base"
          />
        ) : (
          <strong className="text-base text-white">{branch.name}</strong>
        )}
      </article>
      {isUpdatingBranch ? (
        <textarea
          rows={5}
          name="description"
          id="description"
          defaultValue={branch.description}
          className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
        />
      ) : (
        <p className="mt-1 text-sm text-slate-300">{branch.description}</p>
      )}
      {isUpdatingBranch && (
        <footer className="mt-4 flex justify-end">
          <Btn
            size="xs"
            label="Guardar"
            variant="success"
            title={`Guardar cambios del perfil de trabajo: ${branch.name}`}
            onClick={toggleUpdateBranch}
          />
        </footer>
      )}
    </section>
  );
};

export default BranchCard;
