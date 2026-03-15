import { useState, type FC, type ReactNode } from "react";

interface BtnProps {
  children?: ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset";
  formState?: boolean;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline"
    | "disabled"
    | "loading";
}

const Btn: FC<BtnProps> = ({
  children,
  label,
  onClick,
  variant = "primary",
  formState,
  type = "button",
  title = "",
  size = "md",
}) => {
  const [variantStyles] = useState({
    primary:
      "border border-transparent bg-[var(--accent)] text-slate-950 shadow-[0_2px_6px_rgba(105,211,192,0.15)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white",
    secondary:
      "border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
    danger:
      "border border-transparent bg-[var(--danger)]/16 text-[var(--danger)] hover:-translate-y-0.5 hover:bg-[var(--danger)] hover:text-white",
    success:
      "border border-transparent bg-[var(--success)]/16 text-[var(--success)] hover:-translate-y-0.5 hover:bg-[var(--success)] hover:text-white",
    warning:
      "border border-transparent bg-[var(--warning)]/16 text-[var(--warning)] hover:-translate-y-0.5 hover:bg-[var(--warning)] hover:text-slate-950",
    info: "border border-transparent bg-[var(--accent-strong)]/16 text-[var(--accent-strong)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white",
    light:
      "border border-[var(--border)] bg-white/80 text-slate-900 hover:-translate-y-0.5 hover:bg-white",
    dark: "border border-transparent bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800",
    link: "border border-transparent bg-transparent text-[var(--accent)] hover:text-[var(--accent-strong)]",
    outline:
      "border border-[var(--border-strong)] bg-transparent text-[var(--text)] hover:-translate-y-0.5 hover:bg-[var(--bg-soft)] hover:text-[var(--accent)]",
    disabled:
      "border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text-soft)] cursor-not-allowed opacity-70",
    loading:
      "border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text-soft)] cursor-not-allowed opacity-70",
  });
  const [sizeStyles] = useState({
    xs: "text-xs px-3 py-2",
    sm: "text-sm px-4 py-2.5",
    md: "text-sm px-4 py-3 sm:text-base",
    lg: "text-base px-5 py-3.5 sm:text-lg",
    xl: "text-lg px-6 py-4 sm:text-xl",
  });

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-[0.01em] transition duration-300 ${variantStyles[variant]} ${sizeStyles[size]}`}
      onClick={onClick}
      disabled={formState}
      title={title}
    >
      {children ? children : label}
    </button>
  );
};

export default Btn;
