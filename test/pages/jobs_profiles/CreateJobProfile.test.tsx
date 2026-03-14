import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useBranches: vi.fn(),
  useFetcher: vi.fn(),
  getBranchById: vi.fn(),
}));

vi.mock("react-router", () => ({
  useFetcher: mocks.useFetcher,
}));

vi.mock("@/context/hooks/useBranches.hook", () => ({
  default: mocks.useBranches,
}));

vi.mock("@/services/branches.services", () => ({
  getBranchById: mocks.getBranchById,
}));

vi.mock("../../../src/pages/jobs_profiles/components/SelectJobPosition", () => ({
  default: ({ branchId }: { branchId: string }) => <div>Puestos para {branchId}</div>,
}));

import CreateJobProfile from "../../../src/pages/jobs_profiles/CreateJobProfile";

const MockFetcherForm = ({ children, ...props }: React.ComponentProps<"form">) => (
  <form {...props}>{children}</form>
);

describe("CreateJobProfile", () => {
  it("renderiza formulario base y mensaje de error del fetcher", () => {
    mocks.useBranches.mockReturnValue({
      branches: [{ id: "branch-1", name: "Comercial", description: "Rama" }],
    });
    mocks.useFetcher.mockReturnValue({
      Form: MockFetcherForm,
      state: "idle",
      data: { error: "Todos los campos son requeridos" },
    });
    mocks.getBranchById.mockResolvedValue({ jobsPositions: [] });

    render(<CreateJobProfile />);

    expect(screen.getByRole("heading", { name: "Añadir perfil de trabajo" })).toBeInTheDocument();
    expect(screen.getByLabelText("Título del perfil de trabajo:")).toBeInTheDocument();
    expect(screen.getByLabelText("Selecciona una rama:")).toBeInTheDocument();
    expect(screen.getByText("Todos los campos son requeridos")).toBeInTheDocument();
  });

  it("al seleccionar rama carga puestos y muestra feedback de exito/submitting", async () => {
    mocks.useBranches.mockReturnValue({
      branches: [{ id: "branch-1", name: "Comercial", description: "Rama" }],
    });
    mocks.useFetcher.mockReturnValue({
      Form: MockFetcherForm,
      state: "idle",
      data: { success: true, message: "Perfil creado" },
    });
    mocks.getBranchById.mockResolvedValue({
      jobsPositions: [{ id: "job-1", name: "Supervisor", description: "Coordina" }],
    });

    const { rerender } = render(<CreateJobProfile />);

    fireEvent.change(screen.getByLabelText("Selecciona una rama:"), {
      target: { value: "branch-1" },
    });

    await waitFor(() => {
      expect(mocks.getBranchById).toHaveBeenCalledWith("branch-1");
    });

    expect(screen.getByText("Puestos para branch-1")).toBeInTheDocument();
    expect(screen.getByText("Perfil creado")).toBeInTheDocument();

    mocks.useFetcher.mockReturnValue({
      Form: MockFetcherForm,
      state: "submitting",
      data: null,
    });

    rerender(<CreateJobProfile />);

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
  });
});
