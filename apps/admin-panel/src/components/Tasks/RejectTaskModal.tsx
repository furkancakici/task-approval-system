import { useState } from 'react';
import { Modal, Textarea, Button, Group, notifications } from '@repo/mantine';
import { useAppDispatch } from '@/store/hooks';
import { updateTaskStatus } from '@/store/slices/tasksSlice';
import { TaskStatus } from '@repo/types';
import { useTranslation } from 'react-i18next';

interface RejectTaskModalProps {
  opened: boolean;
  onClose: () => void;
  taskId: string | null;
}

export function RejectTaskModal({ opened, onClose, taskId }: RejectTaskModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!taskId) return;
    if (reason.length < 5) {
      notifications.show({
        title: t('common.error'),
        message: t('tasks.rejectionReasonMinLength'),
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        updateTaskStatus({
          id: taskId,
          data: { status: TaskStatus.REJECTED, rejectionReason: reason },
        })
      ).unwrap();

      notifications.show({
        title: t('common.success'),
        message: t('tasks.rejectSuccess'),
        color: 'green',
      });
      setReason('');
      onClose();
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('tasks.rejectError'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t('tasks.rejectTaskTitle')} centered>
      <Textarea
        label={t('tasks.rejectionReasonLabel')}
        placeholder={t('tasks.rejectionReasonPlaceholder')}
        minRows={3}
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
        withAsterisk
        mb="xl"
      />

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button color="red" onClick={handleReject} loading={loading}>
          {t('tasks.reject')}
        </Button>
      </Group>
    </Modal>
  );
}
