import { describe, expect, it } from "vitest";
import {
  calculateRecordsSummary,
  calculateSalary,
  calculateWorkedHours,
  filterRecordsByAdvancedFilters,
  filterRecordsByPeriod,
  getRecordReferenceDate,
  isDateInPeriod,
  lastLoginAt,
  obtenerFechaActual,
} from "@/utils/index";

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

  describe("records period helpers", () => {
    const referenceDate = new Date("2026-03-14T10:00:00.000Z");

    it("resuelve la fecha del registro usando dateTimeRecord y fallback a createdAt", () => {
      const directDate = getRecordReferenceDate({ dateTimeRecord: "2026-03-14" });
      const fromCreatedAt = getRecordReferenceDate({
        createdAt: { toDate: () => new Date("2026-03-10T08:00:00.000Z") },
      });

      expect(directDate).toBeInstanceOf(Date);
      expect(directDate?.toISOString().startsWith("2026-03-14")).toBe(true);
      expect(fromCreatedAt).toBeInstanceOf(Date);
      expect(fromCreatedAt?.toISOString()).toBe("2026-03-10T08:00:00.000Z");
    });

    it("evalua correctamente si una fecha cae en dia, semana o mes", () => {
      expect(isDateInPeriod(new Date("2026-03-14T12:00:00.000Z"), "day", referenceDate)).toBe(true);
      expect(isDateInPeriod(new Date("2026-03-13T12:00:00.000Z"), "day", referenceDate)).toBe(
        false
      );
      expect(isDateInPeriod(new Date("2026-03-10T12:00:00.000Z"), "week", referenceDate)).toBe(
        true
      );
      expect(isDateInPeriod(new Date("2026-03-01T12:00:00.000Z"), "week", referenceDate)).toBe(
        false
      );
      expect(isDateInPeriod(new Date("2026-03-01T12:00:00.000Z"), "month", referenceDate)).toBe(
        true
      );
      expect(isDateInPeriod(new Date("2026-02-28T12:00:00.000Z"), "month", referenceDate)).toBe(
        false
      );
    });

    it("filtra registros por periodo y calcula resumen acumulado", () => {
      const records = [
        {
          dateTimeRecord: "2026-03-14",
          workStartTime: "08:00",
          workEndTime: "12:00",
          estimatedHourlyRate: 10,
        },
        {
          dateTimeRecord: "2026-03-12",
          workStartTime: "09:00",
          workEndTime: "18:00",
          estimatedHourlyRate: 20,
        },
        {
          dateTimeRecord: "2026-02-01",
          workStartTime: "09:00",
          workEndTime: "10:00",
          estimatedHourlyRate: 100,
        },
      ];

      const weeklyRecords = filterRecordsByPeriod(records, "week", referenceDate);
      expect(weeklyRecords).toHaveLength(2);

      const summary = calculateRecordsSummary(weeklyRecords);
      expect(summary).toEqual({
        totalHoursDecimal: 13,
        totalSalary: 220,
      });
    });
  });

  describe("filterRecordsByAdvancedFilters", () => {
    const records = [
      {
        id: "r1",
        branchId: "b1",
        jobPositionId: "j1",
        jobProfileId: "p1",
        dateTimeRecord: "2026-03-10",
        workStartTime: "08:00",
        workEndTime: "16:00",
        estimatedHourlyRate: 12,
      },
      {
        id: "r2",
        branchId: "b1",
        jobPositionId: "j2",
        jobProfileId: "p2",
        dateTimeRecord: "2026-03-14",
        workStartTime: "09:00",
        workEndTime: "19:00",
        estimatedHourlyRate: 20,
      },
      {
        id: "r3",
        branchId: "b2",
        jobPositionId: "j3",
        jobProfileId: "p3",
        dateTimeRecord: "2026-03-20",
        workStartTime: "10:00",
        workEndTime: "12:00",
        estimatedHourlyRate: 8,
      },
    ];

    it("filtra por rama, puesto, perfil y rango de fecha", () => {
      const result = filterRecordsByAdvancedFilters(records, {
        branchId: "b1",
        jobPositionId: "j2",
        jobProfileId: "p2",
        dateFrom: "2026-03-13",
        dateTo: "2026-03-15",
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("r2");
    });

    it("filtra por rango de tarifa y horas trabajadas", () => {
      const result = filterRecordsByAdvancedFilters(records, {
        minHourlyRate: 10,
        maxHourlyRate: 20,
        minWorkedHours: 8,
        maxWorkedHours: 10,
      });

      expect(result).toHaveLength(2);
      expect(result.map((record) => record.id)).toEqual(["r1", "r2"]);
    });
  });
});
