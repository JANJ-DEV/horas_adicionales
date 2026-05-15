import AppToastContainer from "@/components/AppToastContainer";
import { useJobsProfiles } from "./hooks/useJobsProfiles";
import { lazy, Suspense } from "react";
import ErrorApp from "@/components/Error";
import CardsLayout from "./components/CardsLayout";
import ProfileCardSkeleton from "./components/ProfileCardSkeleton";
import EmptyState from "@/components/EmptyState";

const JobProfileCard = lazy(() => import("./components/JobProfileCard"));

type PropsJobProfiles = {
  variant?: "default";
};

const JobProfiles = ({ variant = "default" }: PropsJobProfiles) => {
  const { isLoading, isError, errorMessage, jobs, hasCurrentUser } = useJobsProfiles();
  const skeletonCards = Array.from({ length: 3 }, (_, index) => (
    <ProfileCardSkeleton key={`job-profile-skeleton-${index}`} variant="skeleton" />
  ));

  const variantsStyles = {
    default: "flex flex-col gap-4",
  };

  return (
    <section className={variantsStyles[variant]}>
      {hasCurrentUser && isLoading && <CardsLayout variant="default">{skeletonCards}</CardsLayout>}
      {hasCurrentUser && !isLoading && <ErrorApp isError={isError} errorMessage={errorMessage} />}
      {hasCurrentUser && !isLoading && !isError && jobs.length === 0 && (
        <EmptyState
          title="Aún no tienes perfiles de trabajo"
          description="Crea tu primer perfil para comenzar a registrar jornadas."
        />
      )}
      {hasCurrentUser && !isLoading && !isError && jobs.length > 0 && (
        <Suspense fallback={<CardsLayout variant="default">{skeletonCards}</CardsLayout>}>
          <CardsLayout variant="default">
            {jobs.map((jobProfile) => {
              return <JobProfileCard key={jobProfile.id} jobProfile={jobProfile} />;
            })}
          </CardsLayout>
        </Suspense>
      )}
      <AppToastContainer containerId="profile" position="top-center" />
    </section>
  );
};

export default JobProfiles;
