import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LoversPage } from './pages/LoversPage';
import { ChatPage } from './pages/ChatPage';
import { SetupPage } from './pages/SetupPage';
import { DailyPage } from './pages/DailyPage';
import { NewsPage } from './pages/NewsPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LoversPage />,
      },
      {
        path: '/lovers',
        element: <LoversPage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
      {
        path: '/setup',
        element: <SetupPage />,
      },
      {
        path: '/daily',
        element: <DailyPage />,
      },
      {
        path: '/news',
        element: <NewsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
