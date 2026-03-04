import { useState, type FC } from "react";

type Props = {
  variant?: "small" | "large" | "full";
};

const Brand: FC<Props> = ({ variant = "large" }) => {
  const [srcBrand] = useState("./logo.png");
  return (
    <img
      src={srcBrand}
      alt="Marca de Empresa"
      width={128}
      height={128}
      className={
        variant === "small"
          ? "w-16 h-16 cover"
          : variant === "large"
            ? "w-32 h-32 cover"
            : "w-full h-full cover"
      }
    />
  );
};

export default Brand;
