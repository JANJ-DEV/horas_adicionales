import useAuth from "@/context/hooks/auth.hook";
import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";
import Footer from "@/components/Footer";
import UtilitiesProvider from "@/context/providers/UtilitiesProvider";
import Loading from "@/components/Loading";

const PrivateLayout: FC = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();

  if (!isAuthResolved) {
    return <Loading />;
  }

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
        <Footer />
      </section>
    </UtilitiesProvider>
  );
};

export default PrivateLayout;
