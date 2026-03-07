import "./assets/css/index.css";
import "react-toastify/dist/ReactToastify.css";
// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
// Context
import AuthProvider from "./context/providers/AuthProvider.tsx";
// Others

import router from "./routes/router.tsx";
import ToastCustomProvider from "./context/providers/ToastCustomProvider.tsx";
import { ToastContainer } from "react-toastify";
import GlobalProvider from "./context/providers/GlobalProvider.tsx";

const hours_records = createRoot(document.getElementById("root")!);

hours_records.render(
  <GlobalProvider>
    <ToastCustomProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ToastContainer containerId="global" position="top-left" />
    </ToastCustomProvider>
  </GlobalProvider>
);
