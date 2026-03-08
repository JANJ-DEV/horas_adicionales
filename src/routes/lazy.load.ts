import { lazy } from "react";

// Pages
const App = lazy(() => import("../pages/App.tsx"));
const JobProfiles = lazy(() => import("../pages/jobs_profiles/JobProfiles.tsx"));
const Records = lazy(() => import("../pages/records/Records.tsx"));
const PageNotFound = lazy(() => import("../pages/layouts/PageNotFound.tsx"));
const PrivateLayout = lazy(() => import("../pages/layouts/PrivateLayout.tsx"));
const PublicLayout = lazy(() => import("../pages/layouts/PublicLayout.tsx"));
const AddNewRecord = lazy(() => import("../pages/records/AddNewRecord.tsx"));
const RecordsLayout = lazy(() => import("../pages/records/RecordsLayout.tsx"));
const JobProfilesLayout = lazy(() => import("../pages/jobs_profiles/JobProfilesLayout.tsx"));
const CreateJobProfile = lazy(() => import("../pages/jobs_profiles/CreateJobProfile.tsx"));
const AccountLayout = lazy(() => import("../pages/account/AccountLayout.tsx"));
const Account = lazy(() => import("../pages/account/Account.tsx"));
const UpdateAccount = lazy(() => import("../pages/account/UpdateAccount.tsx"));
const DetailsRecord = lazy(() => import("../pages/records/DetailsRecord.tsx"));

export {
  App,
  JobProfiles,
  Records,
  RecordsLayout,
  PageNotFound,
  PrivateLayout,
  PublicLayout,
  AddNewRecord,
  JobProfilesLayout,
  CreateJobProfile,
  AccountLayout,
  Account,
  UpdateAccount,
  DetailsRecord,
};
