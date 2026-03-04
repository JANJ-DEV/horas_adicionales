import useAuth from "@/context/hooks/auth.hook";
import useGlobal from "@/context/hooks/useGlobal.hook";
import { useEffect } from "react";
import { NavLink } from "react-router";

type MainMenuProps = {
  variant?: "mobile" | "desktop";
}

const MainMenu = ({ variant }: MainMenuProps) => {
  const { isAuthenticated } = useAuth();
  const { menuBars } = useGlobal();
  const { closeMenuBars } = menuBars;

  useEffect(()=> {
    const handlerCloseMenuBars = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        closeMenuBars();
      }
    }
    document.addEventListener("click", handlerCloseMenuBars);
    return () => {
      document.removeEventListener("click", handlerCloseMenuBars);
    }
  }, [closeMenuBars])

  return (
    <nav className={`flex ${variant === "mobile" ? "flex-col gap-4 px-4 text-lg" : "flex-row gap-4 text-xl"} `}>
      <NavLink onClick={closeMenuBars} to="/" className={({ isActive }) => `font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Inicio</NavLink>
      {isAuthenticated &&
        <>
          <NavLink onClick={closeMenuBars} to="/records" className={({ isActive }) => ` font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Registros</NavLink>
          <NavLink onClick={closeMenuBars} to="/job-profiles" className={({ isActive }) => `font-bold ${isActive ? "text-green-500" : "text-gray-500"}`}>Perfiles de Trabajo</NavLink>
        </>
      }
    </nav>
  )
}

export default MainMenu;