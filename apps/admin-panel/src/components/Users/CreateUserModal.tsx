import { Modal, TextInput, PasswordInput, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from '@/utils/form-resolver';
import { CreateUserSchema, type CreateUserInput } from '@repo/schema';
import { UserRole } from '@repo/types';
import { useAppDispatch } from '@/store/hooks';
import { createUser } from '@/store/slices/usersSlice';
import { notifications } from '@mantine/notifications';

interface CreateUserModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateUserModal({ opened, onClose }: CreateUserModalProps) {
  const dispatch = useAppDispatch();
  
  const form = useForm<CreateUserInput>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: UserRole.USER,
    },
    validate: zodResolver(CreateUserSchema),
  });

  const handleSubmit = async (values: CreateUserInput) => {
    try {
      await dispatch(createUser(values)).unwrap();
      notifications.show({
        title: 'Success',
        message: 'User created successfully',
        color: 'green',
      });
      form.reset();
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create user',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create New User" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="John Doe"
          withAsterisk
          mb="md"
          {...form.getInputProps('name')}
        />
        
        <TextInput
          label="Email"
          placeholder="john@example.com"
          withAsterisk
          mb="md"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Secure password"
          withAsterisk
          mb="md"
          {...form.getInputProps('password')}
        />

        <Select
          label="Role"
          data={[
            { value: UserRole.ADMIN, label: 'Admin' },
            { value: UserRole.USER, label: 'User' },
          ]}
          withAsterisk
          mb="xl"
          {...form.getInputProps('role')}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create User</Button>
        </Group>
      </form>
    </Modal>
  );
}
