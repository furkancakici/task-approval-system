import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { IconDashboard, IconUsers, IconListCheck } from '@tabler/icons-react';
import { Text } from '@mantine/core';

export function AdminLayout() {
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
      icon: IconDashboard, 
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard') 
    },
    { 
      label: 'Users', 
      icon: IconUsers, 
      active: location.pathname === '/users',
      onClick: () => navigate('/users') 
    },
    { 
      label: 'Tasks', 
      icon: IconListCheck, 
      active: location.pathname === '/tasks',
      onClick: () => navigate('/tasks') 
    },
  ];

  return (
    <DashboardLayout
      navLinks={navLinks}
      user={user ? { name: user.name, email: user.email } : null}
      onLogout={handleLogout}
      logo={<Text fw={700} size="lg">Admin Panel</Text>}
    >
      <Outlet />
    </DashboardLayout>
  );
}
