import { getRecordById, type RecordService } from "@/services/records.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const useDetailRecord = () => {
  // Aquí puedes agregar cualquier lógica adicional que necesites para el componente DetailsRecord
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RecordService | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (id) {
        const fetchedRecord = await getRecordById(id);
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
