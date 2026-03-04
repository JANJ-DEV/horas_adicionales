import Brand from "@/components/Brand";
import CurrentUser from "@/components/CurrentUser";
import DesktopViewOnly from "@/components/DesktopViewOnly";
import Menu from "@/components/Menu";
import MenuBars from "@/components/MenuBars";

const MainHeader = () => {
  return (
    <header className="sticky top-0 bg-overlay-50 flex gap-4 p-4 justify-between items-center">
      <DesktopViewOnly tag="section">
        <Brand />
      </DesktopViewOnly>
      <Menu />
      <MenuBars />
      <CurrentUser />
    </header>
  );
};

export default MainHeader;
