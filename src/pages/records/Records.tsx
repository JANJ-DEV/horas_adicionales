import { ToastContainer } from "react-toastify";
import { useRecord } from "./hooks/useRecord";
import RecordCard from "./components/RecordCard";

const Records = () => {
  const {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
  } = useRecord();

  return (
    <section className="flex flex-col gap-4">
      {hasCurrentUser && isLoading && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">Cargando registros...</p>
        </aside>
      )}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}
      <article>
        {(hasCurrentUser ? records : []) && (
          <section className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
            {(hasCurrentUser ? records : []).map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                handlerViewDetails={handlerViewDetails}
                handleDeleteRecord={handleDeleteRecord}
              />
            ))}
          </section>
        )}
      </article>
      <ToastContainer containerId="records" position="top-center" />
    </section>
  );
};

export default Records;
