import Brand from "@/components/Brand";
import CurrentUser from "@/components/CurrentUser";
import DesktopViewOnly from "@/components/DesktopViewOnly";
import Menu from "@/components/Menu";
import MenuBars from "@/components/MenuBars";
import styles from "@/assets/css/index.module.css";

const MainHeader = () => {
  return (
    <header
      className={`sticky z-100 top-0 bg-dark flex gap-4 p-4 justify-between items-center ${styles.borderBottomShadow}`}
    >
      <DesktopViewOnly tag="section" className="-ml-4">
        <Brand variant="small" />
      </DesktopViewOnly>
      <Menu />
      <MenuBars />
      <CurrentUser />
    </header>
  );
};

export default MainHeader;
