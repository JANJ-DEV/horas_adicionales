import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import type { PropsWithChildren } from "react";
import type { JobProfile } from "../../../../src/types";

const mocks = vi.hoisted(() => ({
  useRecord: vi.fn(),
}));

vi.mock("../../../../src/pages/records/hooks/useRecord", () => ({
  useRecord: mocks.useRecord,
}));

import { useRecordsFiltering } from "../../../../src/pages/records/hooks/useRecordsFiltering";
import { getBillingCycle } from "../../../../src/pages/records/billingCycle";

const buildRecord = (id: string, date: string, hourlyRate = 10) => ({
  id,
  titleJobProfile: `Registro ${id}`,
  dateTimeRecord: date,
  workStartTime: "08:00",
  workEndTime: "16:00",
  estimatedHourlyRate: hourlyRate,
  branchId: "branch-1",
  jobPositionId: "job-1",
  jobProfileId: "profile-1",
});

const createRouterWrapper = (initialEntry = "/records") => {
  return ({ children }: PropsWithChildren) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );
};

describe("useRecordsFiltering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mocks.useRecord.mockReturnValue({
      records: [],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
    });
  });

  it("muestra todos los registros por defecto cuando no hay rango manual", () => {
    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    const oldDate = new Date(today);
    oldDate.setFullYear(oldDate.getFullYear() - 1);

    mocks.useRecord.mockReturnValue({
      records: [
        buildRecord("current", currentDate),
        buildRecord("old", oldDate.toISOString().slice(0, 10)),
      ],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
    });

    const { result } = renderHook(() => useRecordsFiltering(), {
      wrapper: createRouterWrapper(),
    });

    expect(result.current.selectedPeriod).toBe("all");
    expect(result.current.recordsByPeriod.some((record) => record.id === "current")).toBe(true);
    expect(result.current.recordsByPeriod.some((record) => record.id === "old")).toBe(true);
  });

  it("permite elegir un ciclo antiguo por perfil y calcula su resumen", () => {
    const profiles = [
      { id: "profile-1", title: "Empresa A", billingCycleStartDay: 10 },
      { id: "profile-2", title: "Empresa B", billingCycleStartDay: 20 },
    ] as JobProfile[];
    mocks.useRecord.mockReturnValue({
      records: [
        buildRecord("new", "2026-03-10T12:00:00"),
        buildRecord("old", "2026-02-15T12:00:00"),
        { ...buildRecord("other", "2026-02-15T12:00:00"), jobProfileId: "profile-2" },
      ],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
    });
    const { result } = renderHook(() => useRecordsFiltering(profiles), {
      wrapper: createRouterWrapper(),
    });
    act(() => result.current.handlePeriodChange("custom_cycle"));
    const currentCycle = getBillingCycle(
      { ...buildRecord("today", "2026-01-01"), dateTimeRecord: new Date() },
      profiles
    );
    expect(result.current.selectedCycle).toBe(currentCycle?.key);
    const oldCycle = result.current.cycleOptions.find(
      (cycle) => cycle.label.includes("Empresa A") && cycle.label.includes("10/2/2026")
    );
    expect(oldCycle).toBeDefined();
    act(() => result.current.setSelectedCycle(oldCycle!.key));
    expect(result.current.recordsByPeriod.map((record) => record.id)).toEqual(["old"]);
    expect(result.current.summary).toEqual({ totalHoursDecimal: 8, totalSalary: 80 });
    act(() => {
      result.current.handlePeriodChange("all");
      result.current.handlePeriodChange("custom_cycle");
    });
    expect(result.current.selectedCycle).toBe(currentCycle?.key);
  });

  it("incluye la fecha inicial y excluye fechas anteriores al elegir desde una fecha", () => {
    mocks.useRecord.mockReturnValue({
      records: [
        buildRecord("before", "2024-01-01"),
        buildRecord("start", "2025-01-01"),
        buildRecord("after", "2026-01-01"),
      ],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
    });
    const { result } = renderHook(() => useRecordsFiltering(), { wrapper: createRouterWrapper() });
    act(() => {
      result.current.handlePeriodChange("since");
      result.current.setSinceDate("2025-01-01");
    });
    expect(result.current.recordsByPeriod.map((record) => record.id)).toEqual(["after", "start"]);
  });

  it("muestra y suma registros de distintas fechas al seleccionar todos", () => {
    mocks.useRecord.mockReturnValue({
      records: [buildRecord("old", "2023-01-01"), buildRecord("recent", "2026-01-01", 20)],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
    });
    const { result } = renderHook(() => useRecordsFiltering(), { wrapper: createRouterWrapper() });

    act(() => result.current.handlePeriodChange("all"));

    expect(result.current.recordsByPeriod).toHaveLength(2);
    expect(result.current.summary).toEqual({ totalHoursDecimal: 16, totalSalary: 240 });
    expect(result.current.effectiveSummaryPeriod).toBe("all");
  });

  it("separa los registros por perfil y permite acceder a los que no tienen perfil v�lido", () => {
    const profiles = [
      { id: "profile-1", title: "Empresa A" },
      { id: "profile-2", title: "Empresa B" },
    ] as JobProfile[];
    mocks.useRecord.mockReturnValue({
      records: [
        buildRecord("one", "2026-01-01"),
        { ...buildRecord("two", "2026-01-02"), jobProfileId: "profile-2" },
        { ...buildRecord("missing", "2026-01-03"), jobProfileId: undefined },
        { ...buildRecord("deleted", "2026-01-04"), jobProfileId: "deleted" },
      ],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      currentUserId: "user-1",
    });
    const { result } = renderHook(() => useRecordsFiltering(profiles), {
      wrapper: createRouterWrapper("/records?jobProfileId=profile-1&minHourlyRate=999"),
    });
    expect(result.current.recordsByPeriod.map((record) => record.id)).toEqual(["one"]);
    act(() => result.current.handleProfileChange("profile-2"));
    expect(result.current.recordsByPeriod.map((record) => record.id)).toEqual(["two"]);
    act(() => result.current.handleProfileChange("__unassigned__"));
    expect(result.current.recordsByPeriod.map((record) => record.id)).toEqual([
      "deleted",
      "missing",
    ]);
    expect(result.current.hasUnassignedRecords).toBe(true);
  });

  it("recupera la selecci�n del usuario al volver y no reutiliza la de otra cuenta", () => {
    const profiles = [
      { id: "profile-1", title: "Empresa A" },
      { id: "profile-2", title: "Empresa B" },
    ] as JobProfile[];
    localStorage.setItem("records:selected-profile:user-1", "profile-2");
    mocks.useRecord.mockReturnValue({
      records: [],
      isLoading: false,
      isError: false,
      hasCurrentUser: true,
      currentUserId: "user-1",
    });
    const { result, rerender } = renderHook(() => useRecordsFiltering(profiles), {
      wrapper: createRouterWrapper(),
    });
    expect(result.current.selectedProfileId).toBe("profile-2");
    mocks.useRecord.mockReturnValue({
      records: [],
      isLoading: false,
      isError: false,
      hasCurrentUser: true,
      currentUserId: "user-2",
    });
    rerender();
    expect(result.current.selectedProfileId).toBe("profile-1");
  });
});
