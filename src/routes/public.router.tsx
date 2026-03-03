import { App, PublicLayout } from './lazy.load';

export const publicRouter = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <App />
      },
      {
        path: '/home',
        element: <App />
      },
    ]
  }
];