import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Statistics from "../../../src/pages/statistics/Statistics";

vi.mock("../../../src/pages/statistics/StatisticsChart", () => ({
  default: ({ kind, metric }: { kind: string; metric: string }) => (
    <div>
      Gráfico {kind}: {metric}
    </div>
  ),
}));

vi.mock("@/context/hooks/auth.hook", () => ({
  default: () => ({ currentUser: { uid: "stats-user" } }),
}));
vi.mock("@/pages/jobs_profiles/hooks/useJobsProfiles", () => ({
  useJobsProfiles: () => ({
    jobs: [
      { id: "a", title: "Empresa A" },
      { id: "b", title: "Empresa B" },
    ],
    isLoading: false,
    isError: false,
  }),
}));
vi.mock("@/pages/records/hooks/useRecord", () => ({
  useRecord: () => ({
    records: [
      {
        jobProfileId: "a",
        titleJobProfile: "A",
        dateTimeRecord: "2026-01-12",
        workStartTime: "08:00",
        workEndTime: "16:00",
        estimatedHourlyRate: 10,
      },
      {
        jobProfileId: "b",
        titleJobProfile: "B",
        dateTimeRecord: "2026-01-13",
        workStartTime: "08:00",
        workEndTime: "12:00",
        estimatedHourlyRate: 20,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe("pantalla de estadísticas", () => {
  it("actualiza los totales al elegir un perfil y una fecha", () => {
    localStorage.clear();
    render(<Statistics />);
    fireEvent.change(screen.getByLabelText("Fecha de referencia"), {
      target: { value: "2026-01-15" },
    });
    expect(screen.getByText("12.00 h")).toBeInTheDocument();
    expect(screen.getByText("160,00 €")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Perfil de estadísticas"), { target: { value: "a" } });
    expect(screen.getAllByText("8.00 h").length).toBeGreaterThan(0);
    expect(screen.getAllByText("80,00 €").length).toBeGreaterThan(0);
    expect(screen.queryByText("12.00 h")).not.toBeInTheDocument();
  });

  it("permite cambiar el gráfico y el dato sin ocultar la tabla", async () => {
    localStorage.clear();
    render(<Statistics />);
    fireEvent.change(screen.getByLabelText("Fecha de referencia"), {
      target: { value: "2026-01-15" },
    });
    fireEvent.change(screen.getByLabelText("Vista de estadísticas"), { target: { value: "pie" } });
    expect(await screen.findByText("Gráfico pie: totalHoursDecimal")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Dato del gráfico"), { target: { value: "count" } });
    expect(screen.getByText("Gráfico pie: count")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
