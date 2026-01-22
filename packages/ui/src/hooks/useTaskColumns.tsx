import { Badge, Text, Tooltip, ActionIcon, Group } from '@repo/mantine';
import { IconInfoCircle, IconEye } from '@repo/mantine';
import { useTranslation } from 'react-i18next';
import { TaskStatus, TaskCategory, type Task } from '@repo/types';
import type { Column } from '../components/DataTable';
import { getStatusColor, getCategoryColor, getPriorityColor } from '../columns/task';

export interface UseTaskColumnsOptions {
  excludeFields?: (keyof Task | 'user' | 'actions')[];
  onView?: (task: Task) => void;
}

export function useTaskColumns(options: UseTaskColumnsOptions = {}) {
  const { t } = useTranslation();
  const { excludeFields = [] } = options;

  const allColumns: Column<Task>[] = [
    {
      key: 'title',
      header: t('tasks.title'),
      render: (task) => <Text size="sm" fw={500}>{task.title}</Text>
    },
    {
      key: 'user',
      header: t('common.users'),
      render: (task) => <Text size="sm">{(task as any).user?.name || '-'}</Text>
    },
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
      key: 'status',
      header: t('common.status'),
      render: (task) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge color={getStatusColor(task.status)} variant="outline">
            {t(`enums.status.${task.status}`)}
          </Badge>
          {task.status === TaskStatus.REJECTED && (task as any).rejectionReason && (
            <Tooltip label={`${t('tasks.rejectionReasonLabel')}: ${(task as any).rejectionReason}`} multiline w={220}>
              <ActionIcon variant="subtle" color="red" size="sm">
                <IconInfoCircle size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      header: t('common.createdAt'),
      render: (task) => (
        <Text size="sm">
          {new Date(task.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
        </Text>
      )
    },
    {
      key: 'updatedAt',
      header: t('tasks.updatedAt'),
      render: (task) => (
        <Text size="sm">
          {task.status !== TaskStatus.PENDING
            ? new Date(task.updatedAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
            : '-'}
        </Text>
      )
    },
    {
      key: 'actions',
      header: t('common.actions'),
      render: (task) => (
        <Group gap="xs">
          {options.onView && (
            <Tooltip label={t('common.view')}>
              <ActionIcon variant="light" color="blue" onClick={() => options.onView?.(task)}>
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      )
    }
  ];

  return allColumns.filter(col => !excludeFields.includes(col.key as any));
}
