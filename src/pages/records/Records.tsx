import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { subscribeToRecords, deleteRecord, type RecordService } from "@/services/records.service";
import Btn from "@/components/Btn";

const Records = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordService[]>([]);
  const customErrorMessage = "No tienes registros";
  const hasCurrentUser = Boolean(currentUser?.uid);

  const handleDeleteRecord = (recordId: string) => {
    alert("Funcionalidad en desarrollo");
    deleteRecord(recordId);
  };

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const unsubscribe = subscribeToRecords(
      (records) => {
        if (!records || records.length === 0) {
          setRecords([]);
          setErrorMessage(customErrorMessage);
          setIsError(true);
          setIsLoading(false);
        } else {
          setRecords(records as RecordService[]);
          setIsError(false);
          setErrorMessage(null);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error al suscribirse a los registros:", error);
        setRecords([]);
        setIsError(true);
        setErrorMessage(customErrorMessage);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

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
          <section className="flex flex-col gap-4">
            {(hasCurrentUser ? records : []).map((record) => (
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
                {record.id && <p className="text-sm text-gray-500">ID: {record.id}</p>}
                <footer className="flex gap-2 justify-end">
                  <Btn
                    label="Ver detalles"
                    onClick={() => alert("Funcionalidad en desarrollo")}
                    variant="info"
                  />
                  <Btn
                    label="Eliminar"
                    onClick={() => handleDeleteRecord(record.id as string)}
                    variant="danger"
                  />
                </footer>
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
