import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  onSnapshot: vi.fn(),
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
  getDocs: mocks.getDocs,
  getDoc: mocks.getDoc,
  deleteDoc: mocks.deleteDoc,
  updateDoc: mocks.updateDoc,
  onSnapshot: mocks.onSnapshot,
  Timestamp: class Timestamp {},
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
  deleteRecord,
  getRecordById,
  saveRecord,
  subscribeToRecords,
  updateRecord,
} from "../../src/services/records.service";

describe("records.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authFirebase.currentUser = { uid: "user-123" };
    mocks.serverTimestamp.mockReturnValue("SERVER_TIMESTAMP");
    mocks.collection.mockImplementation((_target: unknown, ...segments: string[]) => ({
      path: segments.join("/"),
    }));
    mocks.doc.mockImplementation((target: { path?: string }, ...segments: string[]) => {
      if (segments.length === 0) {
        return { id: "record-123", path: `${target.path}/record-123` };
      }

      return {
        id: segments[segments.length - 1],
        path: [...(target.path ? [target.path] : []), ...segments].join("/"),
      };
    });
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      id: "record-123",
      data: () => ({ titleJobProfile: "Turno noche" }),
    });
    mocks.deleteDoc.mockResolvedValue(undefined);
    mocks.updateDoc.mockResolvedValue(undefined);
    mocks.onSnapshot.mockReturnValue(vi.fn());
  });

  it("subscribeToRecords no se suscribe si no hay usuario autenticado", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.authFirebase.currentUser = null;

    const result = subscribeToRecords(vi.fn(), vi.fn(), vi.fn());

    expect(result).toBeUndefined();
    expect(mocks.onSnapshot).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("No hay un usuario autenticado");
  });

  it("subscribeToRecords transforma snapshots y devuelve unsubscribe", () => {
    const onUpdate = vi.fn();
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
            { id: "record-1", data: () => ({ titleJobProfile: "Uno" }) },
            { id: "record-2", data: () => ({ titleJobProfile: "Dos" }) },
          ],
        });
        return unsubscribe;
      }
    );

    const result = subscribeToRecords(onUpdate, onError, onComplete);

    expect(mocks.collection).toHaveBeenCalledWith(mocks.firestore, "users", "user-123", "records");
    expect(onUpdate).toHaveBeenCalledWith([
      { id: "record-1", titleJobProfile: "Uno" },
      { id: "record-2", titleJobProfile: "Dos" },
    ]);
    expect(result).toBe(unsubscribe);
  });

  it("subscribeToRecords propaga errores de onSnapshot", () => {
    const onUpdate = vi.fn();
    const onError = vi.fn();
    const onComplete = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const firestoreError = new Error("boom");

    mocks.onSnapshot.mockImplementation(
      (
        _ref: unknown,
        _next: unknown,
        error: (reason: Error) => void
      ) => {
        error(firestoreError);
        return vi.fn();
      }
    );

    subscribeToRecords(onUpdate, onError, onComplete);

    expect(onError).toHaveBeenCalledWith(firestoreError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error al suscribirse a registros:",
      firestoreError
    );
  });

  it("saveRecord no persiste si no hay usuario", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.authFirebase.currentUser = null;

    await saveRecord({
      titleJobProfile: "Turno noche",
      dateTimeRecord: "2026-03-14",
    });

    expect(mocks.setDoc).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("No hay un usuario autenticado");
  });

  it("saveRecord persiste payload con timestamps y lanza toast", async () => {
    await saveRecord({
      titleJobProfile: "Turno noche",
      dateTimeRecord: "2026-03-14",
      workStartTime: "08:00",
      workEndTime: "17:00",
      estimatedHourlyRate: 15,
      branchId: "branch-1",
      jobPositionId: "job-1",
      utilitiesValues: {
        extra_hours_total: 2,
      },
    });

    expect(mocks.setDoc).toHaveBeenCalledWith(
      { id: "record-123", path: "users/user-123/records/record-123" },
      {
        id: "record-123",
        jobProfileId: undefined,
        branchId: "branch-1",
        jobPositionId: "job-1",
        titleJobProfile: "Turno noche",
        dateTimeRecord: "2026-03-14",
        workStartTime: "08:00",
        workEndTime: "17:00",
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
        estimatedHourlyRate: 15,
        utilitiesValues: {
          extra_hours_total: 2,
        },
      }
    );
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Registro guardado con éxito", {
      containerId: "records",
    });
  });

  it("getRecordById devuelve null y toast cuando el documento no existe", async () => {
    mocks.getDoc.mockResolvedValue({
      exists: () => false,
      id: "record-404",
      data: () => null,
    });

    const result = await getRecordById("record-404");

    expect(result).toBeNull();
    expect(mocks.toastError).toHaveBeenCalledWith("No se encontró el documento", {
      containerId: "records",
    });
  });

  it("updateRecord actualiza el documento y agrega updatedAt", async () => {
    await updateRecord("user-123", "record-1", {
      titleJobProfile: "Turno tarde",
    });

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { id: "record-1", path: "users/user-123/records/record-1" },
      {
        titleJobProfile: "Turno tarde",
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Registro actualizado con éxito", {
      containerId: "records",
    });
  });

  it("deleteRecord elimina el documento del usuario autenticado", async () => {
    await deleteRecord("record-1");

    expect(mocks.deleteDoc).toHaveBeenCalledWith({
      id: "record-1",
      path: "users/user-123/records/record-1",
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Registro eliminado con éxito", {
      containerId: "records",
    });
  });
});