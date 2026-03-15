import type { FC } from "react";

type Props = {
  variant?: "small" | "large" | "full";
};

const Brand: FC<Props> = ({ variant = "large" }) => {
  const isSmall = variant === "small";
  const isFull = variant === "full";

  return (
    <div className={`inline-flex items-center gap-3 ${isFull ? "w-full" : "w-auto"}`}>
      <div
        aria-hidden="true"
        className={`relative overflow-hidden rounded-[1.4rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,var(--accent),var(--accentStrong))] shadow-[0_2px_8px_rgba(34,71,128,0.15)] ${isSmall ? "h-11 w-11" : "h-16 w-16"}`}
      >
        <svg
          viewBox="0 0 64 64"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 44L27 18L36 33L42 23L50 44"
            stroke="white"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="18" r="3.5" fill="white" />
          <circle cx="50" cy="44" r="3.5" fill="white" />
        </svg>
        <div className="absolute inset-x-3 top-2 h-5 rounded-full bg-white/18 blur-md" />
      </div>

      {variant !== "small" && (
        <div className={`min-w-0 ${isFull ? "flex-1" : ""}`}>
          <p className="truncate font-[var(--font-display)] text-lg font-bold leading-none text-[var(--text)] sm:text-xl">
            Horas Adicionales
          </p>
          <p className="truncate pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Control laboral inteligente
          </p>
        </div>
      )}
    </div>
  );
};

export default Brand;
