import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LoversPage } from './pages/LoversPage';
import { ChatPage } from './pages/ChatPage';
import { SetupPage } from './pages/SetupPage';
import { DailyPage } from './pages/DailyPage';
import { NewsPage } from './pages/NewsPage';
import { SettingsPage } from './pages/SettingsPage';
import {LoginPage, RegisterPage} from './pages/LoginPage';
import React from 'react';

function AuthRoute({ element }: { element: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  // 可扩展token过期校验
  return <>{element}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AuthRoute element={<LoversPage />} />,
      },
      {
        path: '/lovers',
        element: <AuthRoute element={<LoversPage />} />,
      },
      {
        path: '/chat',
        element: <AuthRoute element={<ChatPage />} />,
      },
      {
        path: '/setup',
        element: <AuthRoute element={<SetupPage />} />,
      },
      {
        path: '/daily',
        element: <AuthRoute element={<DailyPage />} />,
      },
      {
        path: '/news',
        element: <AuthRoute element={<NewsPage />} />,
      },
      {
        path: '/settings',
        element: <AuthRoute element={<SettingsPage />} />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);
