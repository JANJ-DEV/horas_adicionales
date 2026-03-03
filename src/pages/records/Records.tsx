/* eslint-disable react-hooks/exhaustive-deps */
import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getRecords, type RecordService } from "@/services/records.service";

const Records = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordService[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = () => {
      setIsLoading(true);
      const customErrorMessage = "No tienes registros";
      getRecords(currentUser.uid).then((records) => {
        if (!records || records.length === 0) {
          // toast.warning(customErrorMessage, { containerId: "records" });
          setErrorMessage(customErrorMessage);
          setIsError(true);
          return;
        }
        setRecords(records as RecordService[]);
        console.log("User records:", records);
      }).catch(() => {
        setIsError(true);
        // toast.warning(customErrorMessage, { containerId: "records" });
        setErrorMessage(customErrorMessage);
      }).finally(() => {
        setIsLoading(false);
      });
    };
    fetchData();

    return () => {
      setRecords([]);
    };
  }, []);

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
        {records && <section className="flex flex-col gap-4">
          {records.map((record) => (
            <div key={record.id} className="flex flex-col gap-2 border p-4 rounded">
              <div className="flex justify-between">
                <p><strong>Empresa:</strong> {record.nombreEmpresa}</p>
                <p><strong>Fecha:</strong> {new Date(record.fecha).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Entrada:</strong> {record.hora_entrada}</p>
                <p><strong>Salida:</strong> {record.hora_salida}</p>
              </div>
            </div>
          ))}
        </section>}
      </article>
      <ToastContainer containerId="records" position="top-center" />
    </section>
  )
}

export default Records;
