/* eslint-disable react-hooks/exhaustive-deps */
import { firestore } from "@/apis/firebase";
import useAuth from "@/context/hooks/auth.hook";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
// import {  toast, ToastContainer} from 'react-toastify';

export interface JobProfile {
  id?: string;
  nombrePerfil: string;
  puestoTrabajo: string;
  descripcion: string;
}

const JobProfiles = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const [userData, setUserData] = useState<JobProfile[] | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const refUser = collection(firestore, `users`, currentUser.uid, `job_profiles`);
        onSnapshot(refUser, (snapshot) => {
          if (snapshot.empty) {
            const customErrorMessage = "No tienes ningun perfil de trabajo";
            // toast.error(customErrorMessage, { containerId: "profile" });
            setErrorMessage(customErrorMessage);
            setIsError(true);
            return;
          } else {
            setUserData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobProfile)));
          }
        });
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      setUserData(null);
    };
  }, []);

  return (
    <section className="flex items-center justify-center">
      {isLoading && <p>Cargando...</p>}
      {isError && errorMessage && (<section className="flex flex-col gap-4">
        <p className="text-red-300">{errorMessage}</p>
        <button type="button" className="text-white font-black py-2 px-4 border-2 border-white rounded-sm hover:bg-green-500/20">
          Crea perfil de trabajo
        </button>
      </section>)}
      {userData && userData.length > 0 && (
        <section className="flex flex-col gap-4">
          {userData.map((job) => (
            <div key={job.id} className="flex flex-col gap-2 p-4 border-2 border-white rounded-sm">
              <div>
                <h2 className="text-2xl font-bold text-orange-300">{job.nombrePerfil}</h2>
                <p className="text-sm font-bold text-gray-300">{job.puestoTrabajo}</p>
                <p className="text-sm font-bold text-gray-300">{job.descripcion}</p>
              </div>
              <footer className="flex justify-end gap-4 mt-2">
                <button type="button" className="border border-blue-300/50 rounded-sm hover:bg-green-500/20 py-2 px-4">
                  Editar
                </button>
                <button type="button" className="border border-red-300/50 rounded-sm hover:bg-green-500/20 py-2 px-4">
                  Borrar
                </button>
              </footer>
            </div>
          ))}
        </section>
      )}
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  )
}

export default JobProfiles;
