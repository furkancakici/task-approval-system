import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Center, Loader } from '@repo/mantine';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { ProtectedRoute, PublicRoute } from '@/components/Auth/AuthRoutes';

// Lazy loaded pages
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Users = lazy(() => import('@/pages/Users').then((m) => ({ default: m.Users })));
const PendingTasks = lazy(() => import('@/pages/PendingTasks').then((m) => ({ default: m.PendingTasks })));
const AllTasks = lazy(() => import('@/pages/AllTasks').then((m) => ({ default: m.AllTasks })));

import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@repo/types';

// Role Guard Component
const RoleGuard = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Shared Page Loader
const PageLoader = () => (
  <Center
    style={{
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      background: 'var(--mantine-color-body)',
    }}
  >
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: '/users',
            element: (
              <RoleGuard roles={[UserRole.ADMIN]}>
                <Suspense fallback={<PageLoader />}>
                  <Users />
                </Suspense>
              </RoleGuard>
            ),
          },
          {
            path: '/tasks/pending',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PendingTasks />
              </Suspense>
            ),
          },
          {
            path: '/tasks/all',
            element: (
              <RoleGuard roles={[UserRole.ADMIN, UserRole.MODERATOR]}>
                <Suspense fallback={<PageLoader />}>
                  <AllTasks />
                </Suspense>
              </RoleGuard>
            ),
          },
          { path: '/', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
