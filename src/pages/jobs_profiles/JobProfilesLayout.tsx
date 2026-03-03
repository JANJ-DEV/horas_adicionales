import useAuth from "@/context/hooks/auth.hook";
import { Navigate, NavLink, Outlet } from "react-router";
import MainContent from "../layouts/MainContent";
import MainHeader from "../layouts/MainHeader";
import GoBack from "@/components/GoBack";

const JobProfilesLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
    <MainHeader />
    <MainContent>
      <nav className="flex gap-4">
       <GoBack />
        <NavLink to="/job-profiles/add" className={({ isActive }) => {
            return `py-2 px-4 border rounded-sm ${isActive ? "text-green-500" : "text-white"}`;
          }}>
          Añadir perfil
        </NavLink>
      </nav>
      <section className="flex flex-col gap-4 mt-4">
        <Outlet />
      </section>
  
    </MainContent>
    </>
  )
}

export default JobProfilesLayout;
