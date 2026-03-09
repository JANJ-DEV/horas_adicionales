import type { JobProfile } from "@/types";
import type { FC } from "react";

const JobProfileCard: FC<{ jobProfile: JobProfile }> = ({ jobProfile }) => {
  return (
    <article
      key={jobProfile.id}
      className="group relative overflow-hidden rounded-xl border border-cyan-400/25 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-5 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-cyan-500/20"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <header className="mb-4 border-b border-white/10 pb-3">
        <h3 className="text-xl font-semibold text-cyan-100">{jobProfile.title}</h3>
      </header>

      <div className="space-y-4 text-slate-100">
        <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
            Rama
          </p>
          <strong className="text-base text-white">{jobProfile.branch.name}</strong>
          <p className="mt-1 text-sm text-slate-300">{jobProfile.branch.description}</p>
        </section>

        <section className="rounded-lg bg-black/20 p-3 ring-1 ring-white/10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
            Puesto
          </p>
          <strong className="text-base text-white">{jobProfile.jobPosition.name}</strong>
          <p className="mt-1 text-sm text-slate-300">{jobProfile.jobPosition.description}</p>
        </section>

        {jobProfile.estimatedHourlyRate !== undefined && (
          <p className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
            Tarifa estimada: {jobProfile.estimatedHourlyRate} EUR/hora
          </p>
        )}
      </div>
    </article>
  );
};

export default JobProfileCard;
