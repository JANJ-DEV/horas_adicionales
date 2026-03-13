import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Btn from "../../src/components/Btn";

describe("Btn component", () => {
  it("renderiza el label cuando no hay children", () => {
    render(<Btn label="Guardar" />);

    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("prioriza children sobre label", () => {
    render(
      <Btn label="Guardar">
        <span>Custom</span>
      </Btn>
    );

    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Guardar" })).not.toBeInTheDocument();
  });

  it("ejecuta onClick cuando se hace click", () => {
    const onClick = vi.fn();
    render(<Btn label="Guardar" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respeta type y title", () => {
    render(<Btn label="Enviar" type="submit" title="Enviar formulario" />);

    const button = screen.getByRole("button", { name: "Enviar" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("title", "Enviar formulario");
  });

  it("queda deshabilitado cuando formState es true", () => {
    render(<Btn label="Guardando..." formState={true} />);

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
  });
});
