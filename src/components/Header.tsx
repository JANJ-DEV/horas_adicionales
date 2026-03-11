import type { Children } from "@/types";
import type { FC } from "react";

type Props = Children & {
  type?: "card" | "default";
};

const Header: FC<Props> = ({ children, type = "default" }) => {
  const typesHeader = {
    card: "mb-4 border-b border-white/10 pb-3",
    default: "",
  };

  return <header className={typesHeader[type] || typesHeader.default}>{children}</header>;
};

export default Header;
