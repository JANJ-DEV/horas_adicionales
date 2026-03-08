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
