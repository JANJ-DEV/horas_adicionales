import type { Children } from "@/types";
import { useState, type FC } from "react";
import GlobalCtx from "../GlobalCtx";

const GlobalProvider: FC<Children> = ({ children }) => {
  const [isMenuBarsOpen, setIsMenuBarsOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuCurrentUserOpen, setIsMenuCurrentUserOpen] = useState<boolean>(false);
  
  const toggleMenuBars = () => setIsMenuBarsOpen(prev => !prev);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleMenuCurrentUser = () => setIsMenuCurrentUserOpen(prev => !prev);

  const closeMenuBars = () => setIsMenuBarsOpen(false);
  const closeMenu = () => setIsMenuOpen(false);
  const closeMenuCurrentUser = () => setIsMenuCurrentUserOpen(false);
  const openMenuBars = () => setIsMenuBarsOpen(true);
  const openMenu = () => setIsMenuOpen(true);
  const openMenuCurrentUser = () => setIsMenuCurrentUserOpen(true);  
  

  return (
    <GlobalCtx.Provider value={{ 
      menuBars: { isMenuBarsOpen, toggleMenuBars, closeMenuBars, openMenuBars },
      menu: { isMenuOpen, toggleMenu, closeMenu, openMenu },
      menuCurrentUser: { isMenuCurrentUserOpen, toggleMenuCurrentUser, closeMenuCurrentUser, openMenuCurrentUser }
    }}>
      {children}
    </GlobalCtx.Provider>
  )
}

export default GlobalProvider;