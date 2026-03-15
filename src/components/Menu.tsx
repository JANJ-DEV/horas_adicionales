import { type FC } from "react";
import DesktopViewOnly from "./DesktopViewOnly";
import MainMenu from "./MainMenu";

const Menu: FC = () => {
  return (
    <DesktopViewOnly tag="nav" className="items-center gap-3">
      <MainMenu variant="desktop" />
    </DesktopViewOnly>
  );
};

export default Menu;
