import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

const mocks = vi.hoisted(() => ({
  useEditRecord: vi.fn(),
  useUtilities: vi.fn(),
}));

vi.mock("../../../src/pages/records/hooks/useEditRecord", () => ({
  useEditRecord: mocks.useEditRecord,
}));

vi.mock("../../../src/context/hooks/useUtilities.hook", () => ({
  default: mocks.useUtilities,
}));

vi.mock("../../../src/components/RecordCalculationSummary", () => ({
  default: ({
    startTime,
    endTime,
    hourlyRate,
  }: {
    startTime?: string;
    endTime?: string;
    hourlyRate: number;
  }) => (
    <div>
      Resumen {startTime}-{endTime}-{hourlyRate}
    </div>
  ),
}));

import EditRecord from "../../../src/pages/records/EditRecord";

const MockFetcherForm = ({ children, ...props }: React.ComponentProps<"form">) => (
  <form {...props}>{children}</form>
);

describe("EditRecord", () => {
  it("precarga el formulario con los datos existentes del registro", async () => {
    mocks.useEditRecord.mockReturnValue({
      record: {
        id: "record-1",
        jobProfileId: "profile-1",
        titleJobProfile: "Turno noche",
        dateTimeRecord: "2026-03-14",
        workStartTime: "08:00",
        workEndTime: "17:00",
        estimatedHourlyRate: 20,
        branchId: "branch-1",
        jobPositionId: "job-2",
        utilitiesValues: {
          tolls: 25,
          comment_box: "Proyecto Atlas",
        },
      },
      formAction: { Form: MockFetcherForm, state: "idle", data: null },
      jobProfiles: [{ id: "profile-1", title: "Turno noche" }],
      selectedProfileId: "profile-1",
      selectedTitle: "Turno noche",
      estimatedHourlyRate: 20,
      selectedBranchId: "branch-1",
      selectedJobPositionId: "job-2",
      handleProfileChange: vi.fn(),
      hasCurrentUser: true,
      isLoadingProfiles: false,
      isLoadingRecord: false,
    });

    mocks.useUtilities.mockReturnValue({
      activeUtilities: [
        { id: "comment_box", definition: { label: "Comentarios", type: "textarea" } },
        { id: "peajes", definition: { label: "Peajes", type: "number", dbKey: "tolls" } },
      ],
      isLoadingUtilities: false,
      catalog: {
        utility_definitions: {
          comment_box: { label: "Comentarios", type: "textarea" },
          peajes: { label: "Peajes", type: "number", dbKey: "tolls" },
        },
      },
    });

    render(
      <MemoryRouter>
        <EditRecord />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Actualizar registro" })).toBeInTheDocument();
    });

    expect(screen.getByRole("combobox", { name: /Perfil/ })).toHaveValue("profile-1");
    expect(screen.getByDisplayValue("2026-03-14")).toBeInTheDocument();
    expect(screen.getByDisplayValue("08:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("17:00")).toBeInTheDocument();
    expect(screen.getByText("Resumen 08:00-17:00-20")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Comentarios" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Peajes" })).toBeChecked();
    expect(screen.getByDisplayValue("Proyecto Atlas")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });
});
