import { ToastContainer } from "react-toastify";
import { useJobsProfiles } from "./hooks/useJobsProfiles";
import JobProfileCard from "./components/JobProfileCard";
import Loading from "@/components/Loading";
import ErrorApp from "@/components/Error";
import CardsLayout from "./components/CardsLayout";

type PropsJobProfiles = {
  variant?: "default";
};

const JobProfiles = ({ variant = "default" }: PropsJobProfiles) => {
  const { isLoading, isError, errorMessage, jobs, hasCurrentUser } = useJobsProfiles();
  const variantsStyles = {
    default: "flex flex-col gap-4",
  };

  return (
    <section className={variantsStyles[variant]}>
      {hasCurrentUser && isLoading && <Loading variant="load" size={48} />}
      {hasCurrentUser && <ErrorApp isError={isError} errorMessage={errorMessage} />}
      {hasCurrentUser && (
        <CardsLayout variant="default">
          {" "}
          {jobs.map((jobProfile) => {
            return <JobProfileCard key={jobProfile.id} jobProfile={jobProfile} />;
          })}
        </CardsLayout>
      )}
      <ToastContainer containerId="profile" position="top-right" />
    </section>
  );
};

export default JobProfiles;
