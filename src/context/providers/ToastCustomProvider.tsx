import {  useState } from "react";
import { ToastCtx } from "../ToastCtx";

const ToastCustomProvider = ({ children }: { children: React.ReactNode }) => {
  const [containerId, setContainerId] = useState<string>("global");

  const updateContainerId = (id: string) => {
    setContainerId(id);
  };

  return (
    <ToastCtx.Provider value={{containerId, updateContainerId}}>
      {children}
    </ToastCtx.Provider>
  );
};

export default ToastCustomProvider;