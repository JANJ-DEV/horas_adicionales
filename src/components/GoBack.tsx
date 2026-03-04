import { type FC } from "react";
import { useNavigate } from "react-router";

const GoBack: FC = () => {
  const goBack = useNavigate();
  return (
    <button
      type="button"
      onClick={() => goBack(-1)}
      className={`focus:text-green-500 active:text-green-900 border rounded-sm py-2 px-4`}
    >
      Volver
    </button>
  );
};

export default GoBack;
