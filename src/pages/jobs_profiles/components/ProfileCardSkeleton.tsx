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
      group relative overflow-hidden p-5 
      rounded-xl border border-cyan-400/25 
      bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 
      shadow-lg shadow-black/30 transition-all duration-300 
      hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-cyan-500/20
    `,
    skeleton: `
      animate-pulse rounded-xl border border-cyan-400/25 
      bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-5 
      shadow-lg shadow-black/30
    `,
  };
  if (children) {
    return <article className={variantsStyles[variant]}>{children}</article>;
  }
  return (
    <article className={variantsStyles[variant]}>
      <div className="h-6 w-1/2 rounded bg-gray-700 mb-4" />
      <div className="h-4 w-full rounded bg-gray-700 mb-2" />
      <div className="h-4 w-full rounded bg-gray-700 mb-2" />
      <div className="h-4 w-full rounded bg-gray-700 mb-2" />
      <div className="h-8 w-full rounded bg-gray-700 mt-4" />
    </article>
  );
};

export default ProfileCardSkeleton;
