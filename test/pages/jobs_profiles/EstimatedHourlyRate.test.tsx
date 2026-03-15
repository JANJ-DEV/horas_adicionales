import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  updateJobProfile: vi.fn(),
  updateEstimatedHourlyRateByJobProfile: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  notifyInfo: vi.fn(),
}));

vi.mock("../../../src/services/jobsProfile.service", () => ({
  updateJobProfile: mocks.updateJobProfile,
}));

vi.mock("../../../src/services/records.service", () => ({
  updateEstimatedHourlyRateByJobProfile: mocks.updateEstimatedHourlyRateByJobProfile,
}));

vi.mock("../../../src/services/toast.service", () => ({
  TOAST_SCOPE: {
    PROFILE: "profile",
  },
  notify: {
    success: mocks.notifySuccess,
    error: mocks.notifyError,
    info: mocks.notifyInfo,
  },
}));

import EstimatedHourlyRate from "../../../src/pages/jobs_profiles/components/EstimatedHourlyRate";

describe("EstimatedHourlyRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.updateJobProfile.mockResolvedValue(undefined);
    mocks.updateEstimatedHourlyRateByJobProfile.mockResolvedValue(3);
  });

  it("actualiza solo el perfil cuando no se marca la sincronizacion", async () => {
    render(
      <EstimatedHourlyRate
        rate={18}
        jobProfileId="profile-1"
        profileTitle="Turno noche"
        branchId="branch-1"
        jobPositionId="job-1"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "21.5" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(mocks.updateJobProfile).toHaveBeenCalledWith("profile-1", {
        estimatedHourlyRate: 21.5,
      });
    });

    expect(mocks.updateEstimatedHourlyRateByJobProfile).not.toHaveBeenCalled();
    expect(mocks.notifySuccess).toHaveBeenCalledWith("Tarifa estimada actualizada correctamente", {
      scope: "profile",
    });
  });

  it("sincroniza registros existentes cuando el usuario marca la opcion", async () => {
    render(
      <EstimatedHourlyRate
        rate={18}
        jobProfileId="profile-1"
        profileTitle="Turno noche"
        branchId="branch-1"
        jobPositionId="job-1"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "23" } });
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /Aplicar esta tarifa tambien a los registros ya creados con este perfil/i,
      })
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(mocks.updateEstimatedHourlyRateByJobProfile).toHaveBeenCalledWith("profile-1", 23, {
        titleJobProfile: "Turno noche",
        branchId: "branch-1",
        jobPositionId: "job-1",
      });
    });

    expect(mocks.notifySuccess).toHaveBeenCalledWith(
      "Tarifa actualizada y aplicada a 3 registros existentes",
      { scope: "profile" }
    );
  });
});
