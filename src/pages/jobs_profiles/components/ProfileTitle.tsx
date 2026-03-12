import Btn from "@/components/Btn";
import { useState, type FC, type SubmitEvent } from "react";
import CardFooter from "./CardFooter";
import type { Children } from "@/types";
import { toast } from "react-toastify";
import { updateJobProfile } from "@/services/jobsProfile.service";

type IsUpdatingTitleProps = Children & {
  state: boolean;
  variant: "default" | "updating";
};

const Title: FC<Partial<IsUpdatingTitleProps>> = ({ children, variant = "default" }) => {
  const variantsStyles = {
    default: "flex items-center justify-between gap-3",
    updating: "hidden",
  };
  return <section className={` ${variantsStyles[variant]}`}>{children}</section>;
};

const IsUpdatingTitle: FC<Partial<IsUpdatingTitleProps>> = ({ state, children }) => {
  if (!state) return null;
  return <>{children}</>;
};

const ProfileTitle: FC<{ title: string; jobProfileId: string }> = ({ title, jobProfileId }) => {
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleUpdateTitle = () => {
    setIsUpdatingTitle(!isUpdatingTitle);
  };

  const handlerChangeTitle = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const newTitle = String(data.get(`title-${jobProfileId}`) ?? "").trim();

    if (!newTitle) {
      toast.error("El título no puede estar vacío", { containerId: "profile" });
      return;
    }

    if (newTitle === title.trim()) {
      toast.info("No hay cambios para guardar", { containerId: "profile" });
      setIsUpdatingTitle(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateJobProfile(jobProfileId, { title: newTitle });
      toast.success(`Título actualizado a: ${newTitle}`, {
        containerId: "profile",
      });
      setIsUpdatingTitle(false);
    } catch (error) {
      console.error("Error al actualizar el título del perfil", error);
      toast.error("No se pudo actualizar el título", { containerId: "profile" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Title variant={isUpdatingTitle ? "updating" : "default"}>
        <h3 className="text-xl font-semibold text-cyan-100">{title}</h3>
        <Btn
          size="xs"
          label={isUpdatingTitle ? "x" : "Editar"}
          variant={isUpdatingTitle ? "danger" : "outline"}
          title={`Ver detalles del perfil de trabajo: ${title}`}
          onClick={toggleUpdateTitle}
        />
      </Title>
      <IsUpdatingTitle state={isUpdatingTitle}>
        <form id={`update-title-${jobProfileId}`} onSubmit={handlerChangeTitle}>
          <input
            type="text"
            name={`title-${jobProfileId}`}
            id={`title-${jobProfileId}`}
            defaultValue={title}
            disabled={isSaving}
            className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
          />

          <CardFooter variant="card">
            <Btn
              size="xs"
              label="Cancelar"
              variant="danger"
              title={`Cancelar cambios del perfil de trabajo: ${title}`}
              type="button"
              onClick={toggleUpdateTitle}
              formState={isSaving}
            />
            <Btn
              size="xs"
              label={isSaving ? "Guardando..." : "Guardar"}
              variant={isSaving ? "loading" : "success"}
              title={`Guardar cambios del perfil de trabajo: ${title}`}
              type="submit"
              formState={isSaving}
            />
          </CardFooter>
        </form>
      </IsUpdatingTitle>
    </>
  );
};

export default ProfileTitle;
