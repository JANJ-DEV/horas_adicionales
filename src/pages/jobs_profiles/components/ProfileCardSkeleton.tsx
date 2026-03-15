// ProfileCardSkeleton es un componente que se encarga de mostrar el skeleton del card mientras se cargan
// los datos del perfil de trabajo, y también se encarga de mostrar el contenido del card cuando los datos

import type { FC, ReactNode } from "react";

// ya están cargados
type ProfileCardSkeletonProps = {
  children?: ReactNode;
  variant?: "default" | "skeleton";
};
const ProfileCardSkeleton: FC<ProfileCardSkeletonProps> = ({ children, variant = "default" }) => {
  const variantsStyles = {
    default: `
      app-card group relative overflow-hidden p-5 
      transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]
    `,
    skeleton: `
      app-card animate-pulse p-5
    `,
  };
  if (children) {
    return <article className={variantsStyles[variant]}>{children}</article>;
  }
  return (
    <article className={variantsStyles[variant]}>
      <div className="mb-4 h-6 w-1/2 rounded bg-[var(--bg-soft)]" />
      <div className="mb-2 h-4 w-full rounded bg-[var(--bg-soft)]" />
      <div className="mb-2 h-4 w-full rounded bg-[var(--bg-soft)]" />
      <div className="mb-2 h-4 w-full rounded bg-[var(--bg-soft)]" />
      <div className="mt-4 h-8 w-full rounded bg-[var(--bg-soft)]" />
    </article>
  );
};

export default ProfileCardSkeleton;
