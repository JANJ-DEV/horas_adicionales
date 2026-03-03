import type { ActionFunctionArgs } from "react-router";
import {authFirebase} from "@/apis/firebase";
import { saveRecord, type RecordService } from "@/services/records.service";
import { toast } from "react-toastify";
import { saveJobProfile, type JobProfile } from "@/services/job_profiles";

export async function addRecordAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nombreEmpresa = formData.get("nombre-empresa") as string;
  const fecha = formData.get("fecha") as string;
  const horaEntrada = formData.get("hora-entrada") as string;
  const horaSalida = formData.get("hora-salida") as string;
  
  // Aquí puedes hacer validaciones
  if (!nombreEmpresa || !fecha || !horaEntrada || !horaSalida ) {
    return {  
      error: "Todos los campos son requeridos" 
    };
  }
  
  // Aquí harías la llamada a tu API o base de datos
  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    console.error("No hay un usuario autenticado");
    return;
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
    record
  };
}

export const addJobProfileAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const nombrePerfil = formData.get("nombre-perfil") as string;
  const puestoTrabajo = formData.get("puesto-trabajo") as string;
  const descripcion = formData.get("descripcion") as string;

  if (!nombrePerfil || !puestoTrabajo) {
    return {
      error: "El nombre del perfil y el puesto de trabajo son requeridos"
    };
  } 
  
  // Aquí harías la llamada a tu API o base de datos para guardar el perfil de trabajo
  // Por ejemplo:
  const jobProfile = await saveJobProfile({ nombrePerfil, puestoTrabajo, descripcion }) as JobProfile;  

  toast.success("Perfil de trabajo guardado correctamente", {containerId: "job-profiles-toast"});
  return {
    success: true,
    message: "Perfil de trabajo guardado correctamente",
    jobProfile  
  };
}