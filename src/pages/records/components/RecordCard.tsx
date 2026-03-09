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
    <div key={record.id} className="flex flex-col gap-4 border p-4 rounded bg-slate-800/50">
      <RecordedTimeInfo record={record} />

      <section className="rounded bg-slate-900/50 p-3 flex flex-col gap-2 text-sm">
        <p className="truncate" title={branchName || "No especificada"}>
          <strong>Rama:</strong> {branchName || "No especificada"}
        </p>
        <p className="truncate" title={jobPositionName || "No especificado"}>
          <strong>Puesto:</strong> {jobPositionName || "No especificado"}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate">
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
    </div>
  );
};

export default RecordCard;
