import "react-toastify/dist/ReactToastify.css";
import "./assets/css/index.css";
// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
// Context
import AuthProvider from "./context/providers/AuthProvider.tsx";
// Others

import router from "./routes/router.tsx";
import ToastCustomProvider from "./context/providers/ToastCustomProvider.tsx";
import GlobalProvider from "./context/providers/GlobalProvider.tsx";
import AppToastContainer from "./components/AppToastContainer.tsx";

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  window.location.reload();
});

const hours_records = createRoot(document.getElementById("root")!);

hours_records.render(
  <GlobalProvider>
    <ToastCustomProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <AppToastContainer containerId="global" position="top-center" />
    </ToastCustomProvider>
  </GlobalProvider>
);
