import { describe, expect, it } from "vitest";
import {
  buildStatistics,
  localDateValue,
  periodBounds,
  shiftPeriod,
} from "../../../src/pages/statistics/calculations";

const record = (
  dateTimeRecord: string,
  workStartTime = "08:00",
  workEndTime = "16:00",
  estimatedHourlyRate = 10
) => ({
  dateTimeRecord,
  titleJobProfile: "Empresa",
  workStartTime,
  workEndTime,
  estimatedHourlyRate,
});

describe("estadísticas por período", () => {
  it("delimita el trimestre y semestre naturales, incluidos los límites de año", () => {
    expect(localDateValue(periodBounds("quarter", new Date(2026, 11, 31)).start)).toBe(
      "2026-10-01"
    );
    expect(localDateValue(periodBounds("quarter", new Date(2026, 11, 31)).end)).toBe("2027-01-01");
    expect(localDateValue(periodBounds("semester", new Date(2026, 6, 1)).start)).toBe("2026-07-01");
    expect(localDateValue(periodBounds("semester", new Date(2026, 5, 30)).end)).toBe("2026-07-01");
  });
  it("considera la semana de lunes a domingo al cruzar un año", () => {
    const bounds = periodBounds("week", new Date(2026, 0, 1));
    expect(localDateValue(bounds.start)).toBe("2025-12-29");
    expect(localDateValue(bounds.end)).toBe("2026-01-05");
    expect(localDateValue(shiftPeriod("week", new Date(2026, 0, 1), -1))).toBe("2025-12-22");
  });
  it("suma solo registros del período y presenta el desglose mensual", () => {
    const result = buildStatistics(
      [
        record("2026-01-01"),
        record("2026-02-15", "22:00", "01:00", 20),
        record("2025-12-31"),
        record("2026-04-01"),
      ],
      "quarter",
      new Date(2026, 1, 1)
    );
    expect(result.count).toBe(2);
    expect(result.totalHoursDecimal).toBe(11);
    expect(result.totalSalary).toBe(140);
    expect(result.rows.map((row) => [row.key, row.count, row.totalHoursDecimal])).toEqual([
      ["2026-01", 1, 8],
      ["2026-02", 1, 3],
    ]);
  });
  it("permite consultar un día sin datos", () => {
    expect(buildStatistics([record("2026-01-01")], "day", new Date(2026, 0, 2))).toMatchObject({
      count: 0,
      totalHoursDecimal: 0,
      totalSalary: 0,
      rows: [],
    });
  });
});
