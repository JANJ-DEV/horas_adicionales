import { ToastContainer } from "react-toastify";
import { useRecord } from "./hooks/useRecord";
import RecordCard from "./components/RecordCard";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.services";
import type { Branch } from "@/types";

const Records = () => {
  const {
    records,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
  } = useRecord();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToBranches((nextBranches) => {
      setBranches(nextBranches);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const branchNameById = Object.fromEntries(
    branches.map((branch) => [branch.id, branch.name])
  ) as Record<string, string>;

  const jobPositionNameByCompositeKey = branches.reduce<Record<string, string>>((acc, branch) => {
    (branch.jobsPositions ?? []).forEach((job) => {
      acc[`${branch.id}:${job.id}`] = job.name;
    });

    return acc;
  }, {});

  return (
    <section className="flex flex-col gap-4">
      {hasCurrentUser && isLoading && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">Cargando registros...</p>
        </aside>
      )}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}

      {(hasCurrentUser ? records : []) && (
        <section className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(hasCurrentUser ? records : []).map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              branchName={record.branchId ? (branchNameById[record.branchId] ?? "") : ""}
              jobPositionName={
                record.branchId && record.jobPositionId
                  ? (jobPositionNameByCompositeKey[`${record.branchId}:${record.jobPositionId}`] ??
                    "")
                  : ""
              }
              handlerViewDetails={handlerViewDetails}
              handleDeleteRecord={handleDeleteRecord}
            />
          ))}
        </section>
      )}

      <ToastContainer containerId="records" position="top-center" />
    </section>
  );
};

export default Records;
