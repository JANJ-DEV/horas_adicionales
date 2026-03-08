// Pages
import type { ActionFunctionArgs } from "react-router";
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
        action: async ({ request }: ActionFunctionArgs) => {
          console.log(request);
        },
      },
    ],
  },
];
