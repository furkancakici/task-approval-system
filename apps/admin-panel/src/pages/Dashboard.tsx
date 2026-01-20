import { useEffect } from 'react';
import { SimpleGrid, Paper, Text, Group, Box, Title, ThemeIcon, Loader, Center } from '@mantine/core';
import { IconUser, IconListCheck, IconChecks } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchAdminStats } from '@/store/slices/statsSlice';

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statsData = stats ? [
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: IconUser, color: 'blue' },
    { label: 'Pending Tasks', value: stats.pendingTasks.toString(), icon: IconListCheck, color: 'yellow' },
    { label: 'Completed Tasks', value: stats.completedTasks.toString(), icon: IconChecks, color: 'teal' },
  ] : [];

  return (
    <Box>
      <Title order={2} mb="xl">Welcome back, {user?.name || 'Admin'}!</Title>
      
      {loading ? (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          {statsData.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </SimpleGrid>
      )}

      <Paper withBorder p="md" radius="md" mt="xl">
        <Title order={3} mb="md" size="h4">Recent Activity</Title>
        <Text c="dimmed" size="sm">
          No recent activity to show.
        </Text>
      </Paper>
    </Box>
  );
}
