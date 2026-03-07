import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  tag: keyof React.JSX.IntrinsicElements;
  display?: "block" | "inline-block" | "flex" | "inline-flex";
};

const DesktopViewOnly: FC<Props> = ({ children, className, tag: Tag, display = "block" }) => {
  return <Tag className={`${display} hidden lg:flex ${className}`}>{children}</Tag>;
};

export default DesktopViewOnly;
