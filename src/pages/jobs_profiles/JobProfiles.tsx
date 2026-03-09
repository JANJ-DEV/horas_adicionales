import { ToastContainer } from "react-toastify";
import { useJobsProfiles } from "./hooks/useJobsProfiles";
import JobProfileCard from "./components/JobProfileCard";

const JobProfiles = () => {
  const { isLoading, isError, errorMessage, jobs, hasCurrentUser } = useJobsProfiles();

  return (
    <section className="flex flex-col gap-4">
      {hasCurrentUser && isLoading && <p>Cargando...</p>}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="flex flex-col gap-4 bg-black/50 p-4 rounded">
          <p className="text-yellow-300">{errorMessage}</p>
        </aside>
      )}
      <section className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(hasCurrentUser ? jobs : []).map((jobProfile) => {
          return <JobProfileCard key={jobProfile.id} jobProfile={jobProfile} />;
        })}
      </section>
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
