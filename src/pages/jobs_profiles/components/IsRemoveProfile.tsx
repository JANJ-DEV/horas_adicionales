import type { FC } from "react";

// IsRemoveProfile es un componente que se encarga de mostrar un mensaje de eliminación cuando se está eliminando un perfil de trabajo
type IsRemoveProfileProps = {
  state: boolean;
  message?: string;
};
const IsRemoveProfile: FC<IsRemoveProfileProps> = ({ state, message }) => {
  return state ? (
    <span className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white font-bold text-lg rounded-xl">
      {message ? message : "Eliminando..."}
    </span>
  ) : null;
};

export default IsRemoveProfile;
