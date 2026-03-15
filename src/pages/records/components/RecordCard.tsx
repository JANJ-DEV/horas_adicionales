import type { RecordService } from "@/services/records.service";
import type { FC } from "react";
import RecordedTimeInfo from "./RecordedTimeInfo";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import Btn from "@/components/Btn";
import InfoTooltip from "@/components/InfoTooltip";
import useUtilities from "@/context/hooks/useUtilities.hook";

const UTILITY_DB_KEY_FALLBACK: Record<string, string> = {
  nombre_produccion: "production_name",
  ruta_origen_destino: "route_origin_destination",
};

const formatRecordDate = (value?: RecordService["createdAt"]) => {
  if (!value) return "Desconocido";
  if (value instanceof Date) return value.toLocaleString();

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const parsedDate = value.toDate();
    return parsedDate instanceof Date ? parsedDate.toLocaleString() : "Desconocido";
  }

  return "Desconocido";
};

interface RecordCardProps {
  record: RecordService;
  branchName?: string;
  jobPositionName?: string;
  handlerViewDetails: (recordId: string) => void;
  handleDeleteRecord: (recordId: string) => void;
}

const RecordCard: FC<RecordCardProps> = ({
  record,
  branchName,
  jobPositionName,
  handlerViewDetails,
  handleDeleteRecord,
}) => {
  const { catalog } = useUtilities();

  const utilityLabelsByStorageKey = Object.entries(catalog.utility_definitions).reduce<
    Record<string, string>
  >((acc, [utilityId, definition]) => {
    const storageKey =
      definition.dbKey ?? definition.db_key ?? UTILITY_DB_KEY_FALLBACK[utilityId] ?? utilityId;

    acc[storageKey] = definition.label ?? utilityId;
    return acc;
  }, {});

  const utilityEntries = record.utilitiesValues
    ? Object.entries(record.utilitiesValues).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    : [];

  return (
    <article
      key={record.id}
      className="group app-card relative flex flex-col gap-4 overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[color:var(--accent)]/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <RecordedTimeInfo record={record} />

      <section className="app-panel flex flex-col gap-2 p-3 text-sm text-[var(--text)]">
        <p title={branchName || "No especificada"}>
          <strong>Rama:</strong> {branchName || "No especificada"}
        </p>
        <p title={jobPositionName || "No especificado"}>
          <strong>Puesto:</strong> {jobPositionName || "No especificado"}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p>
            <strong>Utilidades:</strong> {utilityEntries.length}
          </p>
          <InfoTooltip
            ariaLabel="Ver informacion adicional del registro"
            content={
              <div className="flex flex-col gap-2">
                <p>
                  <strong>Creado el:</strong> {formatRecordDate(record.createdAt)}
                </p>
                <p>
                  <strong>Actualizado el:</strong> {formatRecordDate(record.updatedAt)}
                </p>
                {utilityEntries.length === 0 ? (
                  <p>Sin utilidades registradas.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {utilityEntries.map(([storageKey, value]) => (
                      <p key={storageKey} className="break-words">
                        <strong>{utilityLabelsByStorageKey[storageKey] ?? storageKey}:</strong>{" "}
                        {String(value)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            }
          />
        </div>
      </section>

      <RecordCalculationSummary
        startTime={record.workStartTime as string | undefined}
        endTime={record.workEndTime as string | undefined}
        hourlyRate={record.estimatedHourlyRate as number}
      />
      <footer className="flex gap-4 justify-end items-center">
        <Btn
          label="Detalles"
          onClick={() => handlerViewDetails(record.id as string)}
          variant="info"
        />
        <Btn
          label="Eliminar"
          onClick={() => handleDeleteRecord(record.id as string)}
          variant="danger"
        />
      </footer>
    </article>
  );
};

export default RecordCard;
