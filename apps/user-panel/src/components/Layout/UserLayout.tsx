import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { IconListCheck, IconPlus, IconLayoutDashboard } from '@tabler/icons-react';
import { Text } from '@mantine/core';

export function UserLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { 
      label: 'Dashboard', 
      icon: IconLayoutDashboard, 
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard') 
    },
    { 
      label: 'My Tasks', 
      icon: IconListCheck, 
      active: location.pathname === '/tasks',
      onClick: () => navigate('/tasks') 
    },
    { 
      label: 'Create Task', 
      icon: IconPlus, 
      active: location.pathname === '/tasks/create',
      onClick: () => navigate('/tasks/create') 
    },
  ];

  return (
    <DashboardLayout
      navLinks={navLinks}
      user={user ? { name: user.name, email: user.email } : null}
      onLogout={handleLogout}
      logo={<Text fw={700} size="lg">User Panel</Text>}
    >
      <Outlet />
    </DashboardLayout>
  );
}
