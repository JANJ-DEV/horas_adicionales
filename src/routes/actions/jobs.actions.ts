import type { Branch, JobPosition, JobProfile } from "@/types";
import type { ActionFunctionArgs } from "react-router";
import { toast } from "react-toastify";
import { updateAccount } from "@/services/auth.service";
import { uploadFile } from "@/services/uploadFile.service";
import { authFirebase } from "@/apis/firebase";
import { getBranchById } from "@/services/branches.services";
import { getJobPositionFromBranchId } from "@/services/jobsPositions.service";
import { saveJobProfile } from "@/services/jobsProfile.service";
// import { saveJobProfile } from "@/services/jobsProfile.service";

export const add = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const idBranch = formData.get("branch") as string;
  const idJobPosition = formData.get("jobPosition") as string;
  const estimatedHourlyRate = formData.get("estimatedHourlyRate") as string;
  // console.table({ title, idBranch, idJobPosition, estimatedHourlyRate });

  if (!title || !idBranch || !idJobPosition) {
    toast.error("Todos los campos son requeridos", { containerId: "jobs-profiles" });
    return;
  }

  const branch = (await getBranchById(idBranch)) as Branch;
  const jobPositions = (await getJobPositionFromBranchId(idJobPosition, idBranch)) as JobPosition;

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

  const jobProfile = (await saveJobProfile(newJobProfile)) as JobProfile;
  toast.success("Perfil de trabajo guardado correctamente ", { containerId: "jobs-profiles" });
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
    toast.error("El nombre de usuario es requerido", { containerId: "global" });
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
      console.log("URL de la foto subida:", url);
      await updateAccount({ displayName, photoURL: url });
      data.set("photoURL", url);
    }
    toast.success("Cuenta actualizada correctamente", { containerId: "global" });
  } catch (error) {
    console.error("Error al actualizar la cuenta:", error);
    toast.error("Error al actualizar la cuenta", { containerId: "global" });
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
