import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Group, Button, Table, ActionIcon, Badge, Paper, Text, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, deleteUser } from '@/store/slices/usersSlice';
import { CreateUserModal } from '@/components/Users/CreateUserModal';
import { UserRole } from '@repo/types';

export function Users() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [opened, { open, close }] = useDisclosure(false);

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
      return;
    }
    dispatch(fetchUsers());
  }, [dispatch, user, navigate]);

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

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.name}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>
        <Badge color={user.role === UserRole.ADMIN ? 'blue' : 'gray'}>
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(user.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</Table.Td>
      <Table.Td>
        <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(user.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

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

        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tasks.creator')} (Name)</Table.Th>
                <Table.Th>{t('auth.email')}</Table.Th>
                <Table.Th>{t('common.status')} (Role)</Table.Th>
                <Table.Th>{t('tasks.createdAt')}</Table.Th>
                <Table.Th>{t('common.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
        {users.length === 0 && !loading && (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed" size="sm">
              {t('tasks.noTasksFound')}
            </Text>
          </Box>
        )}
      </Paper>

      <CreateUserModal opened={opened} onClose={close} />
    </>
  );
}
