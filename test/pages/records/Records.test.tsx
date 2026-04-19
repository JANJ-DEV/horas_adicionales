import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

const mocks = vi.hoisted(() => ({
  useRecord: vi.fn(),
  subscribeToBranches: vi.fn(),
  subscribeToJobProfiles: vi.fn(),
  useInfiniteScroll: vi.fn(),
}));

vi.mock("../../../src/pages/records/hooks/useRecord", () => ({
  useRecord: mocks.useRecord,
}));

vi.mock("@/services/branches.services", () => ({
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

vi.mock("../../../src/pages/records/components/RecordListItem", () => ({
  default: ({ record }: { record: { titleJobProfile: string } }) => (
    <article>{record.titleJobProfile}</article>
  ),
}));

vi.mock("../../../src/pages/records/components/RecordCard", () => ({
  default: ({ record }: { record: { titleJobProfile: string } }) => (
    <article>{record.titleJobProfile}</article>
  ),
}));

import Records from "../../../src/pages/records/Records";
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

  it("restaura el scroll al registro seleccionado aunque quede fuera del primer bloque visible", async () => {
    const records = Array.from({ length: 10 }, (_, index) => buildRecord(`record-${index + 1}`));

    mocks.useRecord.mockReturnValue({
      records,
      isLoading: false,
      isError: false,
      errorMessage: null,
      hasCurrentUser: true,
      handleDeleteRecord: vi.fn(),
      handlerViewDetails: vi.fn(),
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
