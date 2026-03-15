import { toast, type ToastOptions } from "react-toastify";

export const TOAST_SCOPE = {
  GLOBAL: "global",
  RECORDS: "records",
  PROFILE: "profile",
  JOBS_PROFILES: "jobs-profiles",
} as const;

export type ToastScope = (typeof TOAST_SCOPE)[keyof typeof TOAST_SCOPE];

type NotifyOptions = Omit<ToastOptions, "containerId"> & {
  scope?: ToastScope;
};

const buildOptions = ({
  scope = TOAST_SCOPE.GLOBAL,
  ...options
}: NotifyOptions = {}): ToastOptions => ({
  containerId: scope,
  autoClose: 3000,
  closeOnClick: true,
  ...options,
});

export const notify = {
  success: (message: string, options?: NotifyOptions) =>
    toast.success(message, buildOptions(options)),
  error: (message: string, options?: NotifyOptions) => toast.error(message, buildOptions(options)),
  info: (message: string, options?: NotifyOptions) => toast.info(message, buildOptions(options)),
  warning: (message: string, options?: NotifyOptions) =>
    toast.warning(message, buildOptions(options)),
};
