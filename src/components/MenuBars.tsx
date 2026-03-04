import { LuSquareMenu } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";
import useGlobal from "@/context/hooks/useGlobal.hook";
import Brand from "./Brand";
import MobileViewOnly from "./MobileViewOnly";
import MainMenu from "./MainMenu";

const MenuBars = () => {
  const { menuBars, menuCurrentUser } = useGlobal();
  const { isMenuBarsOpen, toggleMenuBars } = menuBars;
  const { closeMenuCurrentUser } = menuCurrentUser;

  return (
    <MobileViewOnly tag="section">
      <LuSquareMenu size={38} onClick={(e) => {
        e.stopPropagation();
        toggleMenuBars();
        closeMenuCurrentUser();
      }} />
      <nav className={`${isMenuBarsOpen ? "flex flex-col fixed top-0 left-0 min-w-screen min-h-dvh bg-black gap-4 z-50" : "hidden"} `}>
        <aside className="flex justify-between items-center pr-4">
          <Brand variant="small" />
          <CgCloseR size={38} onClick={(e) => {
            e.stopPropagation();
            toggleMenuBars();
          }} />
        </aside>
        <MainMenu variant="mobile" />
      </nav>
    </MobileViewOnly>
  )
}

export default MenuBars