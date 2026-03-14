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
    <article className="flex flex-col gap-3 rounded-lg border border-slate-700 bg-slate-900/70 p-4 lg:hidden">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-cyan-100">{record.titleJobProfile}</h3>
          <p className="text-xs text-slate-300">{String(record.dateTimeRecord)}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
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
