import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Group, Button, ActionIcon, Paper, Text, Box, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash, IconSearch, IconX, IconEdit } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, deleteUser } from '@/store/slices/usersSlice';
import { CreateUserModal } from '@/components/Users/CreateUserModal';
import { EditUserModal } from '@/components/Users/EditUserModal';
import { UserRole, type User } from '@repo/types';
import { DataTable, useUserColumns, type Column } from '@repo/ui';

export function Users() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { users, loading, meta } = useAppSelector((state) => state.users);
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const userColumns = useUserColumns();

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
      return;
    }
    dispatch(fetchUsers({ 
      email: debouncedSearch || undefined,
      page: 1, 
      limit: 10 
    }));
  }, [dispatch, user, navigate, debouncedSearch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ 
      email: debouncedSearch || undefined,
      page, 
      limit: meta?.limit || 10 
    }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(fetchUsers({ 
      email: debouncedSearch || undefined,
      page: 1, 
      limit 
    }));
  };

  const clearFilters = () => {
    setSearch('');
  };

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    openEdit();
  };

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: 'Delete User',
      children: (
        <Text size="sm">
          Are you sure you want to delete this user? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      centered: true,
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
          await dispatch(deleteUser(id)).unwrap();
          notifications.show({
            title: 'Success',
            message: 'User deleted successfully',
            color: 'green'
          });
          
          if (users.length === 1 && meta && meta.page > 1) {
              dispatch(fetchUsers({ 
                email: debouncedSearch || undefined,
                page: meta.page - 1, 
                limit: meta.limit 
              }));
          } else {
              dispatch(fetchUsers({ 
                email: debouncedSearch || undefined,
                page: meta?.page || 1, 
                limit: meta?.limit || 10 
              }));
          }
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete user',
            color: 'red'
          });
        }
      },
    });
  };

  const columns: Column<User>[] = [
    ...userColumns,
    { 
      key: 'actions', 
      header: t('common.actions'),
      render: (u) => (
        <Group gap="xs">
          <ActionIcon color="blue" variant="subtle" onClick={() => handleEdit(u)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(u.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      )
    }
  ];

  return (
    <>
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group justify="space-between">
            <Title order={3} size="h4">{t('common.users')}</Title>
            <Button leftSection={<IconPlus size={14} />} onClick={open}>
              {t('common.create')}
            </Button>
          </Group>
        </Box>

        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group align="end">
              <TextInput
              label={t('common.actions')}
              placeholder={t('auth.email')}
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
              />
              <Button variant="light" color="gray" onClick={clearFilters} leftSection={<IconX size={16}/>}>
                  {t('tasks.clearFilters')}
              </Button>
          </Group>
        </Box>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage={t('tasks.noTasksFound')}
          pagination={meta ? {
            total: meta.total,
            totalPages: meta.totalPages,
            page: meta.page,
            onChange: handlePageChange,
            limit: meta.limit,
            onLimitChange: handleLimitChange
          } : undefined}
        />
      </Paper>

      <CreateUserModal opened={opened} onClose={() => {
        close();
        dispatch(fetchUsers({ 
            email: debouncedSearch || undefined,
            page: 1, 
            limit: meta?.limit || 10 
        }));
      }} />
      <EditUserModal opened={editOpened} onClose={() => {
        closeEdit();
        dispatch(fetchUsers({ 
            email: debouncedSearch || undefined,
            page: meta?.page || 1, 
            limit: meta?.limit || 10 
        }));
      }} user={selectedUser} />
    </>
  );
}
