import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toastInfo: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    info: mocks.toastInfo,
    error: mocks.toastError,
  },
}));

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

import { addBranch, removeBranchById, updateBranchById } from "@/services/branches.services";

describe("branches.services (logic without firestore)", () => {
  it("addBranch lanza toast informativo con nombre de rama", () => {
    addBranch({
      id: "COM-01",
      name: "Comercial",
      description: "Area comercial",
      jobsPositions: [],
    });

    expect(mocks.toastInfo).toHaveBeenCalledWith(
      "Se ha agregado la rama: Comercial ",
      { containerId: "global" }
    );
  });

  it("updateBranchById devuelve undefined y lanza toast", () => {
    const result = updateBranchById("COM-01");

    expect(result).toBeUndefined();
    expect(mocks.toastInfo).toHaveBeenCalledWith(
      "Se ha actualizado la rama con ID: COM-01 ",
      { containerId: "global" }
    );
  });

  it("removeBranchById devuelve undefined y lanza toast", () => {
    const result = removeBranchById("COM-01");

    expect(result).toBeUndefined();
    expect(mocks.toastInfo).toHaveBeenCalledWith(
      "Se ha eliminado la rama con ID: COM-01 ",
      { containerId: "global" }
    );
  });
});
