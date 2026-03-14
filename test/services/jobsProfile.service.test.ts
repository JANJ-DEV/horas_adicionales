import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  onSnapshot: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  authFirebase: {
    currentUser: { uid: "user-123" },
  } as { currentUser: { uid: string } | null },
  firestore: { app: "fake-db" },
}));

vi.mock("firebase/firestore", () => ({
  collection: mocks.collection,
  doc: mocks.doc,
  setDoc: mocks.setDoc,
  serverTimestamp: mocks.serverTimestamp,
  onSnapshot: mocks.onSnapshot,
  getDoc: mocks.getDoc,
  deleteDoc: mocks.deleteDoc,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("@/apis/firebase", () => ({
  authFirebase: mocks.authFirebase,
  firestore: mocks.firestore,
}));

import {
  deleteJobProfile,
  getJobProfileById,
  saveJobProfile,
  subscribeToJobProfiles,
  updateJobProfile,
} from "../../src/services/jobsProfile.service";

describe("jobsProfile.service", () => {
  afterEach(() => vi.restoreAllMocks());

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authFirebase.currentUser = { uid: "user-123" };
    mocks.serverTimestamp.mockReturnValue("SERVER_TIMESTAMP");
    mocks.collection.mockImplementation((_target: unknown, ...segments: string[]) => ({
      path: segments.join("/"),
    }));
    mocks.doc.mockImplementation((target: { path?: string }, ...segments: string[]) => {
      if (segments.length === 0) {
        return { id: "profile-123", path: `${target.path}/profile-123` };
      }

      return {
        id: segments[segments.length - 1],
        path: [...(target.path ? [target.path] : []), ...segments].join("/"),
      };
    });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      id: "profile-123",
      data: () => ({ title: "Perfil noche" }),
    });
    mocks.deleteDoc.mockResolvedValue(undefined);
    mocks.onSnapshot.mockReturnValue(vi.fn());
  });

  it("subscribeToJobProfiles transforma snapshots y devuelve unsubscribe", () => {
    const callback = vi.fn();
    const onError = vi.fn();
    const onComplete = vi.fn();
    const unsubscribe = vi.fn();

    mocks.onSnapshot.mockImplementation(
      (
        _ref: unknown,
        next: (snapshot: { docs: Array<{ id: string; data: () => unknown }> }) => void
      ) => {
        next({
          docs: [
            { id: "profile-1", data: () => ({ title: "Uno" }) },
            { id: "profile-2", data: () => ({ title: "Dos" }) },
          ],
        });
        return unsubscribe;
      }
    );

    const result = subscribeToJobProfiles(callback, onError, onComplete);

    expect(mocks.collection).toHaveBeenCalledWith(mocks.firestore, "users/user-123/jobsProfiles");
    expect(callback).toHaveBeenCalledWith([
      { id: "profile-1", title: "Uno" },
      { id: "profile-2", title: "Dos" },
    ]);
    expect(result).toBe(unsubscribe);
  });

  it("saveJobProfile devuelve toast de error si no hay usuario autenticado", async () => {
    mocks.authFirebase.currentUser = null;

    const result = await saveJobProfile({ title: "Perfil noche" } as never);

    expect(result).toBeUndefined();
    expect(mocks.toastError).toHaveBeenCalledWith("No hay un usuario autenticado", {
      containerId: "jobs-profiles",
    });
  });

  it("saveJobProfile persiste el payload y devuelve el perfil con id", async () => {
    const result = await saveJobProfile({
      title: "Perfil noche",
      estimatedHourlyRate: 20,
    } as never);

    expect(mocks.setDoc).toHaveBeenCalledWith(
      { id: "profile-123", path: "users/user-123/jobsProfiles/profile-123" },
      {
        id: "profile-123",
        title: "Perfil noche",
        estimatedHourlyRate: 20,
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Perfil de trabajo guardado correctamente ", {
      containerId: "job-profiles",
    });
    expect(result).toEqual({
      id: "profile-123",
      title: "Perfil noche",
      estimatedHourlyRate: 20,
    });
  });

  it("getJobProfileById devuelve null si no hay documento", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.getDoc.mockResolvedValue({
      exists: () => false,
      id: "profile-404",
      data: () => null,
    });

    const result = await getJobProfileById("profile-404");

    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "No se encontró el perfil de trabajo con ID:",
      "profile-404"
    );
  });

  it("updateJobProfile hace merge del payload y updatedAt", async () => {
    const result = await updateJobProfile("profile-1", {
      title: "Perfil tarde",
    });

    expect(mocks.setDoc).toHaveBeenCalledWith(
      { id: "profile-1", path: "users/user-123/jobsProfiles/profile-1" },
      {
        title: "Perfil tarde",
        updatedAt: "SERVER_TIMESTAMP",
      },
      { merge: true }
    );
    expect(result).toEqual({
      id: "profile-1",
      title: "Perfil tarde",
    });
  });

  it("deleteJobProfile elimina el documento y devuelve true", async () => {
    const result = await deleteJobProfile("profile-1");

    expect(mocks.deleteDoc).toHaveBeenCalledWith({
      id: "profile-1",
      path: "users/user-123/jobsProfiles/profile-1",
    });
    expect(result).toBe(true);
  });
});
