import { NavLink } from "react-router"
import { LuSquareMenu } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";
import useGlobal from "@/context/hooks/useGlobal.hook";
import useAuth from "@/context/hooks/auth.hook";

const MenuBars = () => {
  const {isAuthenticated} = useAuth();
  const {menuBars, menuCurrentUser} = useGlobal();
  const {isMenuBarsOpen, toggleMenuBars} = menuBars;
  const {closeMenuCurrentUser} = menuCurrentUser;

  return (
    <section className="md:hidden text-xl">
      <LuSquareMenu size={38} onClick={( )=> {
        toggleMenuBars();
        closeMenuCurrentUser();
      }}/>
      <nav className={`${isMenuBarsOpen ? "flex flex-col fixed top-0 left-0 min-w-screen min-h-dvh bg-black gap-4 px-4 z-50" : "hidden"} `}>
        <CgCloseR size={38} onClick={toggleMenuBars} className="self-end mt-4" />
        <NavLink onClick={toggleMenuBars} to="/" className={({ isActive }) => `font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Inicio</NavLink>
        {isAuthenticated &&
          <>
            <NavLink onClick={toggleMenuBars} to="/records" className={({ isActive }) => ` font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Registros</NavLink>
            <NavLink onClick={toggleMenuBars} to="/job-profiles" className={({ isActive }) => `font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Perfiles de Trabajo</NavLink>
          </>
        }
      </nav>
    </section>
  )
}

export default MenuBars