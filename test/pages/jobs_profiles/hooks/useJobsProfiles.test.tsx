import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  subscribeToJobProfiles: vi.fn(),
}));

vi.mock("../../../../src/context/hooks/auth.hook", () => ({
  default: mocks.useAuth,
}));

vi.mock("../../../../src/services/jobsProfile.service", () => ({
  subscribeToJobProfiles: mocks.subscribeToJobProfiles,
}));

import { useJobsProfiles } from "../../../../src/pages/jobs_profiles/hooks/useJobsProfiles";

describe("useJobsProfiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      currentUser: { uid: "user-1" },
    });
  });

  it("no marca error cuando no hay perfiles", async () => {
    mocks.subscribeToJobProfiles.mockImplementation((onUpdate: (profiles: unknown[]) => void) => {
      onUpdate([]);
      return vi.fn();
    });

    const { result } = renderHook(() => useJobsProfiles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.hasCurrentUser).toBe(true);
  });

  it("marca error solo cuando falla la suscripcion", async () => {
    mocks.subscribeToJobProfiles.mockImplementation(
      (
        _onUpdate: (profiles: unknown[]) => void,
        onError: (error: Error) => void,
        _onComplete: () => void
      ) => {
        onError(new Error("snapshot failed"));
        return vi.fn();
      }
    );

    const { result } = renderHook(() => useJobsProfiles());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("Error al cargar los perfiles de trabajo");
  });
});
