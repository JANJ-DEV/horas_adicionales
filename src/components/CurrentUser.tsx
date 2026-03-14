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
        className="flex cursor-default animate-pulse items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-400"
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
          className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 p-0.5 pr-2.5 transition hover:border-slate-500 hover:bg-slate-700/60"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Foto de perfil"
              className={`h-7 w-7 rounded-full border-2 ${currentUser.emailVerified ? "border-cyan-500" : "border-red-500"}`}
            />
          ) : (
            <FaRegUserCircle size={28} className="text-slate-400" />
          )}
          <span className="hidden max-w-[8rem] truncate text-xs font-medium text-slate-200 lg:inline">
            {currentUser.displayName ?? currentUser.email}
          </span>
        </button>

        {/* Dropdown */}
        {isMenuCurrentUserOpen && (
          <section className="absolute right-0 top-full z-20 mt-2 min-w-max rounded-xl border border-slate-700 bg-slate-900 py-2 shadow-xl">
            {/* Cabecera del menú */}
            <div className="border-b border-slate-700 px-4 py-2">
              <p className="text-xs text-slate-400">Conectado como</p>
              <p className="truncate text-sm font-semibold text-cyan-300">
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
                  `px-4 py-2 text-sm transition hover:bg-slate-800 ${isActive ? "text-cyan-400" : "text-slate-200"}`
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
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 transition hover:bg-slate-800"
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
      className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-300 transition hover:border-cyan-600 hover:bg-slate-700/60 hover:text-cyan-300"
    >
      <FaRegUserCircle size={18} />
      <span className="hidden text-xs font-medium sm:inline">Iniciar sesión</span>
    </button>
  );
};

export default CurrentUser;
