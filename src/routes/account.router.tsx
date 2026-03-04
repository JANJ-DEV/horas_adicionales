import { AccountLayout, Account, UpdateAccount } from "./lazy.load";
import { updateJobProfileAction } from "./actions";

export const accountRouter = [
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      {
        index: true,
        element: <Account />,
      },
      {
        path: "update",
        element: <UpdateAccount />,
        action: updateJobProfileAction,
      },
    ],
  },
];
