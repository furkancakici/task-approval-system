import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { IconDashboard, IconUsers, IconListCheck } from '@tabler/icons-react';
import { Text } from '@mantine/core';

export function AdminLayout() {
  const { t, i18n } = useTranslation();
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
      label: t('common.dashboard'), 
      icon: IconDashboard, 
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard') 
    },
    { 
      label: t('common.users'), 
      icon: IconUsers, 
      active: location.pathname === '/users',
      onClick: () => navigate('/users'),
      roles: ['Admin'] // Only visible to Admins
    },
    { 
      label: t('dashboard.pendingTasks'), 
      icon: IconListCheck, 
      active: location.pathname === '/tasks/pending',
      onClick: () => navigate('/tasks/pending') 
    },
    { 
      label: t('common.tasks'), 
      icon: IconListCheck, 
      active: location.pathname === '/tasks/all',
      onClick: () => navigate('/tasks/all'),
      roles: ['Admin', 'Moderator']
    },
  ].filter(link => !link.roles || (user && link.roles.includes(user.role)));

  return (
    <DashboardLayout
      navLinks={navLinks}
      user={user ? { name: user.name, email: user.email } : null}
      onLogout={handleLogout}
      logo={<Text fw={700} size="lg">{t('common.dashboard')}</Text>}
      currentLanguage={i18n.language}
      onLanguageChange={(lang) => i18n.changeLanguage(lang)}
    >
      <Outlet />
    </DashboardLayout>
  );
}
