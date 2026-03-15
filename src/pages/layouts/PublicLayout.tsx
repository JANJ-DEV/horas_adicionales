import type { FC } from "react";
import { Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";

const Publiclayout: FC = () => {
  return (
    <section className="flex min-h-[100dvh] flex-col pb-6">
      <MainHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </section>
  );
};

export default Publiclayout;
