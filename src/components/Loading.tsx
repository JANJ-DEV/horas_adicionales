import type { FC } from "react";
import { CgSearchLoading, CgSpinner } from "react-icons/cg";

type LoadingProps = {
  variant?: "auth" | "load";
  size?: number;
};

const Loading: FC<LoadingProps> = ({ variant = "load", size = 24 }) => {
  return (
    <div
      className={`flex items-center justify-center ${variant === "auth" ? "animate-ping" : "animate-spin"}`}
    >
      {variant === "auth" ? (
        <CgSearchLoading size={size} className="text-yellow-300" />
      ) : (
        <CgSpinner size={size} className="text-white" />
      )}
    </div>
  );
};

export default Loading;
