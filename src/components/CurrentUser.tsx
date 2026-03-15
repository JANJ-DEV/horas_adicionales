import useAuth from "@/context/hooks/auth.hook";
import { type FC, useEffect } from "react";
import { FaRegUserCircle, FaSignOutAlt, FaTimesCircle } from "react-icons/fa";
import Loading from "./Loading";
import { NavLink } from "react-router";
import useGlobal from "@/context/hooks/useGlobal.hook";

const CurrentUser: FC = () => {
  const { menuCurrentUser, menuBars } = useGlobal();
  const { isMenuCurrentUserOpen, toggleMenuCurrentUser, closeMenuCurrentUser } = menuCurrentUser;
  const { currentUser, signInWithGoogle, signOutGoogle, isLoading, isAuthenticated, isCancelling } =
    useAuth();
  const { closeMenuBars } = menuBars;

  useEffect(() => {
    const handlerCloseMenuCurrentUser = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("article")) {
        closeMenuCurrentUser();
      }
    };
    document.addEventListener("click", handlerCloseMenuCurrentUser);
    return () => {
      document.removeEventListener("click", handlerCloseMenuCurrentUser);
    };
  }, [closeMenuCurrentUser]);

  useEffect(() => {
    closeMenuCurrentUser();
  }, [isAuthenticated, closeMenuCurrentUser]);

  if (isLoading) return <Loading variant="auth" size={22} />;

  if (isCancelling)
    return (
      <button
        disabled
        aria-label="Cancelando inicio de sesión"
        title="Cancelando..."
        className="flex cursor-default animate-pulse items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[var(--text-muted)]"
      >
        <FaTimesCircle size={16} />
        <span className="hidden text-xs sm:inline">Cancelando...</span>
      </button>
    );

  if (isAuthenticated && currentUser) {
    return (
      <article className="relative flex flex-col">
        {/* Trigger: avatar + nombre en lg+ */}
        <button
          type="button"
          aria-label="Abrir menú de usuario"
          aria-expanded={isMenuCurrentUserOpen}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenuCurrentUser();
            closeMenuBars();
          }}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] p-1 pr-3 text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Foto de perfil"
              className={`h-8 w-8 rounded-full border-2 ${currentUser.emailVerified ? "border-[var(--accent)]" : "border-[var(--danger)]"}`}
            />
          ) : (
            <FaRegUserCircle size={28} className="text-[var(--text-muted)]" />
          )}
          <span className="hidden max-w-[8rem] truncate text-xs font-semibold text-[var(--text)] lg:inline">
            {currentUser.displayName ?? currentUser.email}
          </span>
          <span className="text-xs font-semibold text-[var(--text)] sm:inline lg:hidden">
            {(currentUser.displayName ?? currentUser.email ?? "")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0].toUpperCase())
              .join("")}
          </span>
        </button>

        {/* Dropdown */}
        {isMenuCurrentUserOpen && (
          <section className="absolute right-0 top-full z-20 mt-3 min-w-[14rem] rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] py-2 shadow-[0_4px_12px_rgba(11,18,32,0.15)] backdrop-blur-md">
            {/* Cabecera del menú */}
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                Conectado como
              </p>
              <p className="truncate pt-1 text-sm font-semibold text-[var(--text)]">
                {currentUser.displayName ?? currentUser.email}
              </p>
            </div>
            <nav className="flex flex-col py-1">
              <NavLink
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenuCurrentUser();
                  closeMenuBars();
                }}
                to="/account"
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--bg-soft)] ${isActive ? "text-[var(--accent)]" : "text-[var(--text)]"}`
                }
              >
                Mi cuenta
              </NavLink>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  signOutGoogle();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--bg-soft)]"
              >
                <FaSignOutAlt size={14} />
                Cerrar sesión
              </button>
            </nav>
          </section>
        )}
      </article>
    );
  }

  return (
    <button
      type="button"
      aria-label="Iniciar sesión con Google"
      onClick={(e) => {
        e.stopPropagation();
        signInWithGoogle();
      }}
      className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
    >
      <FaRegUserCircle size={18} />
      <span className="hidden text-xs font-semibold sm:inline">Iniciar sesión</span>
    </button>
  );
};

export default CurrentUser;
