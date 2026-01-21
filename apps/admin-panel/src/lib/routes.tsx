import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { AdminLayout } from '../components/Layout/AdminLayout';
import { ProtectedRoute, PublicRoute } from '../components/Auth/AuthRoutes';

// Lazy loaded pages
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Users = lazy(() => import('../pages/Users').then(m => ({ default: m.Users })));
const PendingTasks = lazy(() => import('../pages/PendingTasks').then(m => ({ default: m.PendingTasks })));
const AllTasks = lazy(() => import('../pages/AllTasks').then(m => ({ default: m.AllTasks })));

// Shared Page Loader
const PageLoader = () => (
  <Center style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'var(--mantine-color-body)' }}>
    <Loader size="xl" variant="bars" />
  </Center>
);

// Router configuration
export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Suspense fallback={<PageLoader />}><Login /></Suspense>
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/dashboard', element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
          { path: '/users', element: <Suspense fallback={<PageLoader />}><Users /></Suspense> },
          { path: '/tasks/pending', element: <Suspense fallback={<PageLoader />}><PendingTasks /></Suspense> },
          { path: '/tasks/all', element: <Suspense fallback={<PageLoader />}><AllTasks /></Suspense> },
          { path: '/', element: <Navigate to="/dashboard" replace /> }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);
