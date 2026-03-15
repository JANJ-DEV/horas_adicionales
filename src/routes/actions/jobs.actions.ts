import type { Branch, JobPosition, JobProfile } from "@/types";
import type { ActionFunctionArgs } from "react-router";
import { updateAccount } from "@/services/auth.service";
import { uploadFile } from "@/services/uploadFile.service";
import { authFirebase } from "@/apis/firebase";
import { getBranchById } from "@/services/branches.services";
import { getJobPositionFromBranchId } from "@/services/jobsPositions.service";
import { saveJobProfile } from "@/services/jobsProfile.service";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

export const add = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const idBranch = formData.get("branch") as string;
  const idJobPosition = formData.get("jobPosition") as string;
  const estimatedHourlyRate = formData.get("estimatedHourlyRate") as string;

  if (!title || !idBranch || !idJobPosition) {
    notify.error("Todos los campos son requeridos", { scope: TOAST_SCOPE.JOBS_PROFILES });
    return;
  }

  const branch = (await getBranchById(idBranch)) as Branch | null;
  if (!branch) {
    notify.error("No se encontró la rama seleccionada", { scope: TOAST_SCOPE.JOBS_PROFILES });
    return;
  }

  const jobPositions = (await getJobPositionFromBranchId(
    idJobPosition,
    idBranch
  )) as JobPosition | null;
  if (!jobPositions) {
    notify.error("No se encontró el puesto de trabajo seleccionado", {
      scope: TOAST_SCOPE.JOBS_PROFILES,
    });
    return;
  }

  const newJobProfile: JobProfile = {
    title,
    branch: {
      id: idBranch,
      name: branch.name,
      description: branch.description,
    },
    jobPosition: {
      id: idJobPosition,
      name: jobPositions.name,
      description: jobPositions.description,
    },
    estimatedHourlyRate: parseFloat(estimatedHourlyRate),
  };

  const jobProfile = (await saveJobProfile(newJobProfile)) as JobProfile | null;
  if (!jobProfile) {
    notify.error("No se pudo guardar el perfil de trabajo", { scope: TOAST_SCOPE.JOBS_PROFILES });
    return;
  }

  notify.success("Perfil de trabajo guardado correctamente ", { scope: TOAST_SCOPE.JOBS_PROFILES });
  return {
    success: true,
    message: "Perfil de trabajo guardado correctamente",
    jobProfile,
  };
};

export const update = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const displayName = data.get("displayName") as string;
  const uploadPhoto = globalThis.document.querySelector<HTMLInputElement>("#uploadPhoto")
    ?.files?.[0] as File;

  if (!displayName) {
    notify.error("El nombre de usuario es requerido", { scope: TOAST_SCOPE.GLOBAL });
    return {
      error: "El nombre de usuario es requerido",
    };
  }

  try {
    if (!uploadPhoto || uploadPhoto.size === 0) {
      await updateAccount({ displayName });
      data.set("photoURL", authFirebase.currentUser?.photoURL || "");
    } else {
      const url = await uploadFile(uploadPhoto);
      await updateAccount({ displayName, photoURL: url });
      data.set("photoURL", url);
    }
    notify.success("Cuenta actualizada correctamente", { scope: TOAST_SCOPE.GLOBAL });
  } catch (error) {
    console.error("Error al actualizar la cuenta:", error);
    notify.error("Error al actualizar la cuenta", { scope: TOAST_SCOPE.GLOBAL });
    return {
      error: "Error al actualizar la cuenta",
    };
  }

  const photoURL = data.get("photoURL") as string;

  return {
    success: true,
    message: "Cuenta actualizada correctamente",
    displayName,
    photoURL,
  };
};
