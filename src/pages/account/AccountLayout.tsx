import useAuth from "@/context/hooks/auth.hook";
import type { FC } from "react";
import { Navigate, NavLink, Outlet } from "react-router";
import MainHeader from "../layouts/MainHeader";
import MainContent from "../layouts/MainContent";
import GoBack from "@/components/GoBack";

const AccountLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="flex min-h-[100dvh] flex-col">
      <MainHeader />
      <section className="flex min-h-0 flex-1 flex-col">
        <MainContent>
          <section className="flex min-h-[calc(100dvh-6.5rem)] flex-col">
            <nav className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
              <GoBack />
              <NavLink
                to="/account/update"
                className={({ isActive }) => {
                  return `rounded-lg border px-4 py-2 text-center text-sm font-semibold transition ${
                    isActive
                      ? "border-cyan-400/70 bg-cyan-500/20 text-cyan-100"
                      : "border-slate-500/60 bg-slate-800/45 text-slate-200 hover:border-cyan-400/70 hover:text-cyan-100"
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
