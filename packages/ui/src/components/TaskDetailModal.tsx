import { Modal, Text, Group, Badge, Stack, Divider, Box, Paper } from '@repo/mantine';
import { useTranslation } from 'react-i18next';
import { TaskStatus, TaskPriority, TaskCategory, type Task } from '@repo/types';
import { getStatusColor, getCategoryColor, getPriorityColor } from '../columns/task';

interface TaskDetailModalProps {
  opened: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskDetailModal({ opened, onClose, task }: TaskDetailModalProps) {
  const { t } = useTranslation();

  if (!task) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={t('tasks.taskDetail')} size="lg" centered>
      <Stack gap="md">
        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {t('tasks.title')}
          </Text>
          <Text fw={600} size="lg">
            {task.title}
          </Text>
        </Box>

        <Divider />

        <Group grow>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {t('tasks.category')}
            </Text>
            <Badge color={getCategoryColor(task.category as TaskCategory)}>
              {t(`enums.category.${task.category}`)}
            </Badge>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {t('tasks.priority')}
            </Text>
            <Badge color={getPriorityColor(task.priority)} variant="light">
              {t(`enums.priority.${task.priority}`)}
            </Badge>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {t('common.status')}
            </Text>
            <Badge color={getStatusColor(task.status)} variant="outline">
              {t(`enums.status.${task.status}`)}
            </Badge>
          </Box>
        </Group>

        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {t('tasks.descriptionLabel')}
          </Text>
          <Paper withBorder p="sm" mt={4}>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {task.description}
            </Text>
          </Paper>
        </Box>

        {task.status === TaskStatus.REJECTED && task.rejectionReason && (
          <Box>
            <Text size="xs" c="red" tt="uppercase" fw={700}>
              {t('tasks.rejectionReasonLabel')}
            </Text>
            <Paper withBorder p="sm" bg="red.0" mt={4} style={{ borderColor: 'var(--mantine-color-red-2)' }}>
              <Text size="sm" c="red.9">
                {task.rejectionReason}
              </Text>
            </Paper>
          </Box>
        )}

        <Divider />

        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {t('tasks.creator')}
            </Text>
            <Text size="sm">{(task as any).user?.name || '-'}</Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              {t('common.createdAt')}
            </Text>
            <Text size="sm">{new Date(task.createdAt).toLocaleString('tr-TR')}</Text>
          </Box>
          {task.status !== TaskStatus.PENDING && (
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {t('tasks.updatedAt')}
              </Text>
              <Text size="sm">{new Date(task.updatedAt).toLocaleString('tr-TR')}</Text>
            </Box>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
