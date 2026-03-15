import useAuth from "@/context/hooks/auth.hook";
import { Navigate, NavLink, Outlet } from "react-router";
import MainContent from "../layouts/MainContent";
import MainHeader from "../layouts/MainHeader";
import GoBack from "@/components/GoBack";
import UtilitiesProvider from "@/context/providers/UtilitiesProvider";
import AppToastContainer from "@/components/AppToastContainer";
import Loading from "@/components/Loading";

const RecordsLayout = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();

  if (!isAuthResolved) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <UtilitiesProvider>
      <section className="flex min-h-[100dvh] flex-col pb-6">
        <MainHeader />
        <MainContent>
          <nav className="app-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <GoBack />
            <NavLink
              to="/records/add"
              className={({ isActive }) => {
                return `inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                  isActive
                    ? "bg-[var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)]"
                    : "border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                }`;
              }}
            >
              Registrar hora
            </NavLink>
          </nav>
          <section className="flex flex-col gap-4">
            <Outlet />
          </section>
          <AppToastContainer
            containerId="records"
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
          />
        </MainContent>
      </section>
    </UtilitiesProvider>
  );
};

export default RecordsLayout;
