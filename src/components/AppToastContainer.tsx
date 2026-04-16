import { ToastContainer, cssTransition, type ToastContainerProps } from "react-toastify";
import { DEFAULT_TOAST_AUTO_CLOSE } from "@/constants/toast";
import "@/assets/css/toast-transition.css";

const bubbleTransition = cssTransition({
  enter: "app-toast-bubble-enter",
  exit: "app-toast-bubble-exit",
  appendPosition: false,
  collapse: true,
  collapseDuration: 260,
});

type AppToastContainerProps = Omit<
  ToastContainerProps,
  "theme" | "toastClassName" | "bodyClassName" | "progressClassName" | "transition"
>;

const AppToastContainer = ({
  autoClose = DEFAULT_TOAST_AUTO_CLOSE,
  hideProgressBar = false,
  ...props
}: AppToastContainerProps) => {
  return (
    <ToastContainer
      {...props}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      closeOnClick
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable={false}
      newestOnTop
      theme="light"
      transition={bubbleTransition}
      toastClassName={(context) => `app-toast app-toast--${context?.type ?? "default"}`}
      progressClassName="app-toast-progress"
    />
  );
};

export default AppToastContainer;
