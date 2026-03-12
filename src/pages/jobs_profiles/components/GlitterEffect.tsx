// GlitterEffect es un componente que se encarga de mostrar un efecto de brillo en el card cuando
// se hace hover sobre el card, y skeleton es para mostrar el efecto de carga mientras se cargan

import type { FC } from "react";

// los datos del perfil de trabajo
type GlitterEffectProps = {
  variant?: "default" | "skeleton";
};
const GlitterEffect: FC<GlitterEffectProps> = ({ variant = "default" }) => {
  const variantsStyles = {
    default: `
      pointer-events-none absolute -right-12 -top-12
       h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl 
       transition-opacity duration-300 group-hover:opacity-100
    `,
    skeleton: `
      pointer-events-none absolute -right-12 -top-12 
      h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl 
      transition-opacity duration-300
    `,
  };
  return <div className={variantsStyles[variant]} />;
};

export default GlitterEffect;
