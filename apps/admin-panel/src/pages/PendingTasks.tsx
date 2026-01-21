import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, Button, Group, ActionIcon, Tooltip, Text, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTaskStatus } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, UserRole } from '@repo/types';
import { RejectTaskModal } from '@/components/Tasks/RejectTaskModal';
import { notifications } from '@mantine/notifications';
import { TablePagination } from '@repo/ui';

export function PendingTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading, meta } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ status: TaskStatus.PENDING, page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchTasks({ status: TaskStatus.PENDING, page, limit: meta?.limit || 10 }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(fetchTasks({ status: TaskStatus.PENDING, page: 1, limit }));
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
            dispatch(fetchTasks({ status: TaskStatus.PENDING, page: meta?.page || 1, limit: meta?.limit || 10 }));
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'red';
      case TaskPriority.HIGH: return 'orange';
      case TaskPriority.NORMAL: return 'blue';
      case TaskPriority.LOW: return 'gray';
      default: return 'gray';
    }
  };

  // tasks are already filtered by backend query, but double check creates no harm or just map directly
  // Backend returns filtered list based on query param status=PENDING
  const rows = tasks.map((task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>{task.category}</Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {task.priority}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</Table.Td>
      <Table.Td>
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
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('tasks.pendingApprovals')}</Title>
        </Box>
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tasks.title')}</Table.Th>
                <Table.Th>{t('tasks.category')}</Table.Th>
                <Table.Th>{t('tasks.priority')}</Table.Th>
                <Table.Th>{t('tasks.createdAt')}</Table.Th>
                <Table.Th>{t('tasks.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
        {tasks.length === 0 && !loading && (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed" size="sm">
              {t('tasks.noPendingTasks')}
            </Text>
          </Box>
        )}
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

      <RejectTaskModal 
        opened={rejectModalOpen} 
        onClose={() => { 
            setRejectModalOpen(false); 
            setSelectedTaskId(null); 
            // Refresh list on close if rejected (modal handles logic but we might want to refresh)
            dispatch(fetchTasks({ status: TaskStatus.PENDING, page: meta?.page || 1, limit: meta?.limit || 10 }));
        }}
        taskId={selectedTaskId}
      />
    </>
  );
}
