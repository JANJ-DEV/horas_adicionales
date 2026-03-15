import type { Children } from "@/types";
import type { FC } from "react";

type PropsCardsLayout = Children & {
  variant: "default";
};

const CardsLayout: FC<PropsCardsLayout> = ({ children, variant = "default" }) => {
  const varinatsStyles = {
    default: "flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3",
  };
  return <section className={varinatsStyles[variant]}>{children}</section>;
};
export default CardsLayout;
