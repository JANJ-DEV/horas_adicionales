import CurrentUser from "@/components/CurrentUser";
import Menu from "@/components/Menu";
import MenuBars from "@/components/MenuBars";

const MainHeader = () => {

  return (
     <header className="relative flex gap-4 p-4 justify-between items-center">
      <Menu />
      <MenuBars />
      <CurrentUser />
    </header>
  )
}

export default MainHeader;