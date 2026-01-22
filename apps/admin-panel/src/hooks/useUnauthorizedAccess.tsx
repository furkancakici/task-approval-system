import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { UserRole } from '@repo/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { UnauthorizedModal } from '@/components/Auth/UnauthorizedModal';

export function useUnauthorizedAccess() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    modals.closeAll();
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user && user.role === UserRole.USER) {
      modals.open({
        id: 'unauthorized-admin-access',
        centered: true,
        withCloseButton: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
        children: <UnauthorizedModal onTimeout={handleLogout} />,
      });
    }
  }, [user, handleLogout]);

  return { handleLogout };
}
