import { type FC } from "react";
import { useNavigate } from "react-router";

const GoBack: FC = () => {
  const goBack = useNavigate();
  return (
    <button
      type="button"
      onClick={() => goBack(-1)}
      className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
    >
      Volver
    </button>
  );
};

export default GoBack;
