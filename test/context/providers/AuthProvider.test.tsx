import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const providerInstances: Array<{ setCustomParameters: ReturnType<typeof vi.fn> }> = [];

  class MockGoogleAuthProvider {
    public setCustomParameters = vi.fn();

    constructor() {
      providerInstances.push(this);
    }
  }

  return {
    providerInstances,
    GoogleAuthProvider: MockGoogleAuthProvider,
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    toastSuccess: vi.fn(),
    toastInfo: vi.fn(),
    toastError: vi.fn(),
    authFirebase: {},
  };
});

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: mocks.GoogleAuthProvider,
  onAuthStateChanged: mocks.onAuthStateChanged,
  signInWithPopup: mocks.signInWithPopup,
  signOut: mocks.signOut,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mocks.toastSuccess,
    info: mocks.toastInfo,
    error: mocks.toastError,
  },
}));

vi.mock("@/apis/firebase", () => ({
  authFirebase: mocks.authFirebase,
}));

import useAuth from "../../../src/context/hooks/auth.hook";
import AuthProvider from "../../../src/context/providers/AuthProvider";

const wrapper = ({ children }: PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;

describe("AuthProvider", () => {
  it("sincroniza auth state y permite login exitoso", async () => {
    const fakeUser = { uid: "user-1", displayName: "Juan" };

    mocks.onAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: unknown) => void) => {
        callback(fakeUser);
        return vi.fn();
      }
    );
    mocks.signInWithPopup.mockResolvedValue({ user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current.currentUser).toEqual(fakeUser);

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(mocks.providerInstances[0].setCustomParameters).toHaveBeenCalledWith({
      prompt: "select_account",
    });
    expect(mocks.signInWithPopup).toHaveBeenCalled();
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Signed in with Google successfully", {
      containerId: "global",
      autoClose: 1500,
    });
    expect(mocks.toastInfo).toHaveBeenCalledWith("Bienvenido Juan", {
      containerId: "global",
      autoClose: 3000,
      delay: 1500,
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("marca error cuando falla el login y delega signOut", async () => {
    mocks.onAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: unknown) => void) => {
        callback(null);
        return vi.fn();
      }
    );
    mocks.signInWithPopup.mockRejectedValue({ message: "boom" });
    mocks.signOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.isError).toBe(true);
    expect(mocks.toastError).toHaveBeenCalledWith("boom", {
      containerId: "global",
    });

    await act(async () => {
      result.current.signOutGoogle();
      await Promise.resolve();
    });

    expect(mocks.signOut).toHaveBeenCalled();
    expect(mocks.toastInfo).toHaveBeenCalledWith("Sesión cerrada, te esperamos pronto 😘😘", {
      containerId: "global",
      autoClose: 2000,
    });
  });
});
