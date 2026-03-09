import useAuth from "@/context/hooks/auth.hook";
import { Navigate, NavLink, Outlet } from "react-router";
import MainContent from "../layouts/MainContent";
import MainHeader from "../layouts/MainHeader";
import GoBack from "@/components/GoBack";
import { ToastContainer } from "react-toastify";
import UtilitiesProvider from "@/context/providers/UtilitiesProvider";

const RecordsLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <UtilitiesProvider>
      <MainHeader />
      <MainContent>
        <nav className="flex gap-4 mt-8 sticky top-28 justify-between lg:justify-start bg-black p-4 rounded">
          <GoBack />
          <NavLink
            to="/records/add"
            className={({ isActive }) => {
              return `py-2 px-4 border rounded-sm ${isActive ? "text-green-500" : "text-white"}`;
            }}
          >
            Registrar Hora
          </NavLink>
        </nav>
        <section className="flex flex-col gap-4 mt-4">
          <Outlet />
        </section>
        <ToastContainer
          containerId="records"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </MainContent>
    </UtilitiesProvider>
  );
};

export default RecordsLayout;
