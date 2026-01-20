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

export function CreateTask() {
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
        title: 'Success',
        message: 'Task created successfully',
        color: 'green',
      });
      navigate('/tasks');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create task',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title order={2} mb="xl">Create New Task</Title>

      <Paper withBorder radius="md" p="xl" maw={600}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Title"
            placeholder="Enter task title"
            withAsterisk
            {...form.getInputProps('title')}
          />
          
          <Textarea
            label="Description"
            placeholder="Describe the task details..."
            minRows={4}
            mt="md"
            withAsterisk
            {...form.getInputProps('description')}
          />

          <Group grow mt="md">
            <Select
              label="Priority"
              data={Object.values(TaskPriority)}
              withAsterisk
              {...form.getInputProps('priority')}
            />
            <Select
              label="Category"
              data={Object.values(TaskCategory)}
              withAsterisk
              {...form.getInputProps('category')}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => navigate('/tasks')}>Cancel</Button>
            <Button type="submit" loading={loading}>Create Task</Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}
