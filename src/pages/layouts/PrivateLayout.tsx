import useAuth from "@/context/hooks/auth.hook";
import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";
import UtilitiesProvider from "@/context/providers/UtilitiesProvider";

const PrivateLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <UtilitiesProvider>
      <section className="flex min-h-[100dvh] flex-col pb-6">
        <MainHeader />
        <MainContent>
          <Outlet />
        </MainContent>
      </section>
    </UtilitiesProvider>
  );
};

export default PrivateLayout;
