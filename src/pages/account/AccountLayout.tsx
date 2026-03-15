import useAuth from "@/context/hooks/auth.hook";
import type { FC } from "react";
import { Navigate, NavLink, Outlet } from "react-router";
import MainHeader from "../layouts/MainHeader";
import MainContent from "../layouts/MainContent";
import GoBack from "@/components/GoBack";

const AccountLayout: FC = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();

  if (!isAuthResolved) {
    return (
      <section className="flex min-h-[100dvh] flex-col">
        <MainHeader />
        <section className="flex min-h-0 flex-1 flex-col">
          <MainContent>
            <section className="flex min-h-[calc(100dvh-6.5rem)] flex-col items-center justify-center">
              <div role="status" className="text-sm text-[var(--text-muted)]">
                Cargando tu cuenta...
              </div>
            </section>
          </MainContent>
        </section>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="flex min-h-[100dvh] flex-col">
      <MainHeader />
      <section className="flex min-h-0 flex-1 flex-col">
        <MainContent>
          <section className="flex min-h-[calc(100dvh-6.5rem)] flex-col">
            <nav className="app-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <GoBack />
              <NavLink
                to="/account/update"
                className={({ isActive }) => {
                  return `inline-flex items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)]"
                      : "border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                  }`;
                }}
              >
                Actualizar cuenta
              </NavLink>
            </nav>
            <section className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
              <Outlet /> {/* Aquí se renderizarán las rutas hijas como Update Account */}
            </section>
          </section>
        </MainContent>
      </section>
    </section>
  );
};

export default AccountLayout;
