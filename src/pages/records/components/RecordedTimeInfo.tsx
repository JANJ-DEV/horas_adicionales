import type { RecordService } from "@/services/records.service";
import type { FC } from "react";

interface RecordedTimeInfoProps {
  record: RecordService;
}

const RecordedTimeInfo: FC<RecordedTimeInfoProps> = ({ record }) => {
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="min-w-0 break-all">
          <strong>Empresa:</strong> {record.titleJobProfile}
        </p>
        <p className="shrink-0 sm:pl-3">
          <strong>Fecha:</strong> {new Date(record.dateTimeRecord).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="min-w-0 break-all">
          <strong>Entrada:</strong> {record.workStartTime}
        </p>
        <p className="sm:pl-3">
          <strong>Salida:</strong> {record.workEndTime}
        </p>
      </div>
    </>
  );
};

export default RecordedTimeInfo;
