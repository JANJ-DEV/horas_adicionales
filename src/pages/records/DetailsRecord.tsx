import Btn from "@/components/Btn";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import { useDetailRecord } from "./hooks/useDeyailsRecord";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import useUtilities from "@/context/hooks/useUtilities.hook";
import { getBranchById } from "@/services/branches.services";

const UTILITY_DB_KEY_FALLBACK: Record<string, string> = {
  nombre_produccion: "production_name",
  ruta_origen_destino: "route_origin_destination",
};

const DetailsRecord = () => {
  const { record, navigate } = useDetailRecord();
  const { catalog } = useUtilities();
  const [branchName, setBranchName] = useState<string>("");
  const [jobPositionName, setJobPositionName] = useState<string>("");

  const utilityLabelsByStorageKey = Object.entries(catalog.utility_definitions).reduce<
    Record<string, string>
  >((acc, [utilityId, definition]) => {
    const storageKey =
      definition.dbKey ?? definition.db_key ?? UTILITY_DB_KEY_FALLBACK[utilityId] ?? utilityId;

    acc[storageKey] = definition.label ?? utilityId;
    return acc;
  }, {});

  const utilityEntries = record?.utilitiesValues
    ? Object.entries(record.utilitiesValues).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    : [];

  useEffect(() => {
    let isMounted = true;

    const loadProfileContext = async () => {
      if (!record?.branchId) {
        if (!isMounted) return;
        setBranchName("");
        setJobPositionName("");
        return;
      }

      const branch = await getBranchById(record.branchId);
      if (!isMounted) return;

      if (!branch) {
        setBranchName("");
        setJobPositionName("");
        return;
      }

      setBranchName(branch.name ?? "");

      if (!record.jobPositionId) {
        setJobPositionName("");
        return;
      }

      const jobPosition = (branch.jobsPositions ?? []).find(
        (job) => job.id === record.jobPositionId
      );
      setJobPositionName(jobPosition?.name ?? "");
    };

    loadProfileContext();

    return () => {
      isMounted = false;
    };
  }, [record?.branchId, record?.jobPositionId]);

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
    <section className="app-surface mt-8 flex flex-col gap-6 rounded-[1.5rem] p-6">
      <header className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <section>
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-[var(--text)]">
            {record.titleJobProfile}
          </h2>
          <p className="text-[var(--text-muted)]">ID del registro: {record.id}</p>
        </section>
        <aside>
          <Btn
            label="Editar"
            onClick={() => navigate(`/records/edit/${record.id}`)}
            variant="primary"
          />
        </aside>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-[var(--text)]">Informacion temporal</h3>
          <div className="app-card min-h-32 p-4 text-[var(--text)]">
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
          <h3 className="text-lg font-semibold text-[var(--text)]">Metadatos</h3>
          <div className="app-card min-h-32 p-4 text-[var(--text)]">
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
            <p>
              <strong>Rama:</strong> {branchName || "No especificada"}
            </p>
            <p>
              <strong>Puesto:</strong> {jobPositionName || "No especificado"}
            </p>
          </div>
        </article>
      </div>
      <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <div className="min-h-32 [&>footer]:min-h-32">
          <RecordCalculationSummary
            startTime={record.workStartTime as string | undefined}
            endTime={record.workEndTime as string | undefined}
            hourlyRate={record.estimatedHourlyRate as number}
          />
        </div>

        <article>
          <div className="app-card flex min-h-32 flex-col gap-2 p-4 text-[var(--text)]">
            <h3 className="text-lg font-semibold text-[var(--text)]">Utilidades registradas</h3>
            {utilityEntries.length === 0 && (
              <p className="text-[var(--text-muted)]">
                Este registro no incluye utilidades adicionales.
              </p>
            )}

            {utilityEntries.map(([storageKey, value]) => (
              <p key={storageKey} className="break-words">
                <strong>{utilityLabelsByStorageKey[storageKey] ?? storageKey}:</strong>{" "}
                {String(value)}
              </p>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
};

export default DetailsRecord;
