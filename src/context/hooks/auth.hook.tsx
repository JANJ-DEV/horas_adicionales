import { useContext } from "react";
import { AuthCtx } from "../authCtx";

const useAuth = () => {
  try {
    const ctx = useContext(AuthCtx);
    if (!ctx) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
  } catch (error) {
    console.error(error);
    throw new Error("useAuth must be used within an AuthProvider");
  }
};

export default useAuth;
