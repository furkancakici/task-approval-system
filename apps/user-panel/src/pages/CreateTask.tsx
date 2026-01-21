import { Title, TextInput, Textarea, Select, Button, Paper, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
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
          <TextInput
            label={t('tasks.title')}
            placeholder={t('tasks.enterTitle')}
            withAsterisk
            {...form.getInputProps('title')}
          />
          
          <Textarea
            label={t('tasks.descriptionLabel')}
            placeholder={t('tasks.descriptionPlaceholder')}
            minRows={4}
            mt="md"
            withAsterisk
            {...form.getInputProps('description')}
          />

          <Group grow mt="md">
            <Select
              label={t('tasks.priority')}
              data={Object.values(TaskPriority)}
              withAsterisk
              {...form.getInputProps('priority')}
            />
            <Select
              label={t('tasks.category')}
              data={Object.values(TaskCategory)}
              withAsterisk
              {...form.getInputProps('category')}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => navigate('/tasks')}>{t('common.cancel')}</Button>
            <Button type="submit" loading={loading}>{t('tasks.createNewTask')}</Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}
