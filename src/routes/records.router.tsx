// Pages
import { recordActions } from "./actions";
import { AddNewRecord, Records, RecordsLayout, DetailsRecord, EditRecord } from "./lazy.load";

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
        path: "edit/:id",
        element: <EditRecord />,
        action: recordActions.update,
      },
      {
        path: "details/:id",
        element: <DetailsRecord />,
      },
    ],
  },
];
