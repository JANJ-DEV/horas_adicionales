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
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-500 text-[10px] font-bold leading-none text-slate-200 transition hover:border-slate-300 hover:text-white"
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
          className="absolute bottom-full left-1/2 z-20 mb-2 w-[min(18rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-md border border-slate-600 bg-slate-950 p-3 text-xs text-slate-200 shadow-xl sm:w-72"
        >
          {content}
        </section>
      )}
    </div>
  );
};

export default InfoTooltip;
