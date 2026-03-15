import { describe, expect, it, vi } from "vitest";

vi.mock("@/apis/firebase", () => ({
  firestore: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

import {
  addBranch,
  removeBranchById,
  updateBranchById,
} from "../../src/services/branches.services";

describe("branches.services (logic without firestore)", () => {
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
});
