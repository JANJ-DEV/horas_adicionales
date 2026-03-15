import useGlobal from "@/context/hooks/useGlobal.hook";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const {
    theme: { currentTheme, toggleTheme },
  } = useGlobal();

  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] shadow-[0_1px_3px_rgba(11,18,32,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
    >
      {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
    </button>
  );
};

export default ThemeToggle;
