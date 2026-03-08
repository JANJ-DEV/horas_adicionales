import { useState, type FC } from "react";

interface BtnProps {
  label: string;
  onClick: () => void;
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

const Btn: FC<BtnProps> = ({ label, onClick, variant = "primary" }) => {
  const [variantStyles] = useState({
    primary: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded",
    danger: "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
    success: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
    warning: "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded",
    info: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
    light: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded",
    dark: "bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded",
    link: "text-blue-500 hover:text-blue-700 font-bold py-2 px-4",
    outline:
      "border border-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded",
    disabled: "bg-gray-500 cursor-not-allowed",
    loading: "bg-gray-500 cursor-not-allowed",
  });

  return (
    <button
      className={`${variantStyles[variant]} transition-colors duration-300`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Btn;
