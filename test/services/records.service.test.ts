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
  writeBatch: vi.fn(),
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
  writeBatch: mocks.writeBatch,
  Timestamp: class Timestamp {},
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
  updateEstimatedHourlyRateByJobProfile,
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
    mocks.writeBatch.mockImplementation(() => ({
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue(undefined),
    }));
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
      (_ref: unknown, _next: unknown, error: (reason: Error) => void) => {
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

  it("saveRecord persiste payload con timestamps y devuelve el registro con id", async () => {
    const result = await saveRecord({
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
    expect(result).toEqual({
      id: "record-123",
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
  });

  it("getRecordById devuelve null cuando el documento no existe", async () => {
    mocks.getDoc.mockResolvedValue({
      exists: () => false,
      id: "record-404",
      data: () => null,
    });

    const result = await getRecordById("record-404");

    expect(result).toBeNull();
  });

  it("updateRecord actualiza el documento y agrega updatedAt", async () => {
    const result = await updateRecord("user-123", "record-1", {
      titleJobProfile: "Turno tarde",
    });

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { id: "record-1", path: "users/user-123/records/record-1" },
      {
        titleJobProfile: "Turno tarde",
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(result).toBe(true);
  });

  it("updateEstimatedHourlyRateByJobProfile sincroniza la tarifa en los registros relacionados", async () => {
    const batchUpdate = vi.fn();
    const batchCommit = vi.fn().mockResolvedValue(undefined);

    mocks.writeBatch.mockReturnValue({
      update: batchUpdate,
      commit: batchCommit,
    });
    mocks.getDocs.mockResolvedValue({
      docs: [
        {
          ref: { path: "users/user-123/records/record-1" },
          data: () => ({ jobProfileId: "profile-1" }),
        },
        {
          ref: { path: "users/user-123/records/record-2" },
          data: () => ({
            titleJobProfile: "Turno noche",
            branchId: "branch-1",
            jobPositionId: "job-1",
          }),
        },
        {
          ref: { path: "users/user-123/records/record-3" },
          data: () => ({ jobProfileId: "profile-2" }),
        },
      ],
    });

    const result = await updateEstimatedHourlyRateByJobProfile("profile-1", 22.5, {
      titleJobProfile: "Turno noche",
      branchId: "branch-1",
      jobPositionId: "job-1",
    });

    expect(mocks.getDocs).toHaveBeenCalledWith({ path: "users/user-123/records" });
    expect(batchUpdate).toHaveBeenNthCalledWith(
      1,
      { path: "users/user-123/records/record-1" },
      {
        estimatedHourlyRate: 22.5,
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(batchUpdate).toHaveBeenNthCalledWith(
      2,
      { path: "users/user-123/records/record-2" },
      {
        estimatedHourlyRate: 22.5,
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(batchCommit).toHaveBeenCalledTimes(1);
    expect(result).toBe(2);
  });

  it("updateEstimatedHourlyRateByJobProfile usa fallback para registros antiguos sin jobProfileId", async () => {
    const batchUpdate = vi.fn();
    const batchCommit = vi.fn().mockResolvedValue(undefined);

    mocks.writeBatch.mockReturnValue({
      update: batchUpdate,
      commit: batchCommit,
    });
    mocks.getDocs.mockResolvedValue({
      docs: [
        {
          ref: { path: "users/user-123/records/record-legacy" },
          data: () => ({
            titleJobProfile: "Perfil legacy",
            branchId: "branch-9",
            jobPositionId: "job-4",
          }),
        },
        {
          ref: { path: "users/user-123/records/record-other" },
          data: () => ({
            titleJobProfile: "Otro perfil",
            branchId: "branch-9",
            jobPositionId: "job-4",
          }),
        },
      ],
    });

    const result = await updateEstimatedHourlyRateByJobProfile("profile-legacy", 19, {
      titleJobProfile: "Perfil legacy",
      branchId: "branch-9",
      jobPositionId: "job-4",
    });

    expect(batchUpdate).toHaveBeenCalledTimes(1);
    expect(batchUpdate).toHaveBeenCalledWith(
      { path: "users/user-123/records/record-legacy" },
      {
        estimatedHourlyRate: 19,
        updatedAt: "SERVER_TIMESTAMP",
      }
    );
    expect(result).toBe(1);
  });

  it("updateEstimatedHourlyRateByJobProfile devuelve 0 cuando no hay registros a sincronizar", async () => {
    mocks.getDocs.mockResolvedValue({
      docs: [],
    });

    const result = await updateEstimatedHourlyRateByJobProfile("profile-1", 22.5);

    expect(result).toBe(0);
    expect(mocks.writeBatch).not.toHaveBeenCalled();
  });

  it("deleteRecord elimina el documento del usuario autenticado", async () => {
    const result = await deleteRecord("record-1");

    expect(mocks.deleteDoc).toHaveBeenCalledWith({
      id: "record-1",
      path: "users/user-123/records/record-1",
    });
    expect(result).toBe(true);
  });
});
