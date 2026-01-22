import { Badge, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { UserRole, type User } from '@repo/types';
import type { Column } from '../components/DataTable';

export function useUserColumns() {
  const { t } = useTranslation();

  const columns: Column<User>[] = [
    { key: 'name', header: t('auth.name') },
    { key: 'email', header: t('auth.email') },
    { 
      key: 'role', 
      header: t('auth.role'),
      render: (user) => (
        <Badge color={user.role === UserRole.ADMIN ? 'indigo' : user.role === UserRole.MODERATOR ? 'lime' : 'teal'}>
          {t(`enums.role.${user.role}`)}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      header: t('common.createdAt'),
      render: (user) => new Date(user.createdAt).toLocaleDateString('tr-TR')
    },
  ];

  return columns;
}
