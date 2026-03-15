import AppToastContainer from "@/components/AppToastContainer";
import { useJobsProfiles } from "./hooks/useJobsProfiles";
import { lazy, Suspense } from "react";
import ErrorApp from "@/components/Error";
import CardsLayout from "./components/CardsLayout";
import ProfileCardSkeleton from "./components/ProfileCardSkeleton";

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
      {hasCurrentUser && !isLoading && !isError && (
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
