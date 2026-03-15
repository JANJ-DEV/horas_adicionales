import { getJobProfileById } from "@/services/jobsProfile.service";
import type { JobProfile } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { notify, TOAST_SCOPE } from "@/services/toast.service";

const JobProfileDetails: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const [details, setDetails] = useState<JobProfile | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string" || id.trim() === "") {
      return;
    }

    getJobProfileById(id)
      .then((jobProfile) => {
        if (jobProfile) {
          setDetails(jobProfile as JobProfile);
        } else {
          notify.error("No se encontró el perfil de trabajo con el ID proporcionado", {
            scope: TOAST_SCOPE.JOBS_PROFILES,
          });
        }
      })
      .catch((error) => {
        console.error("Error al obtener el perfil de trabajo:", error);
      });
  }, [id]);

  if (!id || typeof id !== "string" || id.trim() === "") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Perfil de Trabajo no encontrado</h1>
        <p className="text-gray-700">No se ha proporcionado un ID de perfil de trabajo válido.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles del Perfil de Trabajo</h1>
      {details ? (
        <div className="text-gray-700">
          <p>
            <strong>Título:</strong> {details.title}
          </p>
          <p>
            <strong>Rama:</strong> {details.branch.name}
          </p>
          <p>
            <strong>Puesto:</strong> {details.jobPosition.name}
          </p>
          {details.estimatedHourlyRate !== undefined && (
            <p>
              <strong>Tarifa estimada:</strong> {details.estimatedHourlyRate} EUR/hora
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-700">Cargando detalles del perfil de trabajo...</p>
      )}
    </div>
  );
};

export default JobProfileDetails;
