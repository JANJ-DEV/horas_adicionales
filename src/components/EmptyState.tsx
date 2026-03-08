import type { FC, ReactNode } from "react";
import Btn from "./Btn";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  fullScreen?: boolean;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  fullScreen = false,
}) => {
  return (
    <section
      className={`flex flex-col items-center justify-center gap-4 text-center ${fullScreen ? "h-screen" : "py-10"}`}
    >
      {icon ? <div>{icon}</div> : null}
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? <p className="text-slate-300 max-w-md">{description}</p> : null}
      {actionLabel && onAction ? <Btn label={actionLabel} onClick={onAction} /> : null}
    </section>
  );
};

export default EmptyState;
