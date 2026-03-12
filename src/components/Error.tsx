type ErrorAppProps = {
  isError: boolean;
  errorMessage: string | null;
};
const ErrorApp = ({ isError, errorMessage }: ErrorAppProps) => {
  return (
    isError &&
    errorMessage && (
      <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
        <p className="text-yellow-300">{errorMessage}</p>
      </aside>
    )
  );
};

export default ErrorApp;
