import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useUtilities: vi.fn(),
  useFetcher: vi.fn(),
  useNavigate: vi.fn(),
  subscribeToJobProfiles: vi.fn(),
  handleAppError: vi.fn(),
}));

vi.mock("../../../src/context/hooks/auth.hook", () => ({
  default: mocks.useAuth,
}));

vi.mock("../../../src/context/hooks/useUtilities.hook", () => ({
  default: mocks.useUtilities,
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useFetcher: mocks.useFetcher,
    useNavigate: mocks.useNavigate,
  };
});

vi.mock("@/services/jobsProfile.service", () => ({
  subscribeToJobProfiles: mocks.subscribeToJobProfiles,
}));

vi.mock("@/services/error.service", () => ({
  handleAppError: mocks.handleAppError,
}));

import { useAddRecord } from "../../../src/pages/records/hooks/useAddRecord";
import { getPendingSelectedRecordId } from "../../../src/pages/records/recordNavigation";

describe("useAddRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    mocks.useAuth.mockReturnValue({
      currentUser: { uid: "user-1" },
    });

    mocks.useUtilities.mockReturnValue({
      setSelectedProfileContext: vi.fn(),
    });

    mocks.useFetcher.mockReturnValue({
      Form: ({ children, ...props }: React.ComponentProps<"form">) => (
        <form {...props}>{children}</form>
      ),
      state: "idle",
      data: null,
    });

    mocks.useNavigate.mockReturnValue(vi.fn());
    mocks.subscribeToJobProfiles.mockImplementation((onUpdate: (profiles: unknown[]) => void) => {
      onUpdate([]);
      return vi.fn();
    });
  });

  it("redirige al detalle del registro recién creado y guarda su id para el retorno", async () => {
    const navigate = vi.fn();
    mocks.useNavigate.mockReturnValue(navigate);
    mocks.useFetcher.mockReturnValue({
      Form: ({ children, ...props }: React.ComponentProps<"form">) => (
        <form {...props}>{children}</form>
      ),
      state: "idle",
      data: {
        success: true,
        record: {
          id: "record-new-1",
        },
      },
    });

    renderHook(() => useAddRecord());

    await waitFor(() => {
      expect(getPendingSelectedRecordId()).toBe("record-new-1");
    });
    expect(navigate).toHaveBeenCalledWith("/records/details/record-new-1");
  });

  it("no redirige cuando la creación devuelve error", async () => {
    const navigate = vi.fn();
    mocks.useNavigate.mockReturnValue(navigate);
    mocks.useFetcher.mockReturnValue({
      Form: ({ children, ...props }: React.ComponentProps<"form">) => (
        <form {...props}>{children}</form>
      ),
      state: "idle",
      data: {
        error: "No se pudo guardar el registro",
      },
    });

    renderHook(() => useAddRecord());

    await waitFor(() => {
      expect(mocks.subscribeToJobProfiles).toHaveBeenCalled();
    });
    expect(getPendingSelectedRecordId()).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
