import useAuth from "@/context/hooks/auth.hook";
import { type FC, useEffect } from "react";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import Loading from "./Loading";
import { NavLink } from "react-router";
import useGlobal from "@/context/hooks/useGlobal.hook";

const CurrentUser: FC = () => {
  const { menuCurrentUser, menuBars } = useGlobal();
  const { isMenuCurrentUserOpen, toggleMenuCurrentUser, closeMenuCurrentUser } = menuCurrentUser;
  const { currentUser, signInWithGoogle, signOutGoogle, isLoading, isAuthenticated } = useAuth();
  const { closeMenuBars } = menuBars;

  useEffect(() => {
    const handlerCloseMenuCurrentUser = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("article")) {
        closeMenuCurrentUser();
      }
    }
    document.addEventListener("click", handlerCloseMenuCurrentUser);
    return () => {
      document.removeEventListener("click", handlerCloseMenuCurrentUser);
    }
  }, [closeMenuCurrentUser])

  useEffect(() => {
    closeMenuCurrentUser();
  }, [isAuthenticated, closeMenuCurrentUser])

  if (isLoading) return <Loading variant="auth" />

  return isAuthenticated && currentUser ?
    <article className="flex flex-col group relative text-xl">
      <header className="flex">
        <img onClick={(e) => {
          e.stopPropagation();
          toggleMenuCurrentUser();
          closeMenuBars();
        }} src={currentUser.photoURL || ""} alt="User profile" className={`w-10 h-10 rounded-full border-2 ${currentUser.emailVerified ? "border-green-500" : "border-red-500"}`} />
      </header>
      <section className={`absolute -z-50 top-full right-0 flex flex-col pt-12 ${isMenuCurrentUserOpen ? "flex min-w-max" : "hidden"}`}>
        <article className="flex flex-col gap-2 bg-dark border border-light/20 rounded-md py-4">
          <aside className="px-4 mt-2"><span className="text-green-300 font-bold">{currentUser.displayName}</span></aside>
          <section className="flex flex-col gap-2 my-2 cursor-pointer">
            <nav className="px-4">
              <NavLink onClick={(e) => {
                e.stopPropagation();
                toggleMenuCurrentUser();
                closeMenuBars();
              }} to="/account" className={({ isActive }) => isActive ? "text-green-500" : "text-white"}>Mi cuenta</NavLink>
            </nav>
            <footer className="flex justify-between gap-2 items-center px-4">
              <span onClick={(e) => {
                e.stopPropagation();
                signOutGoogle();
              }}>Salir</span> <FaSignOutAlt size={20} className="text-red-300" onClick={(e) => {
                e.stopPropagation();
                signOutGoogle();
              }} />
            </footer>
          </section>
        </article>
      </section>
    </article>
    : <FaRegUserCircle size={40} className="text-blue-500" onClick={(e) => {
      e.stopPropagation();
      signInWithGoogle();
    }} />

};

export default CurrentUser;
