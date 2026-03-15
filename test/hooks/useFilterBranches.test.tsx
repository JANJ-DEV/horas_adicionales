import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toastInfo: vi.fn(),
  useBranches: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    info: mocks.toastInfo,
  },
}));

vi.mock("@/context/hooks/useBranches.hook.", () => ({
  default: mocks.useBranches,
}));

import { useFilterBranches } from "../../src/hooks/useFilterBranches";

describe("useFilterBranches", () => {
  it("actualiza rama y puesto seleccionados y notifica por toast", () => {
    mocks.useBranches.mockReturnValue({
      branches: [
        {
          id: "branch-1",
          name: "Comercial",
          description: "Rama comercial",
          jobsPositions: [
            { id: "job-1", name: "Supervisor", description: "Coordina" },
            { id: "job-2", name: "Analista", description: "Analiza" },
          ],
        },
      ],
    });

    const { result } = renderHook(() => useFilterBranches());

    act(() => {
      result.current.handlerOnChangeBranch({
        target: { value: "branch-1" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.selectedBranch).toBe("branch-1");
    expect(mocks.toastInfo).toHaveBeenCalledWith("Rama seleccionada: branch-1", {
      containerId: "profile",
      autoClose: 2000,
      closeButton: false,
      closeOnClick: true,
    });

    act(() => {
      result.current.handlerOnChangeJobPosition({
        target: { value: "job-2" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.selectedJobPosition).toBe("job-2");
    expect(mocks.toastInfo).toHaveBeenCalledWith("Puesto de trabajo seleccionado: job-2", {
      containerId: "profile",
      autoClose: 2000,
      closeButton: false,
      closeOnClick: true,
    });
  });

  it("resuelve nombres y puestos segun la rama seleccionada", () => {
    mocks.useBranches.mockReturnValue({
      branches: [
        {
          id: "branch-1",
          name: "Comercial",
          description: "Rama comercial",
          jobsPositions: [{ id: "job-1", name: "Supervisor", description: "Coordina" }],
        },
      ],
    });

    const { result } = renderHook(() => useFilterBranches());

    act(() => {
      result.current.setSelectedBranch("branch-1");
    });

    expect(result.current.getBranch("branch-1")).toEqual([
      { id: "job-1", name: "Supervisor", description: "Coordina" },
    ]);
    expect(result.current.getNameBranch("branch-1")).toBe("Comercial");
    expect(result.current.getJobPositionByBranch("job-1")).toEqual({
      id: "job-1",
      name: "Supervisor",
      description: "Coordina",
    });
    expect(result.current.getNameJobPosition("job-1")).toBe("Supervisor");
    expect(result.current.getJobPositionByBranch("missing-job")).toBeUndefined();
  });
});
