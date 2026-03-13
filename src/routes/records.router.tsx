// Pages
import { recordActions } from "./actions";
import { AddNewRecord, Records, RecordsLayout, DetailsRecord } from "./lazy.load";

// Router
export const recordsRouter = [
  {
    path: "/records",
    element: <RecordsLayout />,
    children: [
      {
        index: true,
        element: <Records />,
      },
      {
        path: "add",
        element: <AddNewRecord />,
        action: recordActions.add,
      },
      {
        path: "details/:id",
        element: <DetailsRecord />,
      },
    ],
  },
];
