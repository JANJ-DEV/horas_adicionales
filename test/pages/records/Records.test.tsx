import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";

const mocks = vi.hoisted(() => ({
  useRecordsFiltering: vi.fn(),
  subscribeToBranches: vi.fn(),
  subscribeToJobProfiles: vi.fn(),
  useInfiniteScroll: vi.fn(),
}));

vi.mock("../../../src/pages/records/hooks/useRecordsFiltering", () => ({
  useRecordsFiltering: mocks.useRecordsFiltering,
}));

vi.mock("@/context/hooks/auth.hook", () => ({
  default: () => ({ currentUser: { uid: "user-1" } }),
}));

vi.mock("@/services/branches.service", () => ({
  subscribeToBranches: mocks.subscribeToBranches,
}));

vi.mock("@/services/jobsProfile.service", () => ({
  subscribeToJobProfiles: mocks.subscribeToJobProfiles,
}));

vi.mock("@/hooks/useInfiniteScroll", () => ({
  default: mocks.useInfiniteScroll,
}));

vi.mock("../../../src/pages/records/components/RecordsPeriodSelector", () => ({
  default: () => <div>selector de periodo</div>,
}));

vi.mock("../../../src/pages/records/components/RecordsSummary", () => ({
  default: ({ recordsCount }: { recordsCount: number }) => <div>resumen {recordsCount}</div>,
}));

vi.mock("../../../src/pages/records/components/RecordsFiltersBar", () => ({
  default: () => <div>barra de filtros</div>,
}));

vi.mock("../../../src/pages/records/components/RecordsListGrid", () => ({
  default: ({ records }: { records: Array<{ titleJobProfile: string }> }) => (
    <>
      {records.map((record) => (
        <article key={record.titleJobProfile}>{record.titleJobProfile}</article>
      ))}
    </>
  ),
}));

vi.mock("../../../src/pages/records/components/RecordCard", () => ({
  default: ({ record }: { record: { titleJobProfile: string } }) => (
    <article>{record.titleJobProfile}</article>
  ),
}));

import Records from "../../../src/pages/records/Records";
import RecordsLayout from "../../../src/pages/records/RecordsLayout";
import { rememberSelectedRecordId } from "../../../src/pages/records/recordNavigation";

const buildRecord = (id: string) => ({
  id,
  titleJobProfile: `Registro ${id}`,
  dateTimeRecord: "2026-04-16",
  workStartTime: "08:00",
  workEndTime: "17:00",
  estimatedHourlyRate: 10,
  branchId: "branch-1",
  jobPositionId: "job-1",
});

describe("Records", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    mocks.subscribeToBranches.mockImplementation((callback: (branches: unknown[]) => void) => {
      callback([
        {
          id: "branch-1",
          name: "Sucursal Centro",
          jobsPositions: [{ id: "job-1", name: "Operador" }],
        },
      ]);
      return vi.fn();
    });

    mocks.subscribeToJobProfiles.mockImplementation((onUpdate: (profiles: unknown[]) => void) => {
      onUpdate([{ id: "profile-1", title: "Perfil base" }]);
      return vi.fn();
    });

    mocks.useInfiniteScroll.mockReturnValue({
      sentinelRef: { current: null },
    });
  });

  it.each(["card", "list"])("carga progresivamente todos los registros en vista %s", (viewMode) => {
    localStorage.setItem("records:view-mode", viewMode);
    const records = Array.from({ length: 20 }, (_, index) => buildRecord(`record-${index + 1}`));
    mocks.useRecordsFiltering.mockReturnValue({
      filters: {},
      selectedPeriod: "all",
      hasManualDateRange: false,
      recordsByPeriod: records,
      summary: { totalHoursDecimal: 0, totalSalary: 0 },
      effectiveSummaryPeriod: "all",
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
      handlePeriodChange: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/records"]}>
        <Records />
      </MemoryRouter>
    );

    expect(screen.queryByText("Registro record-20")).not.toBeInTheDocument();
    expect(screen.getByText(/Mostrando 9 de 20 registros/)).toBeInTheDocument();
    expect(mocks.useInfiniteScroll).toHaveBeenLastCalledWith(
      expect.objectContaining({ hasMore: true })
    );
    act(() => mocks.useInfiniteScroll.mock.lastCall?.[0].onLoadMore());
    expect(screen.getByText(/Mostrando 18 de 20 registros/)).toBeInTheDocument();
    act(() => mocks.useInfiniteScroll.mock.lastCall?.[0].onLoadMore());
    expect(screen.getByText("Registro record-20")).toBeInTheDocument();
    expect(mocks.useInfiniteScroll).toHaveBeenLastCalledWith(
      expect.objectContaining({ hasMore: false })
    );
  });

  it("permite cambiar de perfil desde la pantalla de registros", () => {
    const changeProfile = vi.fn();
    mocks.subscribeToJobProfiles.mockImplementation((onUpdate: (profiles: unknown[]) => void) => {
      onUpdate([
        { id: "profile-1", title: "Empresa A" },
        { id: "profile-2", title: "Empresa B" },
      ]);
      return vi.fn();
    });
    mocks.useRecordsFiltering.mockReturnValue({
      selectedProfileId: "profile-1",
      hasUnassignedRecords: false,
      selectedPeriod: "all",
      recordsByPeriod: [],
      summary: { totalHoursDecimal: 0, totalSalary: 0 },
      effectiveSummaryPeriod: "all",
      isLoading: false,
      isError: false,
      hasCurrentUser: true,
      handleProfileChange: changeProfile,
      handlePeriodChange: vi.fn(),
    });
    render(
      <MemoryRouter>
        <Records />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Cambiar perfil"), { target: { value: "profile-2" } });
    expect(changeProfile).toHaveBeenCalledWith("profile-2");
  });

  it("muestra las acciones sin el resumen en la barra superior", () => {
    mocks.useRecordsFiltering.mockReturnValue({
      selectedProfileId: "profile-1",
      hasUnassignedRecords: false,
      selectedPeriod: "all",
      recordsByPeriod: [],
      summary: { totalHoursDecimal: 0, totalSalary: 0 },
      effectiveSummaryPeriod: "all",
      isLoading: false,
      isError: false,
      hasCurrentUser: true,
      handleProfileChange: vi.fn(),
      handlePeriodChange: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/records"]}>
        <Routes>
          <Route path="/records" element={<RecordsLayout />}>
            <Route index element={<Records />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByRole("button", { name: /resumen/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registrar hora" })).toBeInTheDocument();
  });

  it("restaura el scroll al registro seleccionado aunque quede fuera del primer bloque visible", async () => {
    const records = Array.from({ length: 10 }, (_, index) => buildRecord(`record-${index + 1}`));

    mocks.useRecordsFiltering.mockReturnValue({
      filters: {
        branchId: "",
        jobPositionId: "",
        jobProfileId: "",
        dateFrom: "",
        dateTo: "",
        minHourlyRate: "",
        maxHourlyRate: "",
        minWorkedHours: "",
        maxWorkedHours: "",
      },
      selectedPeriod: "week",
      hasManualDateRange: false,
      recordsByPeriod: records,
      summary: {
        totalHoursDecimal: 0,
        totalSalary: 0,
      },
      effectiveSummaryPeriod: "week",
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
      handlePeriodChange: vi.fn(),
      handleFilterChange: vi.fn(),
    });

    rememberSelectedRecordId("record-10");

    render(
      <MemoryRouter initialEntries={["/records"]}>
        <Records />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Registro record-10")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "center" });
    });

    expect(sessionStorage.getItem("records:selected-record-id")).toBeNull();
  });
});
