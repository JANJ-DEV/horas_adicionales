import useAuth from "@/context/hooks/auth.hook";
import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainContent from "./MainContent";

const PrivateLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <MainHeader />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
};

export default PrivateLayout;
