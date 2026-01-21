import { useEffect } from 'react';
import { Title, SimpleGrid, Paper, Text, Group, Button, Table, Badge, LoadingOverlay, Box } from '@mantine/core';
import { IconCheck, IconClock, IconX, IconPlus, IconListCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, type Task } from '@repo/types';

export function Dashboard() {
  const { t } = useTranslation();
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
      default: return 'teal';
    }
  };

  const rows = recentTasks.map((task: Task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(task.status)} size="sm" variant="outline">
          {t(`enums.status.${task.status}`)}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>{t('common.dashboard')}</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => navigate('/tasks/create')}>
          {t('common.createTask')}
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" color="dimmed" fw={700} tt="uppercase">
              {t('dashboard.pendingTasks')}
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
              {t('dashboard.completedTasks')} (OK)
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
              {t('common.status')} (X)
            </Text>
            <IconX size={22} color="red" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text fw={700} size="xl">{stats.rejected}</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group justify="space-between">
            <Text fw={600} size="lg">{t('dashboard.recentActivity')}</Text>
            <Button variant="subtle" size="xs" rightSection={<IconListCheck size={14} />} onClick={() => navigate('/tasks')}>
              {t('common.tasks')}
            </Button>
          </Group>
        </Box>
        
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tasks.title')}</Table.Th>
                <Table.Th>{t('common.status')}</Table.Th>
                <Table.Th>{t('common.createdAt')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
               {rows.length > 0 ? rows : (
                   <Table.Tr>
                       <Table.Td colSpan={3} style={{ textAlign: 'center', color: 'gray', padding: 20 }}>
                          {loading ? t('common.loading') : t('tasks.noTasksFound')}
                       </Table.Td>
                   </Table.Tr>
               )}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>
    </>
  );
}
