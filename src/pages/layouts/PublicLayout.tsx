import type { FC } from "react";
import { Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";

const Publiclayout: FC = () => {
  return (
    <>
      <MainHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

export default Publiclayout;
