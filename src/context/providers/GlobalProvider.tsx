import type { Children } from "@/types";
import { useEffect, useState, type FC } from "react";
import GlobalCtx from "../GlobalCtx";
import type { ThemeMode } from "../GlobalCtx";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem("theme-mode");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  return "dark";
};

const GlobalProvider: FC<Children> = ({ children }) => {
  const [isMenuBarsOpen, setIsMenuBarsOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuCurrentUserOpen, setIsMenuCurrentUserOpen] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getInitialTheme);

  const toggleMenuBars = () => setIsMenuBarsOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleMenuCurrentUser = () => setIsMenuCurrentUserOpen((prev) => !prev);

  const closeMenuBars = () => setIsMenuBarsOpen(false);
  const closeMenu = () => setIsMenuOpen(false);
  const closeMenuCurrentUser = () => setIsMenuCurrentUserOpen(false);
  const openMenuBars = () => setIsMenuBarsOpen(true);
  const openMenu = () => setIsMenuOpen(true);
  const openMenuCurrentUser = () => setIsMenuCurrentUserOpen(true);
  const setTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme-mode", theme);
    }
  };
  const toggleTheme = () => setTheme(currentTheme === "dark" ? "light" : "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return (
    <GlobalCtx.Provider
      value={{
        menuBars: { isMenuBarsOpen, toggleMenuBars, closeMenuBars, openMenuBars },
        menu: { isMenuOpen, toggleMenu, closeMenu, openMenu },
        menuCurrentUser: {
          isMenuCurrentUserOpen,
          toggleMenuCurrentUser,
          closeMenuCurrentUser,
          openMenuCurrentUser,
        },
        theme: { currentTheme, toggleTheme, setTheme },
      }}
    >
      {children}
    </GlobalCtx.Provider>
  );
};

export default GlobalProvider;
