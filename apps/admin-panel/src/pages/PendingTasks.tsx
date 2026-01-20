import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, updateTaskStatus } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority } from '@repo/types';
import { RejectTaskModal } from '@/components/Tasks/RejectTaskModal';
import { notifications } from '@mantine/notifications';

export function PendingTasks() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ status: TaskStatus.PENDING }));
  }, [dispatch]);

  const handleApprove = async (id: string) => {
    if (confirm('Are you sure you want to approve this task?')) {
        try {
            await dispatch(updateTaskStatus({
                id,
                data: { status: TaskStatus.APPROVED }
            })).unwrap();
            notifications.show({
                title: 'Success',
                message: 'Task approved successfully',
                color: 'green'
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to approve task',
                color: 'red'
            });
        }
    }
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

  // Filter only pending tasks just in case, though API should filter it.
  // Actually, since we update the state locally, approved/rejected tasks might still be in the 'tasks' array 
  // but with different status. We should filter them out for display.
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
      <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="Approve">
            <ActionIcon color="green" variant="light" onClick={() => handleApprove(task.id)}>
              <IconCheck size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Reject">
            <ActionIcon color="red" variant="light" onClick={() => openRejectModal(task.id)}>
              <IconX size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title order={2} mb="xl">Pending Approvals</Title>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {pendingTasks.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
            No pending tasks found.
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
