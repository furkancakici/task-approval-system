import { useEffect, useState } from 'react';
import { SimpleGrid, Paper, Text, Group, Box, Title, ThemeIcon, Badge, LoadingOverlay } from '@mantine/core';
import { IconUser, IconListCheck, IconChecks, IconX } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchAdminStats } from '@/store/slices/statsSlice';
import { useTranslation } from 'react-i18next';
import { DataTable, useTaskColumns, TaskDetailModal, StatCard } from '@repo/ui';


export function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.stats);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [detailOpened, setDetailOpened] = useState(false);

  const columns = useTaskColumns({ 
    excludeFields: ['category', 'priority', 'updatedAt'],
    onView: (task) => {
      setSelectedTask(task);
      setDetailOpened(true);
    }
  });

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statsData = stats ? [
    { label: t('dashboard.pendingTasks'), value: stats.pendingTasks.toString(), icon: IconListCheck, color: 'yellow' },
    { label: t('dashboard.todayApproved'), value: stats.todayApproved.toString(), icon: IconChecks, color: 'green' },
    { label: t('dashboard.todayRejected'), value: stats.todayRejected.toString(), icon: IconX, color: 'red' },
  ] : [];

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      <Title order={2} mb="xl">{t('dashboard.welcome', { name: user?.name || 'Admin' })}</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 4 }} mb="lg" style={{ alignItems: 'stretch' }}>
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
        {stats?.priorityStats && (
          <Paper withBorder p="md" radius="md">
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" mb="xs">
              {t('dashboard.priorityDistribution')}
            </Text>
            <Group gap="xs">
              {Object.entries(stats.priorityStats).map(([priority, count]) => (
                <Box key={priority} style={{ textAlign: 'center' }}>
                  <Text size="10px" c="dimmed" tt="uppercase" fw={700} mb={2}>
                    {t(`enums.priority.${priority}`)}
                  </Text>
                  <Badge 
                    size="sm" 
                    variant="filled" 
                    radius="xl"
                    color={
                      priority === 'urgent' ? 'red' : 
                      priority === 'high' ? 'orange' : 
                      priority === 'normal' ? 'blue' : 'teal'
                    }
                  >
                    {count}
                  </Badge>
                </Box>
              ))}
            </Group>
          </Paper>
        )}
      </SimpleGrid>

      <Paper withBorder radius="md" mt="xl">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('dashboard.recentActivity')}</Title>
        </Box>
        <DataTable
          columns={columns}
          data={(stats?.recentActivity as any) || []}
          loading={loading}
          emptyMessage={t('tasks.noPendingTasks')}
          minHeight={150}
        />
      </Paper>

      <TaskDetailModal 
        opened={detailOpened} 
        onClose={() => setDetailOpened(false)} 
        task={selectedTask} 
      />
    </Box>
  );
}
