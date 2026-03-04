import { type FC } from "react";
import DesktopViewOnly from "./DesktopViewOnly";
import MainMenu from "./MainMenu";

const Menu: FC = () => {
  return (
    <DesktopViewOnly tag="nav" className="gap-4 items-center">
      <MainMenu variant="desktop" />
    </DesktopViewOnly>
  );
};

export default Menu;
