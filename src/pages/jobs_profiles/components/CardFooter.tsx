import type { Children } from "@/types";
import type { FC } from "react";

type Props = Children & {
  variant?: "default" | "card";
};

const CardFooter: FC<Props> = ({ children, variant = "default" }) => {
  const variantStyles = {
    default: "",
    card: "mt-4 flex justify-end gap-4 items-center",
  };
  return <footer className={variantStyles[variant]}>{children}</footer>;
};

export default CardFooter;
