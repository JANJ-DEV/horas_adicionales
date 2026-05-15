import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useJobsProfiles: vi.fn(),
}));

vi.mock("../../../src/pages/jobs_profiles/hooks/useJobsProfiles", () => ({
  useJobsProfiles: mocks.useJobsProfiles,
}));

vi.mock("../../../src/components/AppToastContainer", () => ({
  default: () => <div data-testid="toast-container" />,
}));

vi.mock("../../../src/pages/jobs_profiles/components/RecordsPeriodSelector", () => ({
  default: () => null,
}));

import JobProfiles from "../../../src/pages/jobs_profiles/JobProfiles";

describe("JobProfiles", () => {
  it("muestra EmptyState cuando no hay perfiles y no hay error", () => {
    mocks.useJobsProfiles.mockReturnValue({
      isLoading: false,
      isError: false,
      errorMessage: null,
      jobs: [],
      hasCurrentUser: true,
    });

    render(<JobProfiles />);

    expect(screen.getByText("Aún no tienes perfiles de trabajo")).toBeInTheDocument();
    expect(
      screen.getByText("Crea tu primer perfil para comenzar a registrar jornadas.")
    ).toBeInTheDocument();
  });

  it("muestra error cuando hay fallo real", () => {
    mocks.useJobsProfiles.mockReturnValue({
      isLoading: false,
      isError: true,
      errorMessage: "Error al cargar los perfiles de trabajo",
      jobs: [],
      hasCurrentUser: true,
    });

    render(<JobProfiles />);

    expect(screen.getByText("Error al cargar los perfiles de trabajo")).toBeInTheDocument();
    expect(screen.queryByText("Aún no tienes perfiles de trabajo")).not.toBeInTheDocument();
  });
});
