import { useState } from 'react';
import { Modal, Textarea, Button, Group } from '@mantine/core';
import { useAppDispatch } from '@/store/hooks';
import { updateTaskStatus } from '@/store/slices/tasksSlice';
import { notifications } from '@mantine/notifications';
import { TaskStatus } from '@repo/types';

interface RejectTaskModalProps {
  opened: boolean;
  onClose: () => void;
  taskId: string | null;
}

export function RejectTaskModal({ opened, onClose, taskId }: RejectTaskModalProps) {
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!taskId) return;
    if (reason.length < 5) {
        notifications.show({
            title: 'Error',
            message: 'Reason must be at least 5 characters long',
            color: 'red'
        });
        return;
    }

    setLoading(true);
    try {
      await dispatch(updateTaskStatus({
        id: taskId,
        data: { status: TaskStatus.REJECTED, rejectionReason: reason }
      })).unwrap();
      
      notifications.show({
        title: 'Success',
        message: 'Task rejected successfully',
        color: 'green',
      });
      setReason('');
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to reject task',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Reject Task" centered>
      <Textarea
        label="Rejection Reason"
        placeholder="Please explain why this task is being rejected..."
        minRows={3}
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
        withAsterisk
        mb="xl"
      />

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button color="red" onClick={handleReject} loading={loading}>Reject Task</Button>
      </Group>
    </Modal>
  );
}
