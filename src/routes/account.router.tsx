import {AccountLayout, Account, UpdateAccount} from "./lazy.load";

export const accountRouter = [
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      {
        index: true,
        element: <Account />
      },
      {
        path: "update",
        element: <UpdateAccount />
      }
    ]
  }
]