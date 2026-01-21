import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, Button, Group, ActionIcon, Tooltip, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTaskStatus } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, UserRole } from '@repo/types';
import { RejectTaskModal } from '@/components/Tasks/RejectTaskModal';
import { notifications } from '@mantine/notifications';

export function PendingTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ status: TaskStatus.PENDING }));
  }, [dispatch]);

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

  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);

  const rows = pendingTasks.map((task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>{task.category}</Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {task.priority}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleDateString('tr-TR')}</Table.Td>
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
      <Title order={2} mb="xl">{t('tasks.pendingApprovals')}</Title>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
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
        {pendingTasks.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
            {t('tasks.noPendingTasks')}
          </div>
        )}
      </Paper>

      <RejectTaskModal 
        opened={rejectModalOpen} 
        onClose={() => { setRejectModalOpen(false); setSelectedTaskId(null); }}
        taskId={selectedTaskId}
      />
    </>
  );
}
