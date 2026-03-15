import type { FC, ReactNode } from "react";
export type Tag = keyof React.JSX.IntrinsicElements;

type Props = {
  children: ReactNode;
  className?: string;
  tag: Tag;
  display?: "block" | "inline-block" | "flex" | "inline-flex";
};

const MobileViewOnly: FC<Props> = ({ children, className, tag: Tag, display = "block" }) => {
  const mobileDisplay =
    display === "block"
      ? "block"
      : display === "inline-block"
        ? "inline-block"
        : display === "inline-flex"
          ? "inline-flex"
          : "flex";
  return <Tag className={`${mobileDisplay} lg:hidden ${className}`}>{children}</Tag>;
};

export default MobileViewOnly;
