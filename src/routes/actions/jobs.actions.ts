import { saveJobProfile } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import type { ActionFunctionArgs } from "react-router";
import { toast } from "react-toastify";
import { updateAccount } from "@/services/auth.service";
import { uploadFile } from "@/services/uploadFile.service";
import { authFirebase } from "@/apis/firebase";

export const add = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(
    "Datos del formulario recibidos en el action:",
    Object.fromEntries(formData.entries())
  );
  const profileTitle = formData.get("profileTitle") as string;
  const sectorName = formData.get("sectorName") as string;
  const sectorDescription = formData.get("sectorDescription") as string;
  const jobPosition = formData.get("jobPosition") as string;
  const jobDescription = formData.get("jobDescription") as string;

  if (!profileTitle || !jobPosition) {
    return {
      error: "El nombre del perfil y el puesto de trabajo son requeridos",
    };
  }
  const newJobProfile: JobProfile = {
    profileTitle,
    sectorName,
    sectorDescription,
    jobPosition,
    jobDescription,
  };

  console.table(newJobProfile);

  const jobProfile = (await saveJobProfile(newJobProfile)) as JobProfile;
  toast.success("Perfil de trabajo guardado correctamente ", { containerId: "job-profiles-toast" });
  return {
    success: true,
    message: "Perfil de trabajo guardado correctamente",
    newJobProfile,
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

  if (!uploadPhoto || uploadPhoto.size === 0) {
    updateAccount({ displayName });
    data.set("photoURL", authFirebase.currentUser?.photoURL || "");
    toast.success("Cuenta actualizada correctamente", { containerId: "global" });
  } else {
    const url = await uploadFile(uploadPhoto);
    console.log("URL de la foto subida:", url);
    updateAccount({ displayName, photoURL: url });
    data.set("photoURL", url);
    toast.success("Cuenta actualizada correctamente", { containerId: "global" });
    //   uploadFile(uploadPhoto).then((url) => {
    //   console.log("URL de la foto subida:", url);
    //   updateAccount({ displayName, photoURL: url });
    //   data.set("photoURL", url);
    //   toast.success("Cuenta actualizada correctamente", { containerId: "global" });
    // }).catch((error: FirebaseError) => {
    //   console.error("Error al subir la foto:", error);
    //   toast.error("Error al subir la foto", { containerId: "global" });
    // });
  }

  const photoURL = data.get("photoURL") as string;

  return {
    success: true,
    message: "Cuenta actualizada correctamente",
    displayName,
    photoURL,
  };
};
