import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useAddRecord: vi.fn(),
  useUtilities: vi.fn(),
}));

vi.mock("../../../src/pages/records/hooks/useAddRecord", () => ({
  useAddRecord: mocks.useAddRecord,
}));

vi.mock("../../../src/context/hooks/useUtilities.hook", () => ({
  default: mocks.useUtilities,
}));

import AddNewRecord from "../../../src/pages/records/AddNewRecord";

const MockFetcherForm = ({ children, ...props }: React.ComponentProps<"form">) => (
  <form {...props}>{children}</form>
);

describe("AddNewRecord", () => {
  it("muestra estado de carga cuando hay usuario y perfiles cargando", () => {
    mocks.useAddRecord.mockReturnValue({
      jobProfiles: [],
      loading: true,
      selectedTitle: "",
      handleProfileChange: vi.fn(),
      hasCurrentUser: true,
      formAction: { Form: MockFetcherForm, state: "idle", data: null },
      estimatedHourlyRate: undefined,
      selectedBranchId: "",
      selectedJobPositionId: "",
    });
    mocks.useUtilities.mockReturnValue({
      activeUtilities: [],
      isLoadingUtilities: true,
    });

    render(<AddNewRecord />);

    expect(screen.getByText("Cargando perfiles...")).toBeInTheDocument();
    expect(screen.getByText("Cargando utilidades...")).toBeInTheDocument();
  });

  it("renderiza utilidades seleccionables y crea campos dinamicos segun el tipo", () => {
    const handleProfileChange = vi.fn();

    mocks.useAddRecord.mockReturnValue({
      jobProfiles: [{ id: "profile-1", title: "Turno noche" }],
      loading: false,
      selectedTitle: "Turno noche",
      handleProfileChange,
      hasCurrentUser: true,
      formAction: { Form: MockFetcherForm, state: "idle", data: null },
      estimatedHourlyRate: 18.5,
      selectedBranchId: "branch-1",
      selectedJobPositionId: "job-1",
    });
    mocks.useUtilities.mockReturnValue({
      isLoadingUtilities: false,
      activeUtilities: [
        { id: "comment_box", definition: { label: "Comentarios", type: "textarea" } },
        { id: "night_bonus", definition: { label: "Nocturnidad", type: "number", required: true } },
        {
          id: "vehicle_type",
          definition: { label: "Vehículo", type: "select", options: ["Camión", "Furgón"] },
        },
      ],
    });

    const { container } = render(<AddNewRecord />);

    fireEvent.change(screen.getByRole("combobox", { name: /Perfil/ }), {
      target: { value: "profile-1" },
    });

    expect(handleProfileChange).toHaveBeenCalledTimes(1);
    expect(container.querySelector("#titleJobProfile")).toHaveAttribute("value", "Turno noche");
    expect(container.querySelector("#estimatedHourlyRate")).toHaveAttribute("value", "18.5");
    expect(container.querySelector("#branchId")).toHaveAttribute("value", "branch-1");
    expect(container.querySelector("#jobPositionId")).toHaveAttribute("value", "job-1");

    fireEvent.click(screen.getByRole("checkbox", { name: "Comentarios" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Nocturnidad" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Vehículo" }));

    expect(container.querySelector("#utility__comment_box")).toBeInTheDocument();
    expect(container.querySelector("#utility__night_bonus")).toHaveAttribute("type", "number");
    expect(container.querySelector("#utility__night_bonus")).toBeRequired();
    expect(container.querySelector("#utility__vehicle_type")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Camión" })).toBeInTheDocument();
  });

  it("muestra mensajes de error y exito desde el fetcher", () => {
    mocks.useAddRecord.mockReturnValue({
      jobProfiles: [],
      loading: false,
      selectedTitle: "Perfil demo",
      handleProfileChange: vi.fn(),
      hasCurrentUser: false,
      formAction: {
        Form: MockFetcherForm,
        state: "idle",
        data: { error: "Todos los campos son requeridos", titleJobProfile: "Perfil demo" },
      },
      estimatedHourlyRate: undefined,
      selectedBranchId: "",
      selectedJobPositionId: "",
    });
    mocks.useUtilities.mockReturnValue({
      activeUtilities: [],
      isLoadingUtilities: false,
    });

    const { rerender } = render(<AddNewRecord />);

    expect(screen.getByText("Todos los campos son requeridos")).toBeInTheDocument();
    // Cuando hay error, el mensaje de éxito no debe aparecer
    expect(
      screen.queryByText("Registro para Perfil demo guardado con éxito.")
    ).not.toBeInTheDocument();

    mocks.useAddRecord.mockReturnValue({
      jobProfiles: [],
      loading: false,
      selectedTitle: "Perfil demo",
      handleProfileChange: vi.fn(),
      hasCurrentUser: false,
      formAction: {
        Form: MockFetcherForm,
        state: "submitting",
        data: { success: true, titleJobProfile: "Perfil demo" },
      },
      estimatedHourlyRate: undefined,
      selectedBranchId: "",
      selectedJobPositionId: "",
    });

    rerender(<AddNewRecord />);

    expect(
      screen.queryByText("Registro para Perfil demo guardado con éxito.")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
  });
});
