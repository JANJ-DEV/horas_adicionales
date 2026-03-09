import useAuth from "@/context/hooks/auth.hook";
import { Navigate, NavLink, Outlet } from "react-router";
import MainContent from "../layouts/MainContent";
import MainHeader from "../layouts/MainHeader";
import GoBack from "@/components/GoBack";
import BranchesProvider from "@/context/providers/BranchesProvider";
import { ToastContainer } from "react-toastify";

const JobProfilesLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <BranchesProvider>
      <MainHeader />
      <MainContent>
        <nav className="flex justify-between gap-4 mt-4">
          <GoBack />
          <NavLink
            to="/jobs-profiles/add"
            className={({ isActive }) => {
              return `py-2 px-4 border rounded-sm ${isActive ? "text-green-500" : "text-white"}`;
            }}
          >
            Añadir perfil
          </NavLink>
        </nav>
        <section className="flex flex-col gap-4 mt-4">
          <Outlet />
        </section>
      </MainContent>
      <ToastContainer
        containerId="jobs-profiles"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </BranchesProvider>
  );
};

export default JobProfilesLayout;
