// Pages
import { JobProfiles, JobProfilesLayout, CreateJobProfile } from "./lazy.load";
import { jobsProfileActions } from "./actions";

// Router
export const jobProfilesRouter = [
  {
    path: "/job-profiles",
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
    ],
  },
];
