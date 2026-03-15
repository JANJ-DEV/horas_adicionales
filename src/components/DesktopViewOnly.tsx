import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  tag: keyof React.JSX.IntrinsicElements;
  display?: "block" | "inline-block" | "flex" | "inline-flex";
};

const DesktopViewOnly: FC<Props> = ({ children, className, tag: Tag, display = "block" }) => {
  const desktopDisplay =
    display === "block"
      ? "lg:block"
      : display === "inline-block"
        ? "lg:inline-block"
        : display === "inline-flex"
          ? "lg:inline-flex"
          : "lg:flex";
  return <Tag className={`hidden ${desktopDisplay} ${className}`}>{children}</Tag>;
};

export default DesktopViewOnly;
