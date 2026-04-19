import { LuSquareMenu } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";
import { useEffect } from "react";
import useGlobal from "@/context/hooks/useGlobal.hook";
import Brand from "./Brand";
import MobileViewOnly from "./MobileViewOnly";
import MainMenu from "./MainMenu";

const MenuBars = () => {
  const { menuBars, menuCurrentUser } = useGlobal();
  const { isMenuBarsOpen, toggleMenuBars } = menuBars;
  const { closeMenuCurrentUser } = menuCurrentUser;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    if (isMenuBarsOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isMenuBarsOpen]);

  return (
    <MobileViewOnly tag="section" className="items-center gap-2" display="flex">
      <button
        type="button"
        aria-label="Abrir menu principal"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
        onClick={(e) => {
          e.stopPropagation();
          toggleMenuBars();
          closeMenuCurrentUser();
        }}
      >
        <LuSquareMenu size={22} />
      </button>
      <nav
        className={`${isMenuBarsOpen ? "fixed inset-0 z-[200] flex min-h-dvh min-w-full flex-col app-surface app-surface-flat rounded-none border-0 px-4 py-5" : "hidden"}`}
      >
        <aside className="flex items-center justify-between gap-3">
          <Brand variant="large" />
          <button
            type="button"
            aria-label="Cerrar menu principal"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:text-[var(--danger)]"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenuBars();
            }}
          >
            <CgCloseR size={22} />
          </button>
        </aside>
        <aside className="mt-8 rounded-none p-4">
          <p className="section-kicker">Navegacion</p>
          <div className="mt-4">
            <MainMenu variant="mobile" />
          </div>
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            Gestiona tus registros, perfiles y cuenta desde una interfaz adaptada a movil.
          </p>
        </aside>
      </nav>
    </MobileViewOnly>
  );
};

export default MenuBars;
