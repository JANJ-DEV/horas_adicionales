import { useState, type FC, type ReactNode } from "react";

interface InfoTooltipProps {
  content: ReactNode;
  ariaLabel: string;
  className?: string;
}

const InfoTooltip: FC<InfoTooltipProps> = ({ content, ariaLabel, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[10px] font-bold leading-none text-[var(--text)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => setIsOpen(false)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        i
      </button>

      {isOpen && (
        <section
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-[min(18rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-xs text-[var(--text)] shadow-[0_4px_12px_rgba(11,18,32,0.15)] sm:w-72"
        >
          {content}
        </section>
      )}
    </div>
  );
};

export default InfoTooltip;
