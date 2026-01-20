import { useEffect } from 'react';
import { Title, Table, Badge, Paper, Tooltip, ActionIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority } from '@repo/types';

export function MyTasks() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

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
          <Badge color={getStatusColor(task.status)} variant="filled">
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
      <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title order={2} mb="xl">My Tasks</Title>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {tasks.length === 0 && !loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
                No tasks found. Create one to get started!
            </div>
        )}
      </Paper>
    </>
  );
}
