import { Modal, TextInput, PasswordInput, Select, Button, Group, useForm } from '@repo/mantine';
import { zodResolver } from '@/utils/form-resolver';
import { CreateUserSchema, type CreateUserInput } from '@repo/schema';
import { UserRole } from '@repo/types';
import { useAppDispatch } from '@/store/hooks';
import { createUser } from '@/store/slices/usersSlice';
import { notifications } from '@repo/mantine';
import { useTranslation } from 'react-i18next';

interface CreateUserModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateUserModal({ opened, onClose }: CreateUserModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const form = useForm<CreateUserInput>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: UserRole.VIEWER,
    },
    validate: zodResolver(CreateUserSchema),
  });

  const handleSubmit = async (values: CreateUserInput) => {
    try {
      await dispatch(createUser(values)).unwrap();
      notifications.show({
        title: t('common.success'),
        message: t('users.createUserSuccess'),
        color: 'green',
      });
      form.reset();
      onClose();
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('users.createUserError'),
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t('users.createUserTitle')} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('users.nameLabel')}
          placeholder={t('users.namePlaceholder')}
          withAsterisk
          mb="md"
          {...form.getInputProps('name')}
        />

        <TextInput
          label={t('auth.email')}
          placeholder={t('users.emailPlaceholder')}
          withAsterisk
          mb="md"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label={t('auth.password')}
          placeholder={t('users.passwordPlaceholder')}
          withAsterisk
          mb="md"
          {...form.getInputProps('password')}
        />

        <Select
          label={t('users.roleLabel')}
          data={[
            { value: UserRole.ADMIN, label: t(`enums.role.${UserRole.ADMIN}`) },
            { value: UserRole.MODERATOR, label: t(`enums.role.${UserRole.MODERATOR}`) },
            { value: UserRole.VIEWER, label: t(`enums.role.${UserRole.VIEWER}`) },
            { value: UserRole.USER, label: t(`enums.role.${UserRole.USER}`) },
          ]}
          withAsterisk
          mb="xl"
          {...form.getInputProps('role')}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('common.create')}</Button>
        </Group>
      </form>
    </Modal>
  );
}
