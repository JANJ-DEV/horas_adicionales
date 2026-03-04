import type { FC, ReactNode } from "react";
export type Tag = keyof React.JSX.IntrinsicElements;

type Props = {
  children: ReactNode;
  className?: string
  tag: Tag
  display?: "block" | "inline-block" | "flex" | "inline-flex"
};

const MobileViewOnly: FC<Props> = ({ children, className, tag: Tag, display = "block" }) => {
  return <Tag className={`${display} lg:hidden ${className}`}>{children}</Tag>;
};

export default MobileViewOnly;