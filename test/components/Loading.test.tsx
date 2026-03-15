import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "../../src/components/Loading";

describe("Loading component", () => {
  it("usa variante load por defecto", () => {
    const { container } = render(<Loading />);

    const wrapper = container.firstElementChild as HTMLElement;
    const icon = container.querySelector("svg");

    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toContain("animate-spin");
    expect(icon).toBeTruthy();
    expect(icon?.classList.contains("text-[var(--accent)]")).toBe(true);
  });

  it("usa variante auth con estilo de color esperado", () => {
    const { container } = render(<Loading variant="auth" />);

    const wrapper = container.firstElementChild as HTMLElement;
    const icon = container.querySelector("svg");

    expect(wrapper.className).toContain("animate-ping");
    expect(icon).toBeTruthy();
    expect(icon?.classList.contains("text-[var(--accent-warm)]")).toBe(true);
  });

  it("respeta el size recibido", () => {
    const { container } = render(<Loading size={40} />);

    const icon = container.querySelector("svg");

    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("width")).toBe("40");
    expect(icon?.getAttribute("height")).toBe("40");
  });
});
