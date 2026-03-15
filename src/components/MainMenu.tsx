import useAuth from "@/context/hooks/auth.hook";
import useGlobal from "@/context/hooks/useGlobal.hook";
import { useEffect } from "react";
import { NavLink } from "react-router";

type MainMenuProps = {
  variant?: "mobile" | "desktop";
};

const MainMenu = ({ variant }: MainMenuProps) => {
  const { isAuthenticated } = useAuth();
  const { menuBars } = useGlobal();
  const { closeMenuBars } = menuBars;

  const baseLinkClass =
    "rounded-full px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5";

  useEffect(() => {
    const handlerCloseMenuBars = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        closeMenuBars();
      }
    };
    document.addEventListener("click", handlerCloseMenuBars);
    return () => {
      document.removeEventListener("click", handlerCloseMenuBars);
    };
  }, [closeMenuBars]);

  return (
    <nav
      className={`flex ${variant === "mobile" ? "flex-col gap-2 px-1 text-base" : "flex-row items-center gap-2"}`}
    >
      {isAuthenticated && (
        <>
          <NavLink
            onClick={closeMenuBars}
            to="/records"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? "bg-[color:var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`
            }
          >
            Registros
          </NavLink>
          <NavLink
            onClick={closeMenuBars}
            to="/jobs-profiles"
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? "bg-[color:var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
              }`
            }
          >
            Perfiles de Trabajo
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default MainMenu;
