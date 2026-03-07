import type { ActionFunctionArgs } from "react-router";
import { authFirebase } from "@/apis/firebase";
import { saveRecord, type RecordService } from "@/services/records.service";

export async function add({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const jobProfileId = formData.get("jobProfileId") as string;
  const titleJobProfile = formData.get("titleJobProfile") as string;
  const dateTimeRecord = formData.get("dateTimeRecord") as string;
  const workStartTime = formData.get("workStartTime") as string;
  const workEndTime = formData.get("workEndTime") as string;

  // Aquí puedes hacer validaciones
  if (!titleJobProfile || !dateTimeRecord || !workStartTime || !workEndTime) {
    return {
      error: "Todos los campos son requeridos",
    };
  }

  // Aquí harías la llamada a tu API o base de datos
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    return {
      error: "No hay un usuario autenticado",
    };
  }
  const record: RecordService = {
    titleJobProfile,
    dateTimeRecord,
    workStartTime,
    workEndTime,
  };

  await saveRecord(record);
  // Retorna el resultado
  return {
    success: true,
    message: "Registro guardado correctamente",
    record,
    jobProfileId,
  };
}
