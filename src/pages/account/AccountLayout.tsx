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
    <>
      <MainHeader />
      <MainContent>
        <nav className="flex gap-4 mt-8">
          <GoBack />
          <NavLink to="/account/update" className={({ isActive }) => {
            return `py-2 px-4 border rounded-sm ${isActive ? "text-green-500" : "text-white"}`;
          }}>Actualizar cuenta</NavLink>
        </nav>
         <section className="flex flex-col gap-4 mt-4">
          <Outlet /> {/* Aquí se renderizarán las rutas hijas como Update Account */}
        </section>
      </MainContent>
    </>
  );
}

export default AccountLayout;
