type ErrorAppProps = {
  isError: boolean;
  errorMessage: string | null;
};
const ErrorApp = ({ isError, errorMessage }: ErrorAppProps) => {
  return (
    isError &&
    errorMessage && (
      <aside className="app-card flex flex-col gap-4 p-4 sm:p-5">
        <p className="text-sm font-semibold text-[var(--danger)]">{errorMessage}</p>
      </aside>
    )
  );
};

export default ErrorApp;
