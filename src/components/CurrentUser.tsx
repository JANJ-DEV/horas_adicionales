import useAuth from "@/context/hooks/auth.hook";
import { type FC } from "react";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import Loading from "./Loading";
import { NavLink } from "react-router";
import useGlobal from "@/context/hooks/useGlobal.hook";

const CurrentUser: FC = () => {
  const {menuCurrentUser, menuBars} = useGlobal();
  const {isMenuCurrentUserOpen, toggleMenuCurrentUser} = menuCurrentUser;
  const { currentUser, signInWithGoogle, signOutGoogle, isLoading, isAuthenticated } = useAuth();
  const {closeMenuBars} = menuBars;
  if (isLoading) return <Loading />
  return isAuthenticated && currentUser ?
    <article className="flex flex-col group relative">
      <header className="flex">
        <img onClick={() => {
          toggleMenuCurrentUser();
          closeMenuBars();
        }} src={currentUser.photoURL || ""} alt="User profile" className={`w-10 h-10 rounded-full border-2 ${currentUser.emailVerified ? "border-green-500" : "border-red-500"}`} />
      </header>
      <section className={`absolute top-full right-0 flex flex-col pt-6  ${isMenuCurrentUserOpen ? "flex min-w-max" : "hidden"}`}>
        <article className="flex flex-col bg-black border-2 border-green-100">
          <aside className="px-4 mt-2"><span className="text-sm text-orange-300 font-bold">{currentUser.displayName}</span></aside>
          <section className="flex flex-col gap-2 my-2 cursor-pointer">
            <nav className="px-4">
              <NavLink onClick={() => {
                toggleMenuCurrentUser();
                closeMenuBars();
              }} to="/account" className={({ isActive }) => isActive ? "text-green-500" : "text-white"}>Mi cuenta</NavLink>
            </nav>
            <footer className="flex gap-2 items-center px-4">
              <span>Salir</span> <FaSignOutAlt size={20} className="text-red-500" onClick={signOutGoogle} />
            </footer>
          </section>
        </article>
      </section>
    </article>
    : <FaRegUserCircle size={40} className="text-blue-500" onClick={signInWithGoogle} />

};

export default CurrentUser;
