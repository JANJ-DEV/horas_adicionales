import { describe, expect, it } from "vitest";
import { calculateSalary, calculateWorkedHours, lastLoginAt, obtenerFechaActual } from "./index";

describe("utils", () => {
  describe("lastLoginAt", () => {
    it("devuelve una instancia de Date con el timestamp recibido", () => {
      const timestamp = 1700000000000;
      const result = lastLoginAt(timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp);
    });
  });

  describe("obtenerFechaActual", () => {
    it("devuelve un string no vacio", () => {
      const result = obtenerFechaActual();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("acepta locale personalizado", () => {
      const result = obtenerFechaActual("en-US");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("calculateWorkedHours", () => {
    it("calcula jornada normal", () => {
      const result = calculateWorkedHours("08:00", "17:30");
      expect(result).toEqual({ formatted: "9h 30m", decimal: 9.5 });
    });

    it("maneja turnos nocturnos", () => {
      const result = calculateWorkedHours("22:15", "01:45");
      expect(result).toEqual({ formatted: "3h 30m", decimal: 3.5 });
    });

    it("devuelve cero si falta una hora", () => {
      expect(calculateWorkedHours("", "10:00")).toEqual({ formatted: "0h 00m", decimal: 0 });
      expect(calculateWorkedHours("08:00", "")).toEqual({ formatted: "0h 00m", decimal: 0 });
    });
  });

  describe("calculateSalary", () => {
    it("calcula salario con dos decimales", () => {
      const result = calculateSalary(8.75, 15.5);
      expect(result).toBe(135.63);
    });

    it("devuelve cero si faltan datos", () => {
      expect(calculateSalary(0, 10)).toBe(0);
      expect(calculateSalary(8, 0)).toBe(0);
    });
  });
});
