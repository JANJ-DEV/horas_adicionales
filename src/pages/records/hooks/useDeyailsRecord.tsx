import { getRecordById, type RecordService } from "@/services/records.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

export const useDetailRecord = () => {
  // Aquí puedes agregar cualquier lógica adicional que necesites para el componente DetailsRecord
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RecordService | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (id) {
        const fetchedRecord = await getRecordById(id);
        if (!fetchedRecord) {
          notify.error("No se encontró el documento", { scope: TOAST_SCOPE.RECORDS });
        }
        setRecord(fetchedRecord);
      }
    };
    fetchRecord();
  }, [id]);

  return {
    record,
    navigate,
  };
};
