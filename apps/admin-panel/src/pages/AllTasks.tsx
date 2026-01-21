import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, TextInput, Select, Group, Button, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory, type Task } from '@repo/types';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { TablePagination } from '@repo/ui';

export function AllTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading, meta } = useAppSelector((state) => state.tasks);
  
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
      page: 1,
      limit: 10
    }));
  }, [dispatch, debouncedSearch, status, priority, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchTasks({
      search: debouncedSearch || undefined,
      status: status as TaskStatus | undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
      page,
      limit: meta?.limit || 10
    }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(fetchTasks({
      search: debouncedSearch || undefined,
      status: status as TaskStatus | undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
      page: 1,
      limit
    }));
  };

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
      default: return 'teal';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'red';
      case TaskPriority.HIGH: return 'orange';
      case TaskPriority.NORMAL: return 'blue';
      case TaskPriority.LOW: return 'teal';
      default: return 'teal';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case TaskCategory.TECHNICAL_SUPPORT: return 'blue';
      case TaskCategory.LEAVE_REQUEST: return 'orange';
      case TaskCategory.PURCHASE: return 'grape';
      case TaskCategory.OTHER: return 'teal';
      default: return 'teal';
    }
  };

  const rows = tasks.map((task: Task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(task.status)} variant="outline">
            {t(`enums.status.${task.status}`)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getCategoryColor(task.category as TaskCategory)} variant="dot">
          {t(`enums.category.${task.category}`)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {t(`enums.priority.${task.priority}`)}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</Table.Td>
      <Table.Td>
        {task.status !== TaskStatus.PENDING 
          ? new Date(task.updatedAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
          : '-'}
      </Table.Td>
      <Table.Td>{(task as any).user?.name || 'Unknown'}</Table.Td>
    </Table.Tr>
  ));

  return (
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('tasks.allTasks')}</Title>
        </Box>
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group align="end">
              <TextInput
              label={t('common.actions')}
              placeholder={t('tasks.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
              />
              <Select
              label={t('common.status')}
              placeholder={t('tasks.filterStatus')}
              data={Object.values(TaskStatus).map(s => ({ value: s, label: t(`enums.status.${s}`) }))}
              value={status}
              onChange={setStatus}
              clearable
              />
              <Select
              label={t('common.priority')}
              placeholder={t('tasks.filterPriority')}
              data={Object.values(TaskPriority).map(p => ({ value: p, label: t(`enums.priority.${p}`) }))}
              value={priority}
              onChange={setPriority}
              clearable
              />
              <Select
              label={t('common.category')}
              placeholder={t('tasks.category')}
              data={Object.values(TaskCategory).map(c => ({ value: c, label: t(`enums.category.${c}`) }))}
              value={category}
              onChange={setCategory}
              clearable
              />
              <Button variant="light" color="gray" onClick={clearFilters} leftSection={<IconX size={16}/>}>
                  {t('tasks.clearFilters')}
              </Button>
          </Group>
        </Box>

        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tasks.title')}</Table.Th>
                <Table.Th>{t('common.status')}</Table.Th>
                <Table.Th>{t('tasks.category')}</Table.Th>
                <Table.Th>{t('tasks.priority')}</Table.Th>
                <Table.Th>{t('tasks.createdAt')}</Table.Th>
                <Table.Th>{t('tasks.updatedAt')}</Table.Th>
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
        </Box>
        {meta && (
            <Box px="md" pb="md">
                <TablePagination 
                    total={meta.total} 
                    totalPages={meta.totalPages} 
                    page={meta.page} 
                    onChange={handlePageChange}
                    limit={meta.limit}
                    onLimitChange={handleLimitChange}
                />
            </Box>
        )}
      </Paper>
  );
}
