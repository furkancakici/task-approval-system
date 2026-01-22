import { useEffect, useState } from 'react';
import {
  Title,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Button,
  LoadingOverlay,
  Box,
  IconCheck,
  IconClock,
  IconX,
  IconPlus,
  IconListCheck,
} from '@repo/mantine';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, type Task } from '@repo/types';
import { DataTable, useTaskColumns, TaskDetailModal, StatCard } from '@repo/ui';
import { fetchStats } from '@/store/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tasks, loading, lastUpdated } = useAppSelector((state) => state.tasks);
  const { total, pending, approved, rejected } = useAppSelector((state) => state.stats);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [detailOpened, setDetailOpened] = useState(false);

  const columns = useTaskColumns({
    excludeFields: ['user', 'category', 'priority', 'updatedAt'],
    onView: (task) => {
      setSelectedTask(task);
      setDetailOpened(true);
    },
  });

  useEffect(() => {
    dispatch(fetchMyTasks());
    dispatch(fetchStats());
  }, [dispatch, lastUpdated]);

  const statsData = [
    { label: t('common.total'), value: total, icon: IconListCheck, color: 'blue' },
    { label: t('enums.status.pending'), value: pending, icon: IconClock, color: 'orange' },
    { label: t('enums.status.approved'), value: approved, icon: IconCheck, color: 'green' },
    { label: t('enums.status.rejected'), value: rejected, icon: IconX, color: 'red' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>{t('common.dashboard')}</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => navigate('/tasks/create')}>
          {t('common.createTask')}
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md" mb="lg">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      <Paper withBorder radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group justify="space-between">
            <Text fw={600} size="lg">
              {t('dashboard.recentActivity')}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              rightSection={<IconListCheck size={14} />}
              onClick={() => navigate('/tasks')}
            >
              {t('common.tasks')}
            </Button>
          </Group>
        </Box>

        <DataTable
          columns={columns}
          data={recentTasks}
          loading={loading}
          emptyMessage={t('tasks.noTasksFound')}
          minHeight={150}
        />
      </Paper>
      <TaskDetailModal opened={detailOpened} onClose={() => setDetailOpened(false)} task={selectedTask} />
    </>
  );
}
