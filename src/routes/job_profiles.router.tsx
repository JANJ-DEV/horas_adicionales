// Pages
import { JobProfiles, JobProfilesLayout, CreateJobProfile, JobProfileDetails } from "./lazy.load";
import { jobsProfileActions } from "./actions";

// Router
export const jobProfilesRouter = [
  {
    path: "/jobs-profiles",
    element: <JobProfilesLayout />,
    children: [
      {
        index: true,
        element: <JobProfiles />,
      },
      {
        path: "add",
        element: <CreateJobProfile />,
        action: jobsProfileActions.add,
      },
      {
        path: ":id",
        element: <JobProfileDetails />,
      },
    ],
  },
];
