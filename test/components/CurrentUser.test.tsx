import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CurrentUser from "../../src/components/CurrentUser";

const mockUseAuth = vi.fn();
const mockUseGlobal = vi.fn();

vi.mock("../../src/context/hooks/auth.hook", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../src/context/hooks/useGlobal.hook", () => ({
  default: () => mockUseGlobal(),
}));

const buildAuthState = (overrides = {}) => ({
  currentUser: null,
  signInWithGoogle: vi.fn(),
  signOutGoogle: vi.fn(),
  isLoading: false,
  isAuthenticated: false,
  ...overrides,
});

const buildGlobalState = (overrides = {}) => ({
  menuCurrentUser: {
    isMenuCurrentUserOpen: false,
    toggleMenuCurrentUser: vi.fn(),
    closeMenuCurrentUser: vi.fn(),
  },
  menuBars: {
    closeMenuBars: vi.fn(),
  },
  ...overrides,
});

const renderCurrentUser = () =>
  render(
    <MemoryRouter>
      <CurrentUser />
    </MemoryRouter>
  );

describe("CurrentUser component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza loading cuando isLoading es true", () => {
    mockUseAuth.mockReturnValue(buildAuthState({ isLoading: true }));
    mockUseGlobal.mockReturnValue(buildGlobalState());

    const { container } = renderCurrentUser();

    const loadingIcon = container.querySelector("svg");
    expect(loadingIcon).toBeTruthy();
  });

  it("muestra icono de login y ejecuta signInWithGoogle", () => {
    const authState = buildAuthState();
    mockUseAuth.mockReturnValue(authState);
    mockUseGlobal.mockReturnValue(buildGlobalState());

    const { container } = renderCurrentUser();

    const loginIcon = container.querySelector("svg");
    expect(loginIcon).toBeTruthy();

    fireEvent.click(loginIcon as SVGElement);
    expect(authState.signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it("renderiza usuario autenticado y permite abrir menu", () => {
    const toggleMenuCurrentUser = vi.fn();
    const closeMenuBars = vi.fn();

    mockUseAuth.mockReturnValue(
      buildAuthState({
        isAuthenticated: true,
        currentUser: {
          photoURL: "https://example.com/avatar.png",
          emailVerified: true,
          displayName: "Juan",
        },
      })
    );
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuCurrentUser: {
          isMenuCurrentUserOpen: false,
          toggleMenuCurrentUser,
          closeMenuCurrentUser: vi.fn(),
        },
        menuBars: {
          closeMenuBars,
        },
      })
    );

    renderCurrentUser();

    const avatar = screen.getByAltText("User profile");
    expect(avatar).toBeInTheDocument();
    expect(avatar.className).toContain("border-green-500");

    fireEvent.click(avatar);

    expect(toggleMenuCurrentUser).toHaveBeenCalledTimes(1);
    expect(closeMenuBars).toHaveBeenCalledTimes(1);
  });

  it("ejecuta signOutGoogle desde el menu abierto", () => {
    const signOutGoogle = vi.fn();

    mockUseAuth.mockReturnValue(
      buildAuthState({
        isAuthenticated: true,
        signOutGoogle,
        currentUser: {
          photoURL: "https://example.com/avatar.png",
          emailVerified: false,
          displayName: "Juan",
        },
      })
    );
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuCurrentUser: {
          isMenuCurrentUserOpen: true,
          toggleMenuCurrentUser: vi.fn(),
          closeMenuCurrentUser: vi.fn(),
        },
      })
    );

    renderCurrentUser();

    fireEvent.click(screen.getByText("Salir"));
    expect(signOutGoogle).toHaveBeenCalledTimes(1);
  });

  it("cierra menu al hacer click fuera del componente", () => {
    const closeMenuCurrentUser = vi.fn();

    mockUseAuth.mockReturnValue(buildAuthState());
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuCurrentUser: {
          isMenuCurrentUserOpen: false,
          toggleMenuCurrentUser: vi.fn(),
          closeMenuCurrentUser,
        },
      })
    );

    renderCurrentUser();
    closeMenuCurrentUser.mockClear();

    fireEvent.click(document.body);

    expect(closeMenuCurrentUser).toHaveBeenCalledTimes(1);
  });
});