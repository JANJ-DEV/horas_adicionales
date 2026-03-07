import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getRecords, type RecordService } from "@/services/records.service";

const Records = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordService[]>([]);
  const visibleRecords = currentUser ? records : [];

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    let isMounted = true;

    const fetchData = () => {
      setIsLoading(true);
      const customErrorMessage = "No tienes registros";
      getRecords(currentUser.uid)
        .then((records) => {
          if (!isMounted) return;
          if (!records || records.length === 0) {
            setErrorMessage(customErrorMessage);
            setIsError(true);
          } else {
            setRecords(records as RecordService[]);
            setIsError(false);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setIsError(true);
          setErrorMessage(customErrorMessage);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <section className="flex flex-col gap-4">
      {isLoading && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">Cargando registros...</p>
        </aside>
      )}
      {isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}
      <article>
        {visibleRecords && (
          <section className="flex flex-col gap-4">
            {visibleRecords.map((record) => (
              <div key={record.id} className="flex flex-col gap-2 border p-4 rounded">
                <div className="flex justify-between">
                  <p>
                    <strong>Empresa:</strong> {record.titleJobProfile}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {new Date(record.dateTimeRecord).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    <strong>Entrada:</strong> {record.workStartTime}
                  </p>
                  <p>
                    <strong>Salida:</strong> {record.workEndTime}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}
      </article>
      <ToastContainer containerId="records" position="top-center" />
    </section>
  );
};

export default Records;
