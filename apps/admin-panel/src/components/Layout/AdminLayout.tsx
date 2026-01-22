import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@repo/ui';
import { useAppSelector } from '@/store/hooks';
import { IconDashboard, IconUsers, IconListCheck, Text, Group, IconShieldLock } from '@repo/mantine';
import { useUnauthorizedAccess } from '@/hooks/useUnauthorizedAccess';

export function AdminLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Custom hook to handle unauthorized 'User' access
  const { handleLogout } = useUnauthorizedAccess();

  const navLinks = [
    {
      label: t('common.dashboard'),
      icon: IconDashboard,
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      label: t('common.users'),
      icon: IconUsers,
      active: location.pathname === '/users',
      onClick: () => navigate('/users'),
      roles: ['Admin'], // Only visible to Admins
    },
    {
      label: t('dashboard.pendingTasks'),
      icon: IconListCheck,
      active: location.pathname === '/tasks/pending',
      onClick: () => navigate('/tasks/pending'),
    },
    {
      label: t('common.tasks'),
      icon: IconListCheck,
      active: location.pathname === '/tasks/all',
      onClick: () => navigate('/tasks/all'),
      roles: ['Admin', 'Moderator'],
    },
  ].filter((link) => !link.roles || (user && link.roles.includes(user.role)));

  return (
    <DashboardLayout
      navLinks={navLinks}
      user={user ? { name: user.name, email: user.email } : null}
      onLogout={handleLogout}
      logo={
        <Group gap="xs">
          <IconShieldLock size={28} color="var(--mantine-primary-color-filled)" />
          <Text fw={900} size="xl">
            Admin Panel
          </Text>
        </Group>
      }
      currentLanguage={i18n.language}
      onLanguageChange={(lang) => i18n.changeLanguage(lang)}
    >
      <Outlet />
    </DashboardLayout>
  );
}
