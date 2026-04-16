import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useNavigate: vi.fn(),
  subscribeToRecords: vi.fn(),
  deleteRecord: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  handleAppError: vi.fn(),
}));

vi.mock("../../../src/context/hooks/auth.hook", () => ({
  default: mocks.useAuth,
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: mocks.useNavigate,
  };
});

vi.mock("@/services/records.service", () => ({
  subscribeToRecords: mocks.subscribeToRecords,
  deleteRecord: mocks.deleteRecord,
}));

vi.mock("@/services/toast.service", () => ({
  notify: {
    success: mocks.notifySuccess,
    error: mocks.notifyError,
  },
  TOAST_SCOPE: {
    RECORDS: "records",
  },
}));

vi.mock("@/services/error.service", () => ({
  handleAppError: mocks.handleAppError,
}));

import { useRecord } from "../../../src/pages/records/hooks/useRecord";
import { getPendingSelectedRecordId } from "../../../src/pages/records/recordNavigation";

describe("useRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    mocks.useAuth.mockReturnValue({
      currentUser: { uid: "user-1" },
    });

    mocks.useNavigate.mockReturnValue(vi.fn());
    mocks.subscribeToRecords.mockImplementation((onUpdate: (records: unknown[]) => void) => {
      onUpdate([]);
      return vi.fn();
    });
    mocks.deleteRecord.mockResolvedValue(true);
  });

  it("guarda el registro seleccionado antes de navegar al detalle", () => {
    const navigate = vi.fn();
    mocks.useNavigate.mockReturnValue(navigate);

    const { result } = renderHook(() => useRecord());

    result.current.handlerViewDetails("record-42");

    expect(getPendingSelectedRecordId()).toBe("record-42");
    expect(navigate).toHaveBeenCalledWith("/records/details/record-42");
  });
});
