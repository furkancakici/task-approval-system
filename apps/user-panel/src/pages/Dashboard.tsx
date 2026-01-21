import { useEffect } from 'react';
import { Title, SimpleGrid, Paper, Text, Group, Button, Table, Badge, LoadingOverlay } from '@mantine/core';
import { IconCheck, IconClock, IconX, IconPlus, IconListCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, type Task } from '@repo/types';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tasks, loading } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    approved: tasks.filter(t => t.status === TaskStatus.APPROVED).length,
    rejected: tasks.filter(t => t.status === TaskStatus.REJECTED).length,
  };

  const recentTasks = tasks.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatus.APPROVED: return 'green';
      case TaskStatus.REJECTED: return 'red';
      case TaskStatus.PENDING: return 'yellow';
      default: return 'gray';
    }
  };

  const rows = recentTasks.map((task: Task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(task.status)} size="sm" variant="filled">
          {task.status}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleDateString('tr-TR')}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>Dashboard</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => navigate('/tasks/create')}>
          Create Task
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Pending Tasks
            </Text>
            <IconClock size={22} color="orange" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text fw={700} size="xl">{stats.pending}</Text>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Approved
            </Text>
            <IconCheck size={22} color="green" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text fw={700} size="xl">{stats.approved}</Text>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              Rejected
            </Text>
            <IconX size={22} color="red" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text fw={700} size="xl">{stats.rejected}</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">Recent Activity</Text>
            <Button variant="subtle" size="xs" rightSection={<IconListCheck size={14} />} onClick={() => navigate('/tasks')}>
                View All
            </Button>
        </Group>
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
             {rows.length > 0 ? rows : (
                 <Table.Tr>
                     <Table.Td colSpan={3} align="center" c="dimmed">No recent tasks</Table.Td>
                 </Table.Tr>
             )}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}
