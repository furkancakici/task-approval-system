import { useEffect } from 'react';
import { Title, Group, Button, Table, ActionIcon, Badge, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, deleteUser } from '@/store/slices/usersSlice';
import { CreateUserModal } from '@/components/Users/CreateUserModal';
import { UserRole } from '@repo/types';

export function Users() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(id));
    }
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.id}</Table.Td>
      <Table.Td>{user.name}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>
        <Badge color={user.role === UserRole.ADMIN ? 'blue' : 'gray'}>
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(user.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(user.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>User Management</Title>
        <Button leftSection={<IconPlus size={14} />} onClick={open}>
          Create User
        </Button>
      </Group>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {users.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
            No users found.
          </div>
        )}
      </Paper>

      <CreateUserModal opened={opened} onClose={close} />
    </>
  );
}
