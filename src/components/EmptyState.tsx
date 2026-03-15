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
      className={`app-surface flex flex-col items-center justify-center gap-4 px-5 text-center ${fullScreen ? "min-h-screen" : "py-10"}`}
    >
      {icon ? <div>{icon}</div> : null}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text)]">
        {title}
      </h2>
      {description ? <p className="max-w-md text-[var(--text-muted)]">{description}</p> : null}
      {actionLabel && onAction ? <Btn label={actionLabel} onClick={onAction} /> : null}
    </section>
  );
};

export default EmptyState;
