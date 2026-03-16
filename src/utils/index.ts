export const lastLoginAt = (timestamp: number) => {
  return new Date(timestamp);
};

export const obtenerFechaActual = (locale = "es-ES") => {
  const ahora = new Date();

  // Configuramos las opciones de formato
  const opciones: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Cambia a true si prefieres formato AM/PM
  };

  return new Intl.DateTimeFormat(locale, opciones).format(ahora);
};

// Definimos lo que devolverá la función para que TypeScript nos ayude
interface WorkHoursResult {
  formatted: string;
  decimal: number;
}

export const calculateWorkedHours = (startTime: string, endTime: string): WorkHoursResult => {
  // Si falta alguna de las dos horas, devolvemos valores en cero
  if (!startTime || !endTime) return { formatted: "0h 00m", decimal: 0 };

  // 1. Separar las horas de los minutos y convertirlos a números
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // 2. Convertir todo a minutos totales desde las 00:00
  const startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  // 3. Manejar turnos de noche
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  // 4. Calcular la diferencia real en minutos
  const diffInMinutes = endTotalMinutes - startTotalMinutes;

  // 5. Cálculo para el formato de texto (ej: "8h 30m")
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // 6. NUEVO: Cálculo para el formato decimal (ej: 8.5)
  // Dividimos los minutos totales entre 60, redondeamos a 2 decimales y lo convertimos a número
  const decimalHours = Number((diffInMinutes / 60).toFixed(2));

  return {
    formatted: `${hours}h ${formattedMinutes}m`,
    decimal: decimalHours,
  };
};
// Función 2: Calcula el dinero (completamente independiente)
export const calculateSalary = (decimalHours: number, hourlyRate: number): number => {
  if (!decimalHours || !hourlyRate) return 0;

  const totalSalary = decimalHours * hourlyRate;
  return Number(totalSalary.toFixed(2));
};

export type RecordsPeriod = "day" | "week" | "month";

export type RecordsAdvancedFilters = {
  branchId?: string;
  jobPositionId?: string;
  jobProfileId?: string;
  dateFrom?: string;
  dateTo?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  minWorkedHours?: number;
  maxWorkedHours?: number;
};

type DateLike = Date | string | { toDate: () => Date } | undefined | null;

type RecordLike = {
  dateTimeRecord?: DateLike;
  createdAt?: DateLike;
  workStartTime?: string;
  workEndTime?: string;
  estimatedHourlyRate?: number;
};

const startOfDay = (value: Date) => {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfWeek = (value: Date) => {
  const next = startOfDay(value);
  const currentDay = next.getDay();
  const mondayOffset = (currentDay + 6) % 7;
  next.setDate(next.getDate() - mondayOffset);
  return next;
};

const startOfMonth = (value: Date) => {
  const next = startOfDay(value);
  next.setDate(1);
  return next;
};

const toDate = (value: DateLike): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
  }
  return null;
};

export const getRecordReferenceDate = (
  record: Pick<RecordLike, "dateTimeRecord" | "createdAt">
) => {
  return toDate(record.dateTimeRecord) ?? toDate(record.createdAt);
};

export const isDateInPeriod = (
  value: Date,
  period: RecordsPeriod,
  referenceDate: Date = new Date()
) => {
  const normalizedValue = startOfDay(value).getTime();

  if (period === "day") {
    return normalizedValue === startOfDay(referenceDate).getTime();
  }

  if (period === "week") {
    const start = startOfWeek(referenceDate).getTime();
    const end = new Date(startOfWeek(referenceDate));
    end.setDate(end.getDate() + 7);
    return normalizedValue >= start && normalizedValue < end.getTime();
  }

  const start = startOfMonth(referenceDate).getTime();
  const end = new Date(startOfMonth(referenceDate));
  end.setMonth(end.getMonth() + 1);
  return normalizedValue >= start && normalizedValue < end.getTime();
};

export const filterRecordsByPeriod = <T extends RecordLike>(
  records: T[],
  period: RecordsPeriod,
  referenceDate: Date = new Date()
) => {
  return records.filter((record) => {
    const reference = getRecordReferenceDate(record);
    if (!reference) return false;
    return isDateInPeriod(reference, period, referenceDate);
  });
};

export const calculateRecordsSummary = <T extends RecordLike>(records: T[]) => {
  return records.reduce(
    (acc, record) => {
      const hasWorkedTime = Boolean(record.workStartTime && record.workEndTime);
      if (!hasWorkedTime) return acc;

      const workedHours = calculateWorkedHours(
        record.workStartTime as string,
        record.workEndTime as string
      );
      const hourlyRate = Number(record.estimatedHourlyRate ?? 0);
      const salary = calculateSalary(workedHours.decimal, hourlyRate);

      return {
        totalHoursDecimal: Number((acc.totalHoursDecimal + workedHours.decimal).toFixed(2)),
        totalSalary: Number((acc.totalSalary + salary).toFixed(2)),
      };
    },
    {
      totalHoursDecimal: 0,
      totalSalary: 0,
    }
  );
};

type RecordFilterLike = RecordLike & {
  branchId?: string;
  jobPositionId?: string;
  jobProfileId?: string;
};

const normalizeDateFilter = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toSafeNumber = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return value;
};

export const filterRecordsByAdvancedFilters = <T extends RecordFilterLike>(
  records: T[],
  filters: RecordsAdvancedFilters
) => {
  const dateFrom = normalizeDateFilter(filters.dateFrom);
  const dateTo = normalizeDateFilter(filters.dateTo);

  if (dateTo) {
    dateTo.setHours(23, 59, 59, 999);
  }

  const minHourlyRate = toSafeNumber(filters.minHourlyRate);
  const maxHourlyRate = toSafeNumber(filters.maxHourlyRate);
  const minWorkedHours = toSafeNumber(filters.minWorkedHours);
  const maxWorkedHours = toSafeNumber(filters.maxWorkedHours);

  return records.filter((record) => {
    if (filters.branchId && record.branchId !== filters.branchId) {
      return false;
    }

    if (filters.jobPositionId && record.jobPositionId !== filters.jobPositionId) {
      return false;
    }

    if (filters.jobProfileId && record.jobProfileId !== filters.jobProfileId) {
      return false;
    }

    if (dateFrom || dateTo) {
      const recordDate = getRecordReferenceDate(record);
      if (!recordDate) {
        return false;
      }

      if (dateFrom && recordDate.getTime() < dateFrom.getTime()) {
        return false;
      }

      if (dateTo && recordDate.getTime() > dateTo.getTime()) {
        return false;
      }
    }

    const hourlyRate = Number(record.estimatedHourlyRate ?? 0);
    if (minHourlyRate !== null && hourlyRate < minHourlyRate) {
      return false;
    }

    if (maxHourlyRate !== null && hourlyRate > maxHourlyRate) {
      return false;
    }

    if (minWorkedHours !== null || maxWorkedHours !== null) {
      const workedHours = calculateWorkedHours(
        record.workStartTime ?? "",
        record.workEndTime ?? ""
      ).decimal;

      if (minWorkedHours !== null && workedHours < minWorkedHours) {
        return false;
      }

      if (maxWorkedHours !== null && workedHours > maxWorkedHours) {
        return false;
      }
    }

    return true;
  });
};
