import type { ActionFunctionArgs } from "react-router";
import { authFirebase } from "@/apis/firebase";
import { saveRecord, type RecordService } from "@/services/records.service";

export async function add({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nombreEmpresa = formData.get("nombre-empresa") as string;
  const fecha = formData.get("fecha") as string;
  const horaEntrada = formData.get("hora-entrada") as string;
  const horaSalida = formData.get("hora-salida") as string;

  // Aquí puedes hacer validaciones
  if (!nombreEmpresa || !fecha || !horaEntrada || !horaSalida) {
    return {
      error: "Todos los campos son requeridos",
    };
  }

  // Aquí harías la llamada a tu API o base de datos
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
    return {
      error: "No hay un usuario autenticado",
    };
  }
  const record: RecordService = {
    nombreEmpresa,
    fecha,
    hora_entrada: horaEntrada,
    hora_salida: horaSalida,
  };
  await saveRecord(record);
  // Retorna el resultado
  return {
    success: true,
    message: "Registro guardado correctamente",
    record,
  };
}
