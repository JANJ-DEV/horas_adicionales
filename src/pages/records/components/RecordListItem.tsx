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
  const dateLabel = record.dateTimeRecord
    ? new Date(String(record.dateTimeRecord)).toLocaleDateString()
    : "Sin fecha";

  return (
    <article className="app-card flex flex-col gap-3 p-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">
            {record.titleJobProfile}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{dateLabel}</p>
        </div>
        <p className="shrink-0 text-xs font-semibold text-[var(--accent)]">
          {workedHours.formatted}
        </p>
      </header>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
        <p className="text-xs text-[var(--text-soft)]">Sueldo estimado</p>
        <p className="text-sm font-semibold text-[var(--success)]">{salary.toFixed(2)} EUR</p>
      </div>

      <p className="hidden text-xs text-[var(--text-muted)] md:block">
        {branchName || "Sin rama"} · {jobPositionName || "Sin puesto"}
      </p>

      <footer className="mt-1 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(record.id as string)}
          className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Detalles
        </button>
        <button
          type="button"
          onClick={() => onDeleteRecord(record.id as string)}
          className="rounded-full border border-transparent bg-[var(--danger)]/16 px-3 py-1.5 text-xs font-semibold text-[var(--danger)] transition duration-200 hover:bg-[var(--danger)] hover:text-white"
        >
          Eliminar
        </button>
      </footer>
    </article>
  );
};

export default RecordListItem;
