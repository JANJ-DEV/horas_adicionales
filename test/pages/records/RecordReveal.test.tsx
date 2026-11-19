import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import RecordReveal from "../../../src/pages/records/components/RecordReveal";

afterEach(() => vi.unstubAllGlobals());

it("revela la tarjeta una sola vez cuando entra en pantalla", () => {
  let callback: IntersectionObserverCallback | undefined;
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(handler: IntersectionObserverCallback) {
        callback = handler;
      }
      observe() {}
      unobserve = unobserve;
      disconnect = disconnect;
    }
  );
  const { unmount } = render(
    <RecordReveal recordId="1">
      <button>Detalles</button>
    </RecordReveal>
  );
  const wrapper = screen.getByRole("button").parentElement!;
  expect(wrapper).toHaveClass("record-reveal-pending");
  act(() =>
    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
  );
  expect(wrapper).toHaveClass("record-reveal-visible");
  expect(wrapper).not.toHaveClass("record-reveal-pending");
  expect(unobserve).toHaveBeenCalledWith(wrapper);
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

it("mantiene la tarjeta visible cuando no hay IntersectionObserver", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  render(
    <RecordReveal recordId="2">
      <button>Detalles</button>
    </RecordReveal>
  );
  expect(screen.getByRole("button").parentElement).not.toHaveClass("record-reveal-pending");
});
