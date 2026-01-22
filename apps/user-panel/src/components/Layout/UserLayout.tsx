import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@repo/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Text, IconListCheck, IconPlus, IconLayoutDashboard } from '@repo/mantine';

export function UserLayout() {
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
      icon: IconLayoutDashboard,
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      label: t('common.myTasks'),
      icon: IconListCheck,
      active: location.pathname === '/tasks',
      onClick: () => navigate('/tasks'),
    },
    {
      label: t('common.createTask'),
      icon: IconPlus,
      active: location.pathname === '/tasks/create',
      onClick: () => navigate('/tasks/create'),
    },
  ];

  return (
    <DashboardLayout
      navLinks={navLinks}
      user={user ? { name: user.name, email: user.email } : null}
      onLogout={handleLogout}
      logo={
        <Text fw={700} size="lg">
          {t('common.dashboard')}
        </Text>
      }
      currentLanguage={i18n.language}
      onLanguageChange={(lang) => i18n.changeLanguage(lang)}
    >
      <Outlet />
    </DashboardLayout>
  );
}
