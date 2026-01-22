import { useEffect, useState } from 'react';
import { Title, Badge, Paper, Button, Group, ActionIcon, Tooltip, Text, Box, TextInput, Select } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTaskStatus } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory, UserRole, type Task } from '@repo/types';
import { RejectTaskModal } from '@/components/Tasks/RejectTaskModal';
import { notifications } from '@mantine/notifications';
import { TablePagination, DataTable, type Column } from '@repo/ui';
import { useDebouncedValue } from '@mantine/hooks';

export function PendingTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading, meta } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  
  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    dispatch(fetchTasks({ 
      status: TaskStatus.PENDING, 
      search: debouncedSearch || undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
      page: 1, 
      limit: 10 
    }));
  }, [dispatch, debouncedSearch, priority, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchTasks({ 
      status: TaskStatus.PENDING, 
      search: debouncedSearch || undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
      page, 
      limit: meta?.limit || 10 
    }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(fetchTasks({ 
      status: TaskStatus.PENDING, 
      search: debouncedSearch || undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
      page: 1, 
      limit 
    }));
  };

  const clearFilters = () => {
    setSearch('');
    setPriority(null);
    setCategory(null);
  };

  const handleApprove = (id: string) => {
    modals.openConfirmModal({
      title: t('tasks.approveConfirmTitle'),
      children: (
        <Text size="sm">
          {t('tasks.approveConfirmMessage')}
        </Text>
      ),
      labels: { confirm: t('common.save'), cancel: t('common.cancel') },
      confirmProps: { color: 'green' },
      centered: true,
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
            await dispatch(updateTaskStatus({
                id,
                data: { status: TaskStatus.APPROVED }
            })).unwrap();
            notifications.show({
                title: t('common.success'),
                message: t('tasks.approveSuccess'),
                color: 'green'
            });
            // Refresh list
            dispatch(fetchTasks({ 
                status: TaskStatus.PENDING, 
                search: debouncedSearch || undefined,
                priority: priority as TaskPriority | undefined,
                category: category as TaskCategory | undefined,
                page: meta?.page || 1, 
                limit: meta?.limit || 10 
            }));
        } catch (error) {
            notifications.show({
                title: t('common.error'),
                message: t('tasks.approveError'),
                color: 'red'
            });
        }
      },
    });
  };

  const openRejectModal = (id: string) => {
    setSelectedTaskId(id);
    setRejectModalOpen(true);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'red';
      case TaskPriority.HIGH: return 'orange';
      case TaskPriority.NORMAL: return 'blue';
      case TaskPriority.LOW: return 'teal';
      default: return 'teal';
    }
  };

  const columns: Column<Task>[] = [
    { key: 'title', header: t('tasks.title') },
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
      key: 'actions', 
      header: t('tasks.actions'),
      render: (task) => (
        <Group gap="xs">
          <Tooltip label={user?.role === UserRole.VIEWER ? t('tasks.viewersCannotApprove') : t('tasks.approve')}>
            <ActionIcon 
                color="green" 
                variant="light" 
                onClick={() => handleApprove(task.id)}
                disabled={user?.role === UserRole.VIEWER}
            >
              <IconCheck size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={user?.role === UserRole.VIEWER ? t('tasks.viewersCannotReject') : t('tasks.reject')}>
            <ActionIcon 
                color="red" 
                variant="light" 
                onClick={() => openRejectModal(task.id)}
                disabled={user?.role === UserRole.VIEWER}
            >
              <IconX size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )
    }
  ];

  return (
    <>
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('tasks.pendingApprovals')}</Title>
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
          emptyMessage={t('tasks.noPendingTasks')}
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

      <RejectTaskModal 
        opened={rejectModalOpen} 
        onClose={() => { 
            setRejectModalOpen(false); 
            setSelectedTaskId(null); 
            // Refresh list on close
            dispatch(fetchTasks({ 
                status: TaskStatus.PENDING, 
                search: debouncedSearch || undefined,
                priority: priority as TaskPriority | undefined,
                category: category as TaskCategory | undefined,
                page: meta?.page || 1, 
                limit: meta?.limit || 10 
            }));
        }}
        taskId={selectedTaskId}
      />
    </>
  );
}
