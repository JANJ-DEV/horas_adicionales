import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import PrivateLayout from "../../../src/pages/layouts/PrivateLayout";

const mockUseAuth = vi.fn();

vi.mock("../../../src/context/hooks/auth.hook", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../../src/components/Loading", () => ({
  default: () => <div data-testid="private-layout-loading" />,
}));

vi.mock("../../../src/pages/layouts/MainHeader", () => ({
  default: () => <header data-testid="private-layout-header" />,
}));

vi.mock("../../../src/pages/layouts/MainContent", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="private-layout-main">{children}</main>
  ),
}));

vi.mock("../../../src/components/Footer", () => ({
  default: () => <footer data-testid="private-layout-footer" />,
}));

vi.mock("../../../src/context/providers/UtilitiesProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();

  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="private-layout-navigate">{to}</div>,
    Outlet: () => <div data-testid="private-layout-outlet" />,
  };
});

describe("PrivateLayout", () => {
  it("muestra loading mientras auth no esta resuelta", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAuthResolved: false,
    });

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("private-layout-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("private-layout-navigate")).not.toBeInTheDocument();
  });

  it("redirige al home cuando auth esta resuelta y el usuario no esta autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAuthResolved: true,
    });

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("private-layout-navigate")).toHaveTextContent("/");
    expect(screen.queryByTestId("private-layout-loading")).not.toBeInTheDocument();
  });

  it("renderiza la vista privada cuando auth esta resuelta y autenticada", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAuthResolved: true,
    });

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("private-layout-header")).toBeInTheDocument();
    expect(screen.getByTestId("private-layout-main")).toBeInTheDocument();
    expect(screen.getByTestId("private-layout-outlet")).toBeInTheDocument();
    expect(screen.getByTestId("private-layout-footer")).toBeInTheDocument();
    expect(screen.queryByTestId("private-layout-navigate")).not.toBeInTheDocument();
  });
});
