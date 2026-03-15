import Brand from "@/components/Brand";
import CurrentUser from "@/components/CurrentUser";
import DesktopViewOnly from "@/components/DesktopViewOnly";
import Menu from "@/components/Menu";
import MenuBars from "@/components/MenuBars";
import ThemeToggle from "@/components/ThemeToggle";

const MainHeader = () => {
  return (
    <header className="px-4 pt-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-6">
      <section className="app-surface relative z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <DesktopViewOnly tag="section" className="items-center" display="flex">
          <Brand variant="large" />
        </DesktopViewOnly>
        <div className="flex min-w-0 flex-1 items-center justify-center lg:justify-start">
          <Menu />
        </div>
        <DesktopViewOnly tag="section" className="items-center gap-3" display="flex">
          <ThemeToggle />
        </DesktopViewOnly>
        <section className="flex items-center gap-2">
          <MenuBars />
          <CurrentUser />
        </section>
      </section>
    </header>
  );
};

export default MainHeader;
