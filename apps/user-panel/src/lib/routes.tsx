import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Center, Loader } from '@repo/mantine';
import { UserLayout } from '@/components/Layout/UserLayout';
import { ProtectedRoute, PublicRoute } from '@/components/Auth/AuthRoutes';

// Lazy loaded pages
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const CreateTask = lazy(() => import('@/pages/CreateTask').then(m => ({ default: m.CreateTask })));
const MyTasks = lazy(() => import('@/pages/MyTasks').then(m => ({ default: m.MyTasks })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));

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
        element: <UserLayout />,
        children: [
          { path: '/dashboard', element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
          { path: '/tasks', element: <Suspense fallback={<PageLoader />}><MyTasks /></Suspense> },
          { path: '/tasks/create', element: <Suspense fallback={<PageLoader />}><CreateTask /></Suspense> },
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
