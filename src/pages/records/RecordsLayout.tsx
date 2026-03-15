import useAuth from "@/context/hooks/auth.hook";
import { Navigate, NavLink, Outlet } from "react-router";
import MainContent from "../layouts/MainContent";
import MainHeader from "../layouts/MainHeader";
import GoBack from "@/components/GoBack";
import UtilitiesProvider from "@/context/providers/UtilitiesProvider";
import AppToastContainer from "@/components/AppToastContainer";

const RecordsLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <UtilitiesProvider>
      <MainHeader />
      <MainContent>
        <nav className="flex justify-between gap-4 mt-4">
          <GoBack />
          <NavLink
            to="/records/add"
            className={({ isActive }) => {
              return `self-start py-2 px-4 border rounded-sm ${isActive ? "text-green-500" : "text-white"}`;
            }}
          >
            Registrar Hora
          </NavLink>
        </nav>
        <section className="flex flex-col gap-4 mt-4">
          <Outlet />
        </section>
        <AppToastContainer
          containerId="records"
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
        />
      </MainContent>
    </UtilitiesProvider>
  );
};

export default RecordsLayout;
