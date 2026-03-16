import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import type { UtilitiesCatalog } from "../../../src/services/utilities.service";

const mocks = vi.hoisted(() => ({
  subscribeToUtilities: vi.fn(),
  createUtility: vi.fn(),
  updateUtilityById: vi.fn(),
  deleteUtilityById: vi.fn(),
  getUtilityById: vi.fn(),
  getUtilityByNameTool: vi.fn(),
  getActiveUtilityIdsForProfile: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: mocks.toastError,
  },
}));

vi.mock("@/services/utilities.service", () => ({
  subscribeToUtilities: mocks.subscribeToUtilities,
  createUtility: mocks.createUtility,
  updateUtilityById: mocks.updateUtilityById,
  deleteUtilityById: mocks.deleteUtilityById,
  getUtilityById: mocks.getUtilityById,
  getUtilityByNameTool: mocks.getUtilityByNameTool,
  getActiveUtilityIdsForProfile: mocks.getActiveUtilityIdsForProfile,
}));

import useUtilities from "../../../src/context/hooks/useUtilities.hook";
import UtilitiesProvider from "../../../src/context/providers/UtilitiesProvider";

const baseCatalog: UtilitiesCatalog = {
  global_utilities: ["night"],
  branch_utilities: {
    "branch-1": {
      default: ["route"],
      specific_jobs: {
        "job-1": ["bonus"],
      },
    },
  },
  utility_definitions: {
    night: { label: "Nocturnidad", type: "number" },
    route: { label: "Ruta", type: "text" },
    bonus: { label: "Bono", type: "number" },
  },
};

const wrapper = ({ children }: PropsWithChildren) => (
  <UtilitiesProvider>{children}</UtilitiesProvider>
);

describe("UtilitiesProvider", () => {
  it("carga catalogo, deriva utilidades activas y permite crear/actualizar/borrar", async () => {
    mocks.subscribeToUtilities.mockImplementation(
      (onSuccess: (catalog: UtilitiesCatalog) => void) => {
        onSuccess(baseCatalog);
        return vi.fn();
      }
    );
    mocks.getActiveUtilityIdsForProfile.mockImplementation(
      (catalog, branchId: string | null, jobId: string | null) => {
        const ids = [...catalog.global_utilities];

        if (branchId === "branch-1") ids.push("route");
        if (branchId === "branch-1" && jobId === "job-1") ids.push("bonus");

        return ids;
      }
    );
    mocks.getUtilityById.mockImplementation((utilityId: string, catalog: UtilitiesCatalog) => {
      return catalog.utility_definitions[utilityId] ?? null;
    });
    mocks.getUtilityByNameTool.mockImplementation(
      (utilityName: string, catalog: UtilitiesCatalog) => {
        return catalog.utility_definitions[utilityName] ?? null;
      }
    );
    mocks.createUtility.mockResolvedValue({ label: "Peaje", type: "number" });
    mocks.updateUtilityById.mockResolvedValue({ label: "Ruta editada", type: "text" });
    mocks.deleteUtilityById.mockResolvedValue(true);

    const { result } = renderHook(() => useUtilities(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingUtilities).toBe(false);
    });

    expect(result.current.catalog.utility_definitions.night).toEqual({
      label: "Nocturnidad",
      type: "number",
    });
    expect(result.current.activeUtilityIds).toEqual(["night"]);

    act(() => {
      result.current.setSelectedProfileContext("branch-1", "job-1");
    });

    expect(result.current.activeUtilityIds).toEqual(["night", "route", "bonus"]);
    expect(result.current.getUtilityById("route")).toEqual({ label: "Ruta", type: "text" });
    expect(result.current.getUtilityByNameTool("bonus")).toEqual({ label: "Bono", type: "number" });

    await act(async () => {
      await result.current.createUtility("toll", { label: "Peaje", type: "number" });
    });

    expect(result.current.catalog.utility_definitions.toll).toEqual({
      label: "Peaje",
      type: "number",
    });

    await act(async () => {
      await result.current.updateUtilityById("route", { label: "Ruta editada" });
    });

    expect(result.current.catalog.utility_definitions.route).toEqual({
      label: "Ruta editada",
      type: "text",
    });

    await act(async () => {
      await result.current.deleteUtilityById("bonus");
    });

    expect(result.current.catalog.utility_definitions.bonus).toBeUndefined();
  });

  it("marca error cuando falla la suscripcion", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.subscribeToUtilities.mockImplementation(
      (_onSuccess: unknown, onError: (error: Error) => void) => {
        onError(new Error("boom"));
        return vi.fn();
      }
    );
    mocks.getActiveUtilityIdsForProfile.mockReturnValue([]);

    const { result } = renderHook(() => useUtilities(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingUtilities).toBe(false);
    });

    expect(result.current.isErrorUtilities).toBe(true);
    expect(mocks.toastError).toHaveBeenCalledWith("Error al cargar utilidades", {
      containerId: "global",
      autoClose: 2000,
      closeButton: false,
      closeOnClick: true,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en UtilitiesProvider.subscribeToUtilities: boom"
    );
  });
});
