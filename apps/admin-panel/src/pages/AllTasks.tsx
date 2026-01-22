import { useEffect, useState } from 'react';
import { Title, Badge, Paper, TextInput, Select, Group, Button, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory, type Task } from '@repo/types';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { TablePagination, DataTable, type Column } from '@repo/ui';

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

  const columns: Column<Task>[] = [
    { key: 'title', header: t('tasks.title') },
    { 
      key: 'status', 
      header: t('common.status'),
      render: (task) => (
        <Badge color={getStatusColor(task.status)} variant="outline">
          {t(`enums.status.${task.status}`)}
        </Badge>
      )
    },
    { 
      key: 'category', 
      header: t('tasks.category'),
      render: (task) => (
        <Badge color={getCategoryColor(task.category as TaskCategory)} variant="dot">
          {t(`enums.category.${task.category}`)}
        </Badge>
      )
    },
    { 
      key: 'priority', 
      header: t('tasks.priority'),
      render: (task) => (
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {t(`enums.priority.${task.priority}`)}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      header: t('tasks.createdAt'),
      render: (task) => new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    },
    { 
      key: 'updatedAt', 
      header: t('tasks.updatedAt'),
      render: (task) => task.status !== TaskStatus.PENDING 
        ? new Date(task.updatedAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
        : '-'
    },
    { 
      key: 'creator', 
      header: t('tasks.creator'),
      render: (task) => (task as any).user?.name || 'Unknown'
    }
  ];

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

        <DataTable
          columns={columns}
          data={tasks}
          loading={loading}
          emptyMessage={t('tasks.noTasksFound')}
          pagination={meta ? {
            total: meta.total,
            totalPages: meta.totalPages,
            page: meta.page,
            onChange: handlePageChange,
            limit: meta.limit,
            onLimitChange: handleLimitChange
          } : undefined}
        />
      </Paper>
  );
}
