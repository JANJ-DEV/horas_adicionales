import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import type { PropsWithChildren } from "react";

const mocks = vi.hoisted(() => ({
  useRecord: vi.fn(),
}));

vi.mock("../../../../src/pages/records/hooks/useRecord", () => ({
  useRecord: mocks.useRecord,
}));

import { useRecordsFiltering } from "../../../../src/pages/records/hooks/useRecordsFiltering";

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

  it("aplica filtro por periodo semanal por defecto cuando no hay rango manual", () => {
    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    const oldDate = new Date(today);
    oldDate.setMonth(oldDate.getMonth() - 3);

    mocks.useRecord.mockReturnValue({
      records: [buildRecord("current", currentDate), buildRecord("old", oldDate.toISOString().slice(0, 10))],
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

    expect(result.current.hasManualDateRange).toBe(false);
    expect(result.current.recordsByPeriod.some((record) => record.id === "current")).toBe(true);
    expect(result.current.recordsByPeriod.some((record) => record.id === "old")).toBe(false);
  });

  it("prioriza rango manual de fechas sobre el periodo rapido", () => {
    const manualDate = "2024-01-20";

    mocks.useRecord.mockReturnValue({
      records: [buildRecord("manual", manualDate), buildRecord("outside", "2026-01-05")],
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
    });

    const { result } = renderHook(() => useRecordsFiltering(), {
      wrapper: createRouterWrapper(`/records?dateFrom=${manualDate}&dateTo=${manualDate}`),
    });

    expect(result.current.hasManualDateRange).toBe(true);
    expect(result.current.effectiveSummaryPeriod).toBeNull();
    expect(result.current.recordsByPeriod).toHaveLength(1);
    expect(result.current.recordsByPeriod[0].id).toBe("manual");
  });

  it("al cambiar branch limpia jobPositionId en los search params", async () => {
    const { result } = renderHook(() => useRecordsFiltering(), {
      wrapper: createRouterWrapper("/records?branchId=branch-1&jobPositionId=job-1"),
    });

    act(() => {
      result.current.handleFilterChange("branchId", "branch-2");
    });

    await waitFor(() => {
      expect(result.current.filters.branchId).toBe("branch-2");
      expect(result.current.filters.jobPositionId).toBe("");
    });
  });

  it("construye query filters y los envia a useRecord", () => {
    renderHook(() => useRecordsFiltering(), {
      wrapper: createRouterWrapper(
        "/records?branchId=branch-1&jobPositionId=job-1&jobProfileId=profile-1&dateFrom=2026-04-01&dateTo=2026-04-30"
      ),
    });

    expect(mocks.useRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        branchId: "branch-1",
        jobPositionId: "job-1",
        jobProfileId: "profile-1",
        dateFrom: "2026-04-01",
        dateTo: "2026-04-30",
      })
    );
  });
});
