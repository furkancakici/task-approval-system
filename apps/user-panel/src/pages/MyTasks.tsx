import { useEffect, useState } from 'react';
import {
  Title,
  Paper,
  TextInput,
  Select,
  Group,
  Button,
  Box,
  IconSearch,
  IconX,
  useDebouncedValue,
} from '@repo/mantine';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory } from '@repo/types';
import { DataTable, useTaskColumns, TaskDetailModal } from '@repo/ui';

export function MyTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading, meta, lastUpdated } = useAppSelector((state) => state.tasks);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [detailOpened, setDetailOpened] = useState(false);

  const columns = useTaskColumns({
    excludeFields: ['user'],
    onView: (task) => {
      setSelectedTask(task);
      setDetailOpened(true);
    },
  });

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    dispatch(
      fetchMyTasks({
        search: debouncedSearch || undefined,
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined,
        category: category as TaskCategory | undefined,
        page: meta?.page || 1, // Keep current page
        limit: 10,
      })
    );
  }, [dispatch, debouncedSearch, status, priority, category, lastUpdated]);

  const handlePageChange = (page: number) => {
    dispatch(
      fetchMyTasks({
        search: debouncedSearch || undefined,
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined,
        category: category as TaskCategory | undefined,
        page,
        limit: meta?.limit || 10,
      })
    );
  };

  const handleLimitChange = (limit: number) => {
    dispatch(
      fetchMyTasks({
        search: debouncedSearch || undefined,
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined,
        category: category as TaskCategory | undefined,
        page: 1,
        limit,
      })
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatus(null);
    setPriority(null);
    setCategory(null);
  };

  return (
    <>
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">
            {t('common.myTasks')}
          </Title>
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
              data={Object.values(TaskStatus).map((s) => ({
                value: s,
                label: t(`enums.status.${s}`),
              }))}
              value={status}
              onChange={setStatus}
              clearable
            />
            <Select
              label={t('common.priority')}
              placeholder={t('tasks.filterPriority')}
              data={Object.values(TaskPriority).map((p) => ({
                value: p,
                label: t(`enums.priority.${p}`),
              }))}
              value={priority}
              onChange={setPriority}
              clearable
            />
            <Select
              label={t('common.category')}
              placeholder={t('tasks.category')}
              data={Object.values(TaskCategory).map((c) => ({
                value: c,
                label: t(`enums.category.${c}`),
              }))}
              value={category}
              onChange={setCategory}
              clearable
            />
            <Button variant="light" color="gray" onClick={clearFilters} leftSection={<IconX size={16} />}>
              {t('tasks.clearFilters')}
            </Button>
          </Group>
        </Box>

        <DataTable
          columns={columns}
          data={tasks}
          loading={loading}
          emptyMessage={t('tasks.noTasksFound')}
          pagination={
            meta
              ? {
                  total: meta.total,
                  totalPages: meta.totalPages,
                  page: meta.page,
                  onChange: handlePageChange,
                  limit: meta.limit,
                  onLimitChange: handleLimitChange,
                }
              : undefined
          }
        />
      </Paper>
      <TaskDetailModal opened={detailOpened} onClose={() => setDetailOpened(false)} task={selectedTask} />
    </>
  );
}
