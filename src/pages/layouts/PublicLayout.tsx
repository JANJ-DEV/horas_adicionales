import type { FC } from "react";
import { Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";
import Footer from "@/components/Footer";

const Publiclayout: FC = () => {
  return (
    <section className="flex min-h-[100dvh] flex-col pb-6">
      <MainHeader />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </section>
  );
};

export default Publiclayout;
