import { ToastContainer, cssTransition, type ToastContainerProps } from "react-toastify";

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

const AppToastContainer = ({ autoClose = 3200, hideProgressBar = false, ...props }: AppToastContainerProps) => {
  return (
    <ToastContainer
      {...props}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      closeOnClick
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable
      newestOnTop
      theme="light"
      transition={bubbleTransition}
      toastClassName={(context) => `app-toast app-toast--${context?.type ?? "default"}`}
      progressClassName="app-toast-progress"
    />
  );
};

export default AppToastContainer;
