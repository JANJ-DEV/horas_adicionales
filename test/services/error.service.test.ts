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
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error general en records: Algo fallo");
  });

  it("reconoce errores tipo Firebase mockeados por forma", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    handleAppError({ code: "auth/network-request-failed", message: "Network error" }, "auth");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "FirebaseError en auth: [auth/network-request-failed] Network error",
      "Hubo un problema de conexión a la red. Por favor, inténtalo de nuevo."
    );
  });

  it("reporta error desconocido cuando no es instancia de Error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = { foo: "bar" };

    handleAppError(error, "unknown");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error desconocido en unknown:", error);
  });

  it("usa contexto por defecto cuando no se proporciona", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    handleAppError(new Error("sin contexto"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en contexto desconocido: sin contexto"
    );
  });
});
