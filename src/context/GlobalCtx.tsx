import { createContext } from "react";

export type ThemeMode = "light" | "dark";

interface GlobalContextType {
  menuBars: {
    isMenuBarsOpen: boolean;
    toggleMenuBars: () => void;
    closeMenuBars: () => void;
    openMenuBars: () => void;
  };
  menu: {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    openMenu: () => void;
  };
  menuCurrentUser: {
    isMenuCurrentUserOpen: boolean;
    toggleMenuCurrentUser: () => void;
    closeMenuCurrentUser: () => void;
    openMenuCurrentUser: () => void;
  };
  theme: {
    currentTheme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
  };
}

const GlobalCtx = createContext<GlobalContextType | null>(null);

export default GlobalCtx;
