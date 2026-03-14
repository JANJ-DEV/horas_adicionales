import useAuth from "@/context/hooks/auth.hook";
import { deleteRecord, subscribeToRecords, type RecordService } from "@/services/records.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const useRecord = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordService[]>([]);
  const customErrorMessage = "No tienes registros";
  const hasCurrentUser = Boolean(currentUser?.uid);
  const navigate = useNavigate();

  const handleDeleteRecord = async (recordId: string) => {
    const shouldDelete = window.confirm(
      "Esta accion eliminara el registro de forma permanente. Quieres continuar?"
    );

    if (!shouldDelete) return;

    await deleteRecord(recordId);
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
          setErrorMessage(customErrorMessage);
          setIsError(true);
          setIsLoading(false);
        } else {
          setRecords(records as RecordService[]);
          setIsError(false);
          setErrorMessage(null);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error al suscribirse a los registros:", error);
        setRecords([]);
        setIsError(true);
        setErrorMessage(customErrorMessage);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

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
