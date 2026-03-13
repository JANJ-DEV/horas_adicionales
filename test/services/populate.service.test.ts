import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Firestore } from "firebase/firestore";

const firestoreMocks = vi.hoisted(() => ({
  collectionMock: vi.fn(),
  docMock: vi.fn(),
  setDocMock: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: firestoreMocks.collectionMock,
  doc: firestoreMocks.docMock,
  setDoc: firestoreMocks.setDocMock,
}));

import {
  COLLECTIONS,
  populateBranchesCatalog,
  populateCollectionFromFirstLevel,
  populateJobsPositions,
  populateUtilities,
} from "../../src/services/populate.service";

describe("populate.service", () => {
  const fakeDb = {} as Firestore;

  beforeEach(() => {
    vi.clearAllMocks();

    firestoreMocks.collectionMock.mockImplementation((_db: unknown, ...segments: string[]) =>
      segments.join("/")
    );
    firestoreMocks.docMock.mockImplementation((ref: string, id: string) => `${ref}:${id}`);
    firestoreMocks.setDocMock.mockResolvedValue(undefined);
  });

  it("populateCollectionFromFirstLevel falla si jsonData no es objeto", async () => {
    await expect(populateCollectionFromFirstLevel(fakeDb, "x", null)).rejects.toThrow(
      "El JSON debe ser un objeto en el primer nivel."
    );
  });

  it("populateCollectionFromFirstLevel no escribe nada con objeto vacio", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await populateCollectionFromFirstLevel(fakeDb, "branches", {});

    expect(firestoreMocks.setDocMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("populateJobsPositions usa jobsPositions como wrapper y persiste docs", async () => {
    await populateJobsPositions(fakeDb, {
      jobsPositions: {
        "COM-01-01": { name: "Puesto" },
      },
    });

    expect(firestoreMocks.collectionMock).toHaveBeenCalled();
    expect(firestoreMocks.setDocMock).toHaveBeenCalledTimes(1);
  });

  it("populateUtilities valida estructura y persiste 3 documentos", async () => {
    await populateUtilities(fakeDb, {
      utilities: {
        global_utilities: ["night", "holiday"],
        branch_utilities: { "COM-01": ["night"] },
        utility_definitions: { night: { label: "Nocturnidad" } },
      },
    });

    expect(firestoreMocks.collectionMock).toHaveBeenCalledWith(fakeDb, COLLECTIONS.UTILITIES);
    expect(firestoreMocks.setDocMock).toHaveBeenCalledTimes(3);
  });

  it("populateUtilities falla si global_utilities no es arreglo", async () => {
    await expect(
      populateUtilities(fakeDb, {
        utilities: {
          global_utilities: {},
          branch_utilities: {},
          utility_definitions: {},
        },
      })
    ).rejects.toThrow("utilities.global_utilities debe ser un arreglo.");
  });

  it("populateBranchesCatalog falla cuando hay jobs sin rama valida", async () => {
    await expect(
      populateBranchesCatalog(
        fakeDb,
        { branches: { "COM-01": { name: "Comercial" } } },
        { jobsPositions: { INVALID: { name: "Sin rama" } } }
      )
    ).rejects.toThrow("jobs sin rama válida");
  });
});
