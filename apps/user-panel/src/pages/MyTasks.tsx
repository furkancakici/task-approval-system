import { useEffect } from 'react';
import { Title, Table, Badge, Paper, Tooltip, ActionIcon, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority } from '@repo/types';
import { TablePagination } from '@repo/ui';

export function MyTasks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tasks, loading, meta } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasks({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchMyTasks({ page, limit: meta?.limit || 10 }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(fetchMyTasks({ page: 1, limit }));
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

  const rows = tasks.map((task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>{task.category}</Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {task.priority}
        </Badge>
      </Table.Td>
      <Table.Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge color={getStatusColor(task.status)} variant="outline">
            {task.status}
          </Badge>
          {task.status === TaskStatus.REJECTED && task.rejectionReason && (
            <Tooltip label={`Rejection Reason: ${task.rejectionReason}`} multiline w={220}>
              <ActionIcon variant="subtle" color="red" size="sm">
                <IconInfoCircle size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</Table.Td>
      <Table.Td>
        {task.status !== TaskStatus.PENDING 
          ? new Date(task.updatedAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
          : '-'}
      </Table.Td>
    </Table.Tr>
  ));

  return (
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Title order={3} size="h4">{t('common.myTasks')}</Title>
        </Box>

        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('tasks.title')}</Table.Th>
                <Table.Th>{t('tasks.category')}</Table.Th>
                <Table.Th>{t('tasks.priority')}</Table.Th>
                <Table.Th>{t('common.status')}</Table.Th>
                <Table.Th>{t('tasks.createdAt')}</Table.Th>
                <Table.Th>{t('tasks.updatedAt')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
        {tasks.length === 0 && !loading && (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed" size="sm">
              {t('tasks.noTasksFound')}
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
  );
}
