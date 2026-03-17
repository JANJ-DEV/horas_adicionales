import type { Children } from "@/types";
import type { FC } from "react";

type Props = Children & {
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "card";
};

const CardBody: FC<Props> = ({ children, className, style, variant = "default" }) => {
  const variantStyles = {
    default: "",
    card: "space-y-4 text-[var(--text)]",
  };

  return (
    <section className={`${variantStyles[variant]} ${className}`} style={style}>
      {children}
    </section>
  );
};

export default CardBody;
