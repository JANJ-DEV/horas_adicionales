import type { RecordService } from "@/services/records.service";
import { calculateRecordsSummary, getRecordReferenceDate } from "@/utils";

export type StatisticsPeriod = "year" | "semester" | "quarter" | "month" | "week" | "day";

export const localDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const periodBounds = (period: StatisticsPeriod, date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (period === "week") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  if (period === "month") start.setDate(1);
  if (period === "quarter") {
    start.setDate(1);
    start.setMonth(Math.floor(start.getMonth() / 3) * 3);
  }
  if (period === "semester") {
    start.setDate(1);
    start.setMonth(Math.floor(start.getMonth() / 6) * 6);
  }
  if (period === "year") {
    start.setMonth(0, 1);
  }
  const end = new Date(start);
  if (period === "day") end.setDate(end.getDate() + 1);
  if (period === "week") end.setDate(end.getDate() + 7);
  if (period === "month") end.setMonth(end.getMonth() + 1);
  if (period === "quarter") end.setMonth(end.getMonth() + 3);
  if (period === "semester") end.setMonth(end.getMonth() + 6);
  if (period === "year") end.setFullYear(end.getFullYear() + 1);
  return { start, end };
};

export const shiftPeriod = (period: StatisticsPeriod, date: Date, direction: -1 | 1) => {
  const { start } = periodBounds(period, date);
  if (period === "day") start.setDate(start.getDate() + direction);
  if (period === "week") start.setDate(start.getDate() + direction * 7);
  if (period === "month") start.setMonth(start.getMonth() + direction);
  if (period === "quarter") start.setMonth(start.getMonth() + direction * 3);
  if (period === "semester") start.setMonth(start.getMonth() + direction * 6);
  if (period === "year") start.setFullYear(start.getFullYear() + direction);
  return start;
};

const recordDate = (record: RecordService) => {
  const value = record.dateTimeRecord;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
    return new Date(`${value}T00:00:00`);
  return getRecordReferenceDate(record);
};

export const buildStatistics = (records: RecordService[], period: StatisticsPeriod, date: Date) => {
  const { start, end } = periodBounds(period, date);
  const included = records.filter((record) => {
    const value = recordDate(record);
    return value && value >= start && value < end;
  });
  const monthGroups = period === "year" || period === "semester" || period === "quarter";
  const groups = new Map<string, RecordService[]>();
  for (const record of included) {
    const value = recordDate(record)!;
    const key = monthGroups
      ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`
      : localDateValue(value);
    const group = groups.get(key) ?? [];
    group.push(record);
    groups.set(key, group);
  }
  const rows = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, items]) => {
      const labelDate = new Date(`${key}${monthGroups ? "-01" : ""}T00:00:00`);
      const label = new Intl.DateTimeFormat(
        "es-ES",
        monthGroups
          ? { month: "long", year: "numeric" }
          : { day: "numeric", month: "short", year: "numeric" }
      ).format(labelDate);
      return { key, label, count: items.length, ...calculateRecordsSummary(items) };
    });
  return { start, end, count: included.length, ...calculateRecordsSummary(included), rows };
};
