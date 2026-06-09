import { createBrowserRouter } from "react-router";

// Pages
import { PageNotFound, PrivateLayout } from "./lazy.load";
// Routers
import { jobProfilesRouter } from "./job_profiles.router";
import { recordsRouter } from "./records.router";
import { publicRouter } from "./public.router";
import { accountRouter } from "./account.router";

// Router
export const routers = [
  ...publicRouter,
  {
    element: <PrivateLayout />,
    children: [...recordsRouter, ...jobProfilesRouter, ...accountRouter],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];

// Create the router
const router = createBrowserRouter(routers);

export default router;
