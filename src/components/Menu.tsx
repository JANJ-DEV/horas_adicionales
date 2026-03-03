import useAuth from "@/context/hooks/auth.hook";
import useGlobal from "@/context/hooks/useGlobal.hook";
import { type FC } from "react";
import { NavLink } from "react-router";

const Menu: FC = () => {
  const { isAuthenticated } = useAuth();
  const {menuBars, menuCurrentUser} = useGlobal();
  const { closeMenuBars} = menuBars;
  const {closeMenuCurrentUser} = menuCurrentUser;
  const handlerCloseAllMenus = () => {
    closeMenuBars();
    closeMenuCurrentUser();
  }
  return (
    <nav className="hidden md:flex gap-4 items-center">
      <NavLink onClick={handlerCloseAllMenus} to="/" className={({ isActive }) => `text-sm font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Inicio</NavLink>
      {isAuthenticated &&
        <>
          <NavLink onClick={handlerCloseAllMenus} to="/records" className={({ isActive }) => `text-sm font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Registros</NavLink>
          <NavLink onClick={handlerCloseAllMenus} to="/job-profiles" className={({ isActive }) => `text-sm font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Perfiles de Trabajo</NavLink>
        </>
      }
    </nav>
  )
};

export default Menu;