import type { RecordService } from "@/services/records.service";
import type { FC } from "react";
import RecordedTimeInfo from "./RecordedTimeInfo";
import RecordCalculationSummary from "@/components/RecordCalculationSummary";
import Btn from "@/components/Btn";

interface RecordCardProps {
  record: RecordService;
  handlerViewDetails: (recordId: string) => void;
  handleDeleteRecord: (recordId: string) => void;
}

const RecordCard: FC<RecordCardProps> = ({ record, handlerViewDetails, handleDeleteRecord }) => {
  return (
    <div key={record.id} className="w-full max-w-96 lg:max-w-auto flex flex-col gap-4 border p-4 rounded bg-slate-800/50">
      <RecordedTimeInfo record={record} />
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
