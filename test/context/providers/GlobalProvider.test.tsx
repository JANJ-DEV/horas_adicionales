import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it } from "vitest";
import useGlobal from "../../../src/context/hooks/useGlobal.hook";
import GlobalProvider from "../../../src/context/providers/GlobalProvider";

const wrapper = ({ children }: PropsWithChildren) => <GlobalProvider>{children}</GlobalProvider>;

describe("GlobalProvider", () => {
  it("expone toggles y cierres para los tres menus", () => {
    const { result } = renderHook(() => useGlobal(), { wrapper });

    expect(result.current.menuBars.isMenuBarsOpen).toBe(false);
    expect(result.current.menu.isMenuOpen).toBe(false);
    expect(result.current.menuCurrentUser.isMenuCurrentUserOpen).toBe(false);

    act(() => {
      result.current.menuBars.toggleMenuBars();
      result.current.menu.toggleMenu();
      result.current.menuCurrentUser.toggleMenuCurrentUser();
    });

    expect(result.current.menuBars.isMenuBarsOpen).toBe(true);
    expect(result.current.menu.isMenuOpen).toBe(true);
    expect(result.current.menuCurrentUser.isMenuCurrentUserOpen).toBe(true);

    act(() => {
      result.current.menuBars.closeMenuBars();
      result.current.menu.closeMenu();
      result.current.menuCurrentUser.closeMenuCurrentUser();
    });

    expect(result.current.menuBars.isMenuBarsOpen).toBe(false);
    expect(result.current.menu.isMenuOpen).toBe(false);
    expect(result.current.menuCurrentUser.isMenuCurrentUserOpen).toBe(false);
  });

  it("permite abrir menus de forma imperativa", () => {
    const { result } = renderHook(() => useGlobal(), { wrapper });

    act(() => {
      result.current.menuBars.openMenuBars();
      result.current.menu.openMenu();
      result.current.menuCurrentUser.openMenuCurrentUser();
    });

    expect(result.current.menuBars.isMenuBarsOpen).toBe(true);
    expect(result.current.menu.isMenuOpen).toBe(true);
    expect(result.current.menuCurrentUser.isMenuCurrentUserOpen).toBe(true);
  });
});