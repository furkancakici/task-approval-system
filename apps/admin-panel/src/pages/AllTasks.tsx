import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, TextInput, Select, Group, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory, type Task } from '@repo/types';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

export function AllTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  
  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    dispatch(fetchTasks({
      search: debouncedSearch || undefined,
      status: status as TaskStatus | undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
    }));
  }, [dispatch, debouncedSearch, status, priority, category]);

  const clearFilters = () => {
    setSearch('');
    setStatus(null);
    setPriority(null);
    setCategory(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatus.APPROVED: return 'green';
      case TaskStatus.REJECTED: return 'red';
      case TaskStatus.PENDING: return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'red';
      case TaskPriority.HIGH: return 'orange';
      case TaskPriority.NORMAL: return 'blue';
      case TaskPriority.LOW: return 'gray';
      default: return 'gray';
    }
  };

  const rows = tasks.map((task: Task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(task.status)} variant="dot">
            {t(`tasks.status_${task.status.toLowerCase()}`)}
        </Badge>
      </Table.Td>
      <Table.Td>{task.category}</Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {task.priority}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleDateString('tr-TR')}</Table.Td>
      <Table.Td>{(task as any).user?.name || 'Unknown'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title order={2} mb="md">{t('tasks.allTasks')}</Title>

      <Paper p="md" mb="xl" withBorder radius="md">
        <Group align="end">
            <TextInput
            label={t('common.actions')} // Or just 'Search' if I added it
            placeholder={t('tasks.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
            />
            <Select
            label={t('common.status')}
            placeholder={t('tasks.filterStatus')}
            data={Object.values(TaskStatus).map(s => ({ value: s, label: t(`tasks.status_${s.toLowerCase()}`) }))}
            value={status}
            onChange={setStatus}
            clearable
            />
            <Select
            label={t('common.priority')}
            placeholder={t('tasks.filterPriority')}
            data={Object.values(TaskPriority)}
            value={priority}
            onChange={setPriority}
            clearable
            />
            <Button variant="light" color="gray" onClick={clearFilters} leftSection={<IconX size={16}/>}>
                {t('tasks.clearFilters')}
            </Button>
        </Group>
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('tasks.title')}</Table.Th>
              <Table.Th>{t('common.status')}</Table.Th>
              <Table.Th>{t('tasks.category')}</Table.Th>
              <Table.Th>{t('tasks.priority')}</Table.Th>
              <Table.Th>{t('tasks.createdAt')}</Table.Th>
              <Table.Th>{t('tasks.creator')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: 'center', color: 'gray', padding: 20 }}>
                  {loading ? t('common.loading') : t('tasks.noTasksFound')}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}
