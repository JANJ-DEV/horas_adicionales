import Brand from "@/components/Brand";
import CurrentUser from "@/components/CurrentUser";
import DesktopViewOnly from "@/components/DesktopViewOnly";
import MobileViewOnly from "@/components/MobileViewOnly";
import Menu from "@/components/Menu";
import MenuBars from "@/components/MenuBars";
import ThemeToggle from "@/components/ThemeToggle";

const MainHeader = () => {
  return (
    <header className="sticky top-0 px-4 pt-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-6 z-100">
      <section className=" app-surface relative z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <section className="flex items-center gap-2">
          <MenuBars />
          <DesktopViewOnly tag="section" className="items-center" display="flex">
            <Brand variant="large" />
          </DesktopViewOnly>
        </section>
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="pointer-events-auto">
            <Menu />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center lg:hidden">
          <Menu />
        </div>
        <section className="flex items-center gap-2">
          <DesktopViewOnly tag="section" className="items-center" display="flex">
            <ThemeToggle />
          </DesktopViewOnly>
          <MobileViewOnly tag="section" className="items-center" display="flex">
            <ThemeToggle />
          </MobileViewOnly>
          <CurrentUser />
        </section>
      </section>
    </header>
  );
};

export default MainHeader;
