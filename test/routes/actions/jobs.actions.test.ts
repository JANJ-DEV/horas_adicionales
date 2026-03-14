import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router";

const mocks = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  updateAccount: vi.fn(),
  uploadFile: vi.fn(),
  getBranchById: vi.fn(),
  getJobPositionFromBranchId: vi.fn(),
  saveJobProfile: vi.fn(),
  authFirebase: {
    currentUser: {
      photoURL: "https://example.com/current-photo.jpg",
    },
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}));

vi.mock("@/services/auth.service", () => ({
  updateAccount: mocks.updateAccount,
}));

vi.mock("@/services/uploadFile.service", () => ({
  uploadFile: mocks.uploadFile,
}));

vi.mock("@/apis/firebase", () => ({
  authFirebase: mocks.authFirebase,
}));

vi.mock("@/services/branches.services", () => ({
  getBranchById: mocks.getBranchById,
}));

vi.mock("@/services/jobsPositions.service", () => ({
  getJobPositionFromBranchId: mocks.getJobPositionFromBranchId,
}));

vi.mock("@/services/jobsProfile.service", () => ({
  saveJobProfile: mocks.saveJobProfile,
}));

import { add, update } from "../../../src/routes/actions/jobs.actions";

const buildRequest = (entries: Array<[string, string]>) => {
  const formData = new FormData();

  entries.forEach(([key, value]) => {
    formData.append(key, value);
  });

  return new Request("http://localhost/jobs-profiles/add", {
    method: "POST",
    body: formData,
  });
};

const buildActionArgs = (request: Request, unstablePattern: string): ActionFunctionArgs => ({
  request,
  params: {},
  context: undefined,
  unstable_pattern: unstablePattern,
});

const setUploadInput = (file?: File) => {
  document.body.innerHTML = '<input id="uploadPhoto" type="file" />';
  const input = document.querySelector("#uploadPhoto") as HTMLInputElement;

  Object.defineProperty(input, "files", {
    configurable: true,
    value: file ? [file] : [],
  });
};

describe("jobs.actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    mocks.authFirebase.currentUser = {
      photoURL: "https://example.com/current-photo.jpg",
    };
    mocks.getBranchById.mockResolvedValue({
      id: "branch-1",
      name: "Comercial",
      description: "Rama comercial",
    });
    mocks.getJobPositionFromBranchId.mockResolvedValue({
      id: "job-1",
      name: "Supervisor",
      description: "Coordina operaciones",
    });
    mocks.saveJobProfile.mockImplementation(async (payload) => payload);
    mocks.updateAccount.mockResolvedValue(undefined);
    mocks.uploadFile.mockResolvedValue("https://example.com/uploaded-photo.jpg");
  });

  it("add valida campos requeridos antes de consultar servicios", async () => {
    const result = await add(
      buildActionArgs(
        buildRequest([
          ["title", ""],
          ["branch", "branch-1"],
          ["jobPosition", "job-1"],
          ["estimatedHourlyRate", "12.5"],
        ]),
        "/jobs-profiles/add"
      )
    );

    expect(result).toBeUndefined();
    expect(mocks.toastError).toHaveBeenCalledWith("Todos los campos son requeridos", {
      containerId: "jobs-profiles",
    });
    expect(mocks.getBranchById).not.toHaveBeenCalled();
    expect(mocks.saveJobProfile).not.toHaveBeenCalled();
  });

  it("add construye el perfil y devuelve success", async () => {
    const result = await add(
      buildActionArgs(
        buildRequest([
          ["title", "Turno noche"],
          ["branch", "branch-1"],
          ["jobPosition", "job-1"],
          ["estimatedHourlyRate", "12.5"],
        ]),
        "/jobs-profiles/add"
      )
    );

    expect(mocks.getBranchById).toHaveBeenCalledWith("branch-1");
    expect(mocks.getJobPositionFromBranchId).toHaveBeenCalledWith("job-1", "branch-1");
    expect(mocks.saveJobProfile).toHaveBeenCalledWith({
      title: "Turno noche",
      branch: {
        id: "branch-1",
        name: "Comercial",
        description: "Rama comercial",
      },
      jobPosition: {
        id: "job-1",
        name: "Supervisor",
        description: "Coordina operaciones",
      },
      estimatedHourlyRate: 12.5,
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Perfil de trabajo guardado correctamente ", {
      containerId: "jobs-profiles",
    });
    expect(result).toEqual({
      success: true,
      message: "Perfil de trabajo guardado correctamente",
      jobProfile: {
        title: "Turno noche",
        branch: {
          id: "branch-1",
          name: "Comercial",
          description: "Rama comercial",
        },
        jobPosition: {
          id: "job-1",
          name: "Supervisor",
          description: "Coordina operaciones",
        },
        estimatedHourlyRate: 12.5,
      },
    });
  });

  it("update rechaza displayName vacio", async () => {
    const result = await update(
      buildActionArgs(buildRequest([["displayName", ""]]), "/account/update")
    );

    expect(result).toEqual({
      error: "El nombre de usuario es requerido",
    });
    expect(mocks.toastError).toHaveBeenCalledWith("El nombre de usuario es requerido", {
      containerId: "global",
    });
    expect(mocks.updateAccount).not.toHaveBeenCalled();
  });

  it("update usa updateAccount sin upload cuando no hay archivo", async () => {
    setUploadInput();

    const result = await update(
      buildActionArgs(
        buildRequest([
          ["displayName", "Juan"],
          ["photoURL", ""],
        ]),
        "/account/update"
      )
    );

    expect(mocks.updateAccount).toHaveBeenCalledWith({ displayName: "Juan" });
    expect(mocks.uploadFile).not.toHaveBeenCalled();
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Cuenta actualizada correctamente", {
      containerId: "global",
    });
    expect(result).toEqual({
      success: true,
      message: "Cuenta actualizada correctamente",
      displayName: "Juan",
      photoURL: "https://example.com/current-photo.jpg",
    });
  });

  it("update sube archivo y actualiza cuenta con la nueva url", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    setUploadInput(file);

    const result = await update(
      buildActionArgs(
        buildRequest([
          ["displayName", "Juan"],
          ["photoURL", ""],
        ]),
        "/account/update"
      )
    );

    expect(mocks.uploadFile).toHaveBeenCalledWith(file);
    expect(mocks.updateAccount).toHaveBeenCalledWith({
      displayName: "Juan",
      photoURL: "https://example.com/uploaded-photo.jpg",
    });
    expect(result).toEqual({
      success: true,
      message: "Cuenta actualizada correctamente",
      displayName: "Juan",
      photoURL: "https://example.com/uploaded-photo.jpg",
    });
  });

  it("update devuelve error si falla la actualizacion", async () => {
    setUploadInput();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.updateAccount.mockRejectedValue(new Error("boom"));

    const result = await update(
      buildActionArgs(
        buildRequest([
          ["displayName", "Juan"],
          ["photoURL", ""],
        ]),
        "/account/update"
      )
    );

    expect(result).toEqual({
      error: "Error al actualizar la cuenta",
    });
    expect(mocks.toastError).toHaveBeenCalledWith("Error al actualizar la cuenta", {
      containerId: "global",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
