import { Title, TextInput, Textarea, Select, Button, Paper, Group, notifications, useForm } from '@repo/mantine';
import { motion } from '@repo/shared';
import { useAppDispatch } from '@/store/hooks';
import { createTask } from '@/store/slices/tasksSlice';
import { useNavigate } from 'react-router-dom';
import { CreateTaskSchema, type CreateTaskInput } from '@repo/schema';
import { TaskPriority, TaskCategory } from '@repo/types';
import { zodResolver } from '@/utils/form-resolver';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CreateTask() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateTaskInput>({
    initialValues: {
      title: '',
      description: '',
      priority: TaskPriority.NORMAL,
      category: TaskCategory.OTHER,
    },
    validate: zodResolver(CreateTaskSchema),
  });

  const handleSubmit = async (values: CreateTaskInput) => {
    setLoading(true);
    try {
      await dispatch(createTask(values)).unwrap();
      notifications.show({
        title: t('common.success'),
        message: t('tasks.createTaskSuccess'),
        color: 'green',
      });
      navigate('/tasks');
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('tasks.createTaskError'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title order={2} mb="xl">{t('tasks.createNewTask')}</Title>

      <Paper withBorder radius="md" p="xl" maw={600}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TextInput
              label={t('tasks.title')}
              placeholder={t('tasks.enterTitle')}
              withAsterisk
              {...form.getInputProps('title')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Textarea
              label={t('tasks.descriptionLabel')}
              placeholder={t('tasks.descriptionPlaceholder')}
              minRows={4}
              mt="md"
              withAsterisk
              {...form.getInputProps('description')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Group grow mt="md">
              <Select
                label={t('tasks.priority')}
                data={Object.values(TaskPriority).map(p => ({ value: p, label: t(`enums.priority.${p}`) }))}
                withAsterisk
                {...form.getInputProps('priority')}
              />
              <Select
                label={t('tasks.category')}
                data={Object.values(TaskCategory).map(c => ({ value: c, label: t(`enums.category.${c}`) }))}
                withAsterisk
                {...form.getInputProps('category')}
              />
            </Group>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={() => navigate('/tasks')}>{t('common.cancel')}</Button>
              <Button type="submit" loading={loading}>{t('tasks.createNewTask')}</Button>
            </Group>
          </motion.div>
        </form>
      </Paper>
    </>
  );
}
