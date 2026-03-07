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

console.log(obtenerFechaActual());
// Ejemplo de salida: "2 de marzo de 2026, 12:46:19"
