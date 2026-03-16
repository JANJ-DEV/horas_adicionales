import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useDetailRecord: vi.fn(),
  useUtilities: vi.fn(),
  getBranchById: vi.fn(),
}));

vi.mock("../../../src/pages/records/hooks/useDeyailsRecord", () => ({
  useDetailRecord: mocks.useDetailRecord,
}));

vi.mock("../../../src/context/hooks/useUtilities.hook", () => ({
  default: mocks.useUtilities,
}));

vi.mock("@/services/branches.services", () => ({
  getBranchById: mocks.getBranchById,
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

import DetailsRecord from "../../../src/pages/records/DetailsRecord";

describe("DetailsRecord", () => {
  it("renderiza EmptyState cuando no existe record y permite volver", () => {
    const navigate = vi.fn();
    mocks.useDetailRecord.mockReturnValue({
      record: null,
      navigate,
    });
    mocks.useUtilities.mockReturnValue({
      catalog: {
        utility_definitions: {},
      },
    });

    render(<DetailsRecord />);

    expect(screen.getByText("No se encontraron detalles del registro.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Volver a registros" }));
    expect(navigate).toHaveBeenCalledWith("/records");
  });

  it("renderiza detalle, resuelve rama/puesto y navega a edición", async () => {
    const navigate = vi.fn();

    mocks.useDetailRecord.mockReturnValue({
      navigate,
      record: {
        id: "record-1",
        titleJobProfile: "Turno noche",
        dateTimeRecord: "2026-03-14",
        workStartTime: "08:00",
        workEndTime: "17:00",
        estimatedHourlyRate: 20,
        createdAt: new Date("2026-03-14T10:00:00.000Z"),
        updatedAt: new Date("2026-03-14T12:00:00.000Z"),
        branchId: "branch-1",
        jobPositionId: "job-2",
        utilitiesValues: {
          production_name: "Proyecto Atlas",
          tolls: 25,
        },
      },
    });

    mocks.useUtilities.mockReturnValue({
      catalog: {
        utility_definitions: {
          nombre_produccion: {
            label: "Nombre de producción",
            type: "text",
          },
          peajes: {
            label: "Peajes",
            type: "number",
            dbKey: "tolls",
          },
        },
      },
    });

    mocks.getBranchById.mockResolvedValue({
      id: "branch-1",
      name: "Comercial",
      description: "Rama comercial",
      jobsPositions: [{ id: "job-2", name: "Supervisor", description: "Coordina" }],
    });

    render(<DetailsRecord />);

    expect(screen.getByRole("heading", { name: "Turno noche" })).toBeInTheDocument();
    expect(screen.getByText("Resumen 08:00-17:00-20")).toBeInTheDocument();

    await waitFor(() => {
      expect(mocks.getBranchById).toHaveBeenCalledWith("branch-1");
    });

    expect(screen.getByText("Comercial")).toBeInTheDocument();
    expect(screen.getByText("Supervisor")).toBeInTheDocument();
    expect(screen.getByText("Proyecto Atlas")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    expect(navigate).toHaveBeenCalledWith("/records/edit/record-1");
  });
});
