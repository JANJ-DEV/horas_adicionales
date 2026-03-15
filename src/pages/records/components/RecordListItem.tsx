import Btn from "@/components/Btn";
import { calculateSalary, calculateWorkedHours } from "@/utils";
import type { RecordService } from "@/services/records.service";

type RecordListItemProps = {
  record: RecordService;
  branchName?: string;
  jobPositionName?: string;
  onViewDetails: (recordId: string) => void;
  onDeleteRecord: (recordId: string) => void;
};

const RecordListItem = ({
  record,
  branchName,
  jobPositionName,
  onViewDetails,
  onDeleteRecord,
}: RecordListItemProps) => {
  const hasWorkedTime = Boolean(record.workStartTime && record.workEndTime);
  const workedHours = hasWorkedTime
    ? calculateWorkedHours(record.workStartTime as string, record.workEndTime as string)
    : { formatted: "0h 00m", decimal: 0 };
  const salary = calculateSalary(workedHours.decimal, Number(record.estimatedHourlyRate ?? 0));

  return (
    <article className="app-card flex flex-col gap-3 p-4 lg:hidden">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-[var(--font-display)] text-base font-semibold text-[var(--text)]">
            {record.titleJobProfile}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">{String(record.dateTimeRecord)}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text)]">
        <p>
          <strong>Rama:</strong> {branchName || "No especificada"}
        </p>
        <p>
          <strong>Puesto:</strong> {jobPositionName || "No especificado"}
        </p>
        <p>
          <strong>Horas:</strong> {workedHours.formatted}
        </p>
        <p>
          <strong>Sueldo:</strong> {salary.toFixed(2)} EUR
        </p>
      </div>

      <footer className="mt-1 flex items-center justify-end gap-2">
        <Btn label="Detalles" variant="info" onClick={() => onViewDetails(record.id as string)} />
        <Btn
          label="Eliminar"
          variant="danger"
          onClick={() => onDeleteRecord(record.id as string)}
        />
      </footer>
    </article>
  );
};

export default RecordListItem;
