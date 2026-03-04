// Pages
import { JobProfiles, JobProfilesLayout, CreateJobProfile } from "./lazy.load";
import { addJobProfileAction } from "./actions";

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
        action: addJobProfileAction,
      },
    ],
  },
];
