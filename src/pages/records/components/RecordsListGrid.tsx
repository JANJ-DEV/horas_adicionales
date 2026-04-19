import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import type { RecordService } from "@/services/records.service";
import { calculateSalary, calculateWorkedHours } from "@/utils";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./RecordsListGrid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type RecordsListGridProps = {
  records: RecordService[];
  branchNameById: Record<string, string>;
  jobPositionNameByCompositeKey: Record<string, string>;
  onViewDetails: (recordId: string) => void;
  onDeleteRecord: (recordId: string) => void;
};

type RecordGridRow = {
  id: string;
  dateLabel: string;
  titleJobProfile: string;
  branchLabel: string;
  jobPositionLabel: string;
  workedHoursLabel: string;
  salaryLabel: string;
};

const formatDateLabel = (value: RecordService["dateTimeRecord"]) => {
  if (!value) return "Sin fecha";
  if (value instanceof Date) return value.toLocaleDateString();

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString();
};

const RecordsListGrid = ({
  records,
  branchNameById,
  jobPositionNameByCompositeKey,
  onViewDetails,
  onDeleteRecord,
}: RecordsListGridProps) => {
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  const rowData = useMemo<RecordGridRow[]>(() => {
    return records.map((record) => {
      const worked = calculateWorkedHours(record.workStartTime ?? "", record.workEndTime ?? "");
      const salary = calculateSalary(worked.decimal, Number(record.estimatedHourlyRate ?? 0));
      const branchLabel = record.branchId ? (branchNameById[record.branchId] ?? "") : "";
      const jobPositionLabel =
        record.branchId && record.jobPositionId
          ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ?? "")
          : "";

      return {
        id: String(record.id ?? ""),
        dateLabel: formatDateLabel(record.dateTimeRecord),
        titleJobProfile: record.titleJobProfile,
        branchLabel: branchLabel || "No especificada",
        jobPositionLabel: jobPositionLabel || "No especificado",
        workedHoursLabel: worked.formatted,
        salaryLabel: `${salary.toFixed(2)} EUR`,
      };
    });
  }, [records, branchNameById, jobPositionNameByCompositeKey]);

  const columnDefs = useMemo<ColDef<RecordGridRow>[]>(
    () => [
      {
        field: "dateLabel",
        headerName: "Fecha",
        minWidth: 100,
        width: isMobileViewport ? 112 : undefined,
        flex: isMobileViewport ? undefined : 0.9,
        cellRenderer: ({ data, value }: ICellRendererParams<RecordGridRow, string>) => (
          <span data-record-anchor={data?.id} data-record-variant="mobile">
            {value}
          </span>
        ),
      },
      {
        field: "titleJobProfile",
        headerName: "Perfil",
        minWidth: 150,
        width: isMobileViewport ? 170 : undefined,
        flex: isMobileViewport ? undefined : 1.1,
        hide: isMobileViewport,
      },
      {
        field: "branchLabel",
        headerName: "Rama",
        minWidth: 140,
        width: isMobileViewport ? 160 : undefined,
        flex: isMobileViewport ? undefined : 1,
        hide: isMobileViewport,
      },
      {
        field: "jobPositionLabel",
        headerName: "Puesto",
        minWidth: 170,
        width: isMobileViewport ? 190 : undefined,
        flex: isMobileViewport ? undefined : 1.2,
        hide: isMobileViewport,
      },
      {
        field: "workedHoursLabel",
        headerName: "Horas",
        minWidth: 88,
        width: isMobileViewport ? 96 : undefined,
        flex: isMobileViewport ? undefined : 0.8,
      },
      {
        field: "salaryLabel",
        headerName: "Sueldo",
        minWidth: 108,
        width: isMobileViewport ? 120 : undefined,
        flex: isMobileViewport ? undefined : 0.9,
      },
      {
        field: "id",
        headerName: "Acciones",
        minWidth: 176,
        width: isMobileViewport ? 188 : 220,
        sortable: false,
        filter: false,
        suppressSizeToFit: true,
        cellStyle: { paddingRight: "12px" },
        cellRenderer: ({ value }: ICellRendererParams<RecordGridRow, string>) => {
          const recordId = String(value ?? "");

          return (
            <div className="flex h-full w-full items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-slate-950 transition duration-200 hover:bg-[var(--accent-strong)] hover:text-white"
                onClick={() => onViewDetails(recordId)}
              >
                Detalles
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--danger)] px-3 py-1 text-xs font-semibold text-white transition duration-200 hover:opacity-90"
                onClick={() => onDeleteRecord(recordId)}
              >
                Eliminar
              </button>
            </div>
          );
        },
      },
    ],
    [isMobileViewport, onViewDetails, onDeleteRecord]
  );

  return (
    <article className="app-surface overflow-hidden p-2">
      <div className="records-list-grid ag-theme-quartz min-h-[120px] w-full overflow-x-auto rounded-xl">
        <AgGridReact<RecordGridRow>
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: false, resizable: true }}
          animateRows
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={48}
        />
      </div>
    </article>
  );
};

export default RecordsListGrid;
