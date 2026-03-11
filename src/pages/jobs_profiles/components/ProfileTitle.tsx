import Btn from "@/components/Btn";
import { useState, type FC } from "react";
import CardFooter from "./CardFooter";
import type { Children } from "@/types";

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

const ProfileTitle: FC<{ title: string }> = ({ title }) => {
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  const toggleUpdateTitle = () => {
    setIsUpdatingTitle(!isUpdatingTitle);
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
        <aside>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={title}
            className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
          />
        </aside>
      </IsUpdatingTitle>
      <IsUpdatingTitle state={isUpdatingTitle}>
        <CardFooter variant="card">
          <Btn
            size="xs"
            label="Guardar"
            variant="success"
            title={`Guardar cambios del perfil de trabajo: ${title}`}
            onClick={toggleUpdateTitle}
          />
        </CardFooter>
      </IsUpdatingTitle>
    </>
  );
};

export default ProfileTitle;
