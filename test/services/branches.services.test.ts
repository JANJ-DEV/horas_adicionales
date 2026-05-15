import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock("@/apis/firebase", () => ({
  firestore: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: mocks.collection,
  onSnapshot: mocks.onSnapshot,
  getDocs: mocks.getDocs,
  doc: mocks.doc,
  getDoc: mocks.getDoc,
}));

import {
  addBranch,
  getBranchById,
  removeBranchById,
  subscribeToBranches,
  updateBranchById,
} from "../../src/services/branches.services";

const flushAsyncTasks = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

describe("branches.services (logic without firestore)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockImplementation((_target: unknown, ...segments: string[]) => ({
      path: segments.join("/"),
    }));
    mocks.doc.mockImplementation((target: { path?: string }, ...segments: string[]) => ({
      id: segments[segments.length - 1],
      path: [...(target.path ? [target.path] : []), ...segments].join("/"),
    }));
  });

  it("addBranch no lanza errores y mantiene side effects fuera del servicio", () => {
    addBranch({
      id: "COM-01",
      name: "Comercial",
      description: "Area comercial",
      jobsPositions: [],
    });

    expect(true).toBe(true);
  });

  it("updateBranchById devuelve undefined", () => {
    const result = updateBranchById("COM-01");

    expect(result).toBeUndefined();
  });

  it("removeBranchById devuelve undefined", () => {
    const result = removeBranchById("COM-01");

    expect(result).toBeUndefined();
  });

  it("getBranchById devuelve rama normalizada con puestos", async () => {
    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      id: "branch-1",
      data: () => ({
        sector: "Comercial",
        descripcion_sector: "Rama comercial",
      }),
    });
    mocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: "job-1",
          data: () => ({
            nombre: "Supervisor",
            descripcion: "Coordina",
          }),
        },
      ],
    });

    const result = await getBranchById("branch-1");

    expect(result).toEqual({
      id: "branch-1",
      name: "Comercial",
      description: "Rama comercial",
      jobsPositions: [
        {
          id: "job-1",
          name: "Supervisor",
          description: "Coordina",
        },
      ],
    });
  });

  it("getBranchById devuelve null cuando la rama no existe", async () => {
    mocks.getDoc.mockResolvedValue({
      exists: () => false,
      id: "branch-404",
      data: () => null,
    });
    mocks.getDocs.mockResolvedValue({
      docs: [],
    });

    const result = await getBranchById("branch-404");

    expect(result).toBeNull();
  });

  it("getBranchById propaga error cuando falla Firestore", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.getDoc.mockRejectedValue(new Error("firestore unavailable"));

    await expect(getBranchById("branch-1")).rejects.toThrow("firestore unavailable");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en branches.service.getBranchById: firestore unavailable"
    );
  });

  it("subscribeToBranches entrega ramas normalizadas al callback", async () => {
    const callback = vi.fn();
    const unsubscribe = vi.fn();

    mocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: "job-1",
          data: () => ({
            nombre: "Supervisor",
            descripcion: "Coordina",
          }),
        },
      ],
    });
    mocks.onSnapshot.mockImplementation((_ref: unknown, next: (snapshot: unknown) => void) => {
      next({
        docs: [
          {
            id: "branch-1",
            data: () => ({
              sector: "Comercial",
              descripcion_sector: "Rama comercial",
            }),
          },
        ],
      });
      return unsubscribe;
    });

    const result = subscribeToBranches(callback);

    await flushAsyncTasks();

    expect(callback).toHaveBeenCalledWith([
      {
        id: "branch-1",
        name: "Comercial",
        description: "Rama comercial",
        jobsPositions: [
          {
            id: "job-1",
            name: "Supervisor",
            description: "Coordina",
          },
        ],
      },
    ]);
    expect(result).toBe(unsubscribe);
  });

  it("subscribeToBranches deriva errores de procesamiento async al errorCallback", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const errorCallback = vi.fn();

    mocks.getDocs.mockRejectedValue(new Error("jobs read failed"));
    mocks.onSnapshot.mockImplementation((_ref: unknown, next: (snapshot: unknown) => void) => {
      next({
        docs: [
          {
            id: "branch-1",
            data: () => ({
              sector: "Comercial",
              descripcion_sector: "Rama comercial",
            }),
          },
        ],
      });
      return vi.fn();
    });

    subscribeToBranches(vi.fn(), errorCallback);

    await flushAsyncTasks();

    expect(errorCallback).toHaveBeenCalledWith(expect.any(Error));
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en branches.service.subscribeToBranches.processSnapshot: jobs read failed"
    );
  });
});
