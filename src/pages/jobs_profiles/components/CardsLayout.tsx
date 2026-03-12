import type { Children } from "@/types";
import type { FC } from "react";

type PropsCardsLayout = Children & {
  variant: "default";
};

const CardsLayout: FC<PropsCardsLayout> = ({ children, variant = "default" }) => {
  const varinatsStyles = {
    default: "flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
  };
  return <section className={varinatsStyles[variant]}>{children}</section>;
};
export default CardsLayout;
