// Pages
import { addRecordAction } from './actions';
import {  AddNewRecord, Records, RecordsLayout } from './lazy.load';

// Router
export const recordsRouter = [
  {
    path: '/records',
    element: <RecordsLayout />,
    children: [
      {
        index: true,
        element: <Records />
      },
      {
        path: "add",
        element: <AddNewRecord />,
        action: addRecordAction
      }
    ]
  }
];

