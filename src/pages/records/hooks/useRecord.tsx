import useAuth from "@/context/hooks/auth.hook";
import { handleAppError } from "@/services/error.service";
import {
  deleteRecord,
  subscribeToRecords,
  type RecordsQueryFilters,
  type RecordService,
} from "@/services/records.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

export const useRecord = (queryFilters?: RecordsQueryFilters) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordService[]>([]);
  const filterBranchId = queryFilters?.branchId;
  const filterJobPositionId = queryFilters?.jobPositionId;
  const filterJobProfileId = queryFilters?.jobProfileId;
  const filterDateFrom = queryFilters?.dateFrom;
  const filterDateTo = queryFilters?.dateTo;
  const hasCurrentUser = Boolean(currentUser?.uid);
  const navigate = useNavigate();

  const handleDeleteRecord = async (recordId: string) => {
    const shouldDelete = window.confirm(
      "Esta accion eliminara el registro de forma permanente. Quieres continuar?"
    );

    if (!shouldDelete) return;

    const removed = await deleteRecord(recordId);
    if (removed) {
      notify.success("Registro eliminado con éxito", { scope: TOAST_SCOPE.RECORDS });
      return;
    }

    notify.error("No se pudo eliminar el registro", { scope: TOAST_SCOPE.RECORDS });
  };
  const handlerViewDetails = (recordId: string) => {
    navigate(`/records/details/${recordId}`);
  };

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const unsubscribe = subscribeToRecords(
      (records) => {
        if (!records || records.length === 0) {
          setRecords([]);
          setErrorMessage(null);
          setIsError(false);
          setIsLoading(false);
        } else {
          setRecords(records as RecordService[]);
          setIsError(false);
          setErrorMessage(null);
          setIsLoading(false);
        }
      },
      (error) => {
        handleAppError(error, "useRecord.subscribeToRecords");
        setRecords([]);
        setIsError(true);
        setErrorMessage("Error al cargar los registros");
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
      {
        branchId: filterBranchId,
        jobPositionId: filterJobPositionId,
        jobProfileId: filterJobProfileId,
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [
    currentUser?.uid,
    filterBranchId,
    filterJobPositionId,
    filterJobProfileId,
    filterDateFrom,
    filterDateTo,
  ]);

  return {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
    navigate,
  };
};
