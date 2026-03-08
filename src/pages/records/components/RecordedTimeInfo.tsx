import type { RecordService } from "@/services/records.service";
import type { FC } from "react";

interface RecordedTimeInfoProps {
  record: RecordService;
}

const RecordedTimeInfo: FC<RecordedTimeInfoProps> = ({ record }) => {
  return (
    <>
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
    </>
  );
};

export default RecordedTimeInfo;
