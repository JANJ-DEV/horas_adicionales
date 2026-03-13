import { FirebaseError } from "firebase/app";
import { afterEach, describe, expect, it, vi } from "vitest";
import { handleAppError } from "@/services/error.service";

describe("handleAppError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reporta FirebaseError con mensaje amigable", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new FirebaseError("auth/invalid-email", "Invalid email");

    handleAppError(error, "login");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("FirebaseError en login"),
      "El formato del correo electrónico es inválido."
    );
  });

  it("reporta Error estandar con contexto", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Algo fallo");

    handleAppError(error, "records");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en records: Algo fallo"
    );
  });

  it("reporta error desconocido cuando no es instancia de Error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = { foo: "bar" };

    handleAppError(error, "unknown");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error desconocido en unknown:",
      error
    );
  });

  it("usa contexto por defecto cuando no se proporciona", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    handleAppError(new Error("sin contexto"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en contexto desconocido: sin contexto"
    );
  });
});
