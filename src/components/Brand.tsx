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
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#ff6b35]/30 bg-gradient-to-br from-[#ff6b35] via-[#ff8c42] to-[#0077b6] shadow-[0_2px_8px_rgba(255,107,53,0.25)] ${isSmall ? "h-11 w-11" : "h-16 w-16"}`}
      >
        <svg
          viewBox="0 0 64 64"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="12" width="56" height="40" rx="4" fill="#1a1a1a" />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="22"
            fontWeight="800"
            fill="white"
          >
            JDNJ
          </text>
          <circle cx="12" cy="12" r="4" fill="#ff6b35" />
          <circle cx="52" cy="12" r="4" fill="#00b4d8" />
        </svg>
      </div>

      {variant !== "small" && (
        <div className={`min-w-0 ${isFull ? "flex-1" : ""}`}>
          <p className="truncate font-[var(--font-display)] text-lg font-bold leading-none text-[var(--text)] sm:text-xl">
            JDNJ
          </p>
          <p className="truncate pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Desarrollador Freelance
          </p>
        </div>
      )}
    </div>
  );
};

export default Brand;
