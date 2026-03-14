import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MainMenu from "../../src/components/MainMenu";

const mockUseAuth = vi.fn();
const mockUseGlobal = vi.fn();

vi.mock("../../src/context/hooks/auth.hook", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../src/context/hooks/useGlobal.hook", () => ({
  default: () => mockUseGlobal(),
}));

const buildAuthState = (overrides = {}) => ({
  isAuthenticated: false,
  ...overrides,
});

const buildGlobalState = (overrides = {}) => ({
  menuBars: {
    closeMenuBars: vi.fn(),
  },
  ...overrides,
});

const renderMainMenu = (variant: "mobile" | "desktop" = "desktop") =>
  render(
    <MemoryRouter>
      <MainMenu variant={variant} />
    </MemoryRouter>
  );

describe("MainMenu component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza links cuando no hay sesion", () => {
    mockUseAuth.mockReturnValue(buildAuthState({ isAuthenticated: false }));
    mockUseGlobal.mockReturnValue(buildGlobalState());

    renderMainMenu();

    expect(screen.queryByRole("link", { name: "Registros" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Perfiles de Trabajo" })).not.toBeInTheDocument();
  });

  it("renderiza links de navegacion cuando hay sesion", () => {
    mockUseAuth.mockReturnValue(buildAuthState({ isAuthenticated: true }));
    mockUseGlobal.mockReturnValue(buildGlobalState());

    renderMainMenu();

    expect(screen.getByRole("link", { name: "Registros" })).toHaveAttribute("href", "/records");
    expect(screen.getByRole("link", { name: "Perfiles de Trabajo" })).toHaveAttribute(
      "href",
      "/jobs-profiles"
    );
  });

  it("ejecuta closeMenuBars al clickear una opcion", () => {
    const closeMenuBars = vi.fn();

    mockUseAuth.mockReturnValue(buildAuthState({ isAuthenticated: true }));
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuBars: {
          closeMenuBars,
        },
      })
    );

    renderMainMenu();

    fireEvent.click(screen.getByRole("link", { name: "Registros" }));

    expect(closeMenuBars).toHaveBeenCalledTimes(1);
  });

  it("cierra menu al hacer click fuera del nav", () => {
    const closeMenuBars = vi.fn();

    mockUseAuth.mockReturnValue(buildAuthState({ isAuthenticated: true }));
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuBars: {
          closeMenuBars,
        },
      })
    );

    renderMainMenu("mobile");
    closeMenuBars.mockClear();

    fireEvent.click(document.body);

    expect(closeMenuBars).toHaveBeenCalledTimes(1);
  });

  it("no cierra menu por click dentro del nav", () => {
    const closeMenuBars = vi.fn();

    mockUseAuth.mockReturnValue(buildAuthState({ isAuthenticated: true }));
    mockUseGlobal.mockReturnValue(
      buildGlobalState({
        menuBars: {
          closeMenuBars,
        },
      })
    );

    const { container } = renderMainMenu("mobile");
    closeMenuBars.mockClear();

    const nav = container.querySelector("nav") as HTMLElement;
    fireEvent.click(nav);

    expect(closeMenuBars).not.toHaveBeenCalled();
  });
});
