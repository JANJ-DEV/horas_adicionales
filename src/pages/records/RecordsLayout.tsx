import { NavLink, Outlet } from "react-router";
import GoBack from "@/components/GoBack";
import AppToastContainer from "@/components/AppToastContainer";

const RecordsLayout = () => {
  return (
    <>
      <nav className="app-surface flex items-center justify-end gap-2 p-3 sm:gap-3 sm:p-4">
        <GoBack />
        <NavLink
          to="/records/add"
          className={({ isActive }) => {
            return `inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-300 ${
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
      <AppToastContainer containerId="records" position="top-center" hideProgressBar={false} />
    </>
  );
};

export default RecordsLayout;
