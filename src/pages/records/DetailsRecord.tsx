import Btn from "@/components/Btn";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import { useDetailRecord } from "./hooks/useDeyailsRecord";
import EmptyState from "@/components/EmptyState";

const DetailsRecord = () => {
  const { record, navigate } = useDetailRecord();

  if (!record) {
    return (
      <EmptyState
        title="No se encontraron detalles del registro."
        actionLabel="Volver a registros"
        onAction={() => navigate("/records")}
        fullScreen
      />
    );
  }

  return (
    <section className="mt-8 flex flex-col gap-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <header className="border-b border-slate-700 pb-4 flex justify-between items-center">
        <section>
          <h2 className="text-3xl font-bold text-green-500">{record.titleJobProfile}</h2>
          <p className="text-slate-400">ID del registro: {record.id}</p>
        </section>
        <aside>
          <Btn
            label="Editar registro"
            onClick={() => alert("Funcionalidad en desarrollo")}
            variant="primary"
          />
        </aside>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-300">Información Temporal</h3>
          <div className="bg-slate-900/50 p-4 rounded">
            <p>
              <strong>Fecha:</strong> {new Date(record.dateTimeRecord).toLocaleDateString()}
            </p>
            <p>
              <strong>Hora de Entrada:</strong> {record.workStartTime}
            </p>
            <p>
              <strong>Hora de Salida:</strong> {record.workEndTime}
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-300">Metadatos</h3>
          <div className="bg-slate-900/50 p-4 rounded">
            <p>
              <strong>Creado el:</strong>{" "}
              {record.createdAt
                ? record.createdAt instanceof Date
                  ? record.createdAt.toLocaleString()
                  : record.createdAt.toDate().toLocaleString()
                : "Desconocido"}
            </p>
            <p>
              <strong>Actualizado el:</strong>{" "}
              {record.updatedAt
                ? record.updatedAt instanceof Date
                  ? record.updatedAt.toLocaleString()
                  : record.updatedAt.toDate().toLocaleString()
                : "Desconocido"}
            </p>
          </div>
        </article>
      </div>
      <RecordCalculationSummary
        startTime={record.workStartTime as string | undefined}
        endTime={record.workEndTime as string | undefined}
        hourlyRate={record.estimatedHourlyRate as number}
      />
    </section>
  );
};

export default DetailsRecord;
