import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useParams: vi.fn(),
  getJobProfileById: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("react-router", () => ({
  useParams: mocks.useParams,
}));

vi.mock("@/services/jobsProfile.service", () => ({
  getJobProfileById: mocks.getJobProfileById,
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: mocks.toastError,
  },
}));

import JobProfileDetails from "../../../src/pages/jobs_profiles/JobProfileDetails";

describe("JobProfileDetails", () => {
  it("muestra mensaje de id inválido cuando no hay parametro", () => {
    mocks.useParams.mockReturnValue({ id: "" });

    render(<JobProfileDetails />);

    expect(
      screen.getByRole("heading", { name: "Perfil de Trabajo no encontrado" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("No se ha proporcionado un ID de perfil de trabajo válido.")
    ).toBeInTheDocument();
    expect(mocks.getJobProfileById).not.toHaveBeenCalled();
  });

  it("carga y renderiza el detalle del perfil", async () => {
    mocks.useParams.mockReturnValue({ id: "profile-1" });
    mocks.getJobProfileById.mockResolvedValue({
      id: "profile-1",
      title: "Perfil noche",
      branch: { id: "branch-1", name: "Comercial", description: "Rama" },
      jobPosition: { id: "job-1", name: "Supervisor", description: "Coordina" },
      estimatedHourlyRate: 18,
    });

    render(<JobProfileDetails />);

    expect(screen.getByText("Cargando detalles del perfil de trabajo...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Perfil noche")).toBeInTheDocument();
    });

    expect(screen.getByText("Comercial")).toBeInTheDocument();
    expect(screen.getByText("Supervisor")).toBeInTheDocument();
    expect(screen.getByText(/18/)).toBeInTheDocument();
  });

  it("notifica error cuando el servicio no encuentra el perfil", async () => {
    mocks.useParams.mockReturnValue({ id: "profile-404" });
    mocks.getJobProfileById.mockResolvedValue(null);

    render(<JobProfileDetails />);

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        "No se encontró el perfil de trabajo con el ID proporcionado",
        { containerId: "jobs-profiles", autoClose: 2000, closeButton: false, closeOnClick: true }
      );
    });
  });
});
