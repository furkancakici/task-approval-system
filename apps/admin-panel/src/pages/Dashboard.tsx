import { useEffect } from 'react';
import { SimpleGrid, Paper, Text, Group, Box, Title, ThemeIcon, Badge, LoadingOverlay } from '@mantine/core';
import { IconUser, IconListCheck, IconChecks } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchAdminStats } from '@/store/slices/statsSlice';
import { useTranslation } from 'react-i18next';
import { DataTable, type Column } from '@repo/ui';

interface StatProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {label}
          </Text>
          <Text fw={700} fz="xl">
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={38} radius="md">
          <Icon style={{ width: '1.5rem', height: '1.5rem' }} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statsData = stats ? [
    { label: t('dashboard.totalUsers'), value: stats.totalUsers.toString(), icon: IconUser, color: 'blue' },
    { label: t('dashboard.pendingTasks'), value: stats.pendingTasks.toString(), icon: IconListCheck, color: 'yellow' },
    { label: t('dashboard.completedTasks'), value: stats.completedTasks.toString(), icon: IconChecks, color: 'teal' },
  ] : [];

  const columns: Column<any>[] = [
    { 
      key: 'title', 
      header: t('tasks.title'),
      render: (activity) => <Text size="sm" fw={500}>{activity.title}</Text>
    },
    { 
      key: 'user', 
      header: t('common.users'),
      render: (activity) => <Text size="sm">{activity.user.name}</Text>
    },
    { 
      key: 'status', 
      header: t('common.status'),
      render: (activity) => (
        <Badge 
          variant="outline" 
          color={
            activity.status === 'pending' ? 'yellow' : 
            activity.status === 'approved' ? 'green' : 'red'
          }
        >
          {t(`enums.status.${activity.status}`)}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      header: t('common.createdAt'),
      render: (activity) => (
        <Text size="sm" c="dimmed">
          {new Date(activity.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
        </Text>
      )
    }
  ];

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      <Title order={2} mb="xl">{t('dashboard.welcome', { name: user?.name || 'Admin' })}</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </SimpleGrid>

      <Paper withBorder radius="md" mt="xl">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('dashboard.recentActivity')}</Title>
        </Box>
        <DataTable
          columns={columns}
          data={stats?.recentActivity || []}
          loading={loading}
          emptyMessage={t('tasks.noPendingTasks')}
          minHeight={150}
        />
      </Paper>
    </Box>
  );
}
