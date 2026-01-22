import { Modal, TextInput, PasswordInput, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from '@/utils/form-resolver';
import { UpdateUserSchema, type UpdateUserInput } from '@repo/schema';
import { UserRole, type User } from '@repo/types';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/usersSlice';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ opened, onClose, user }: EditUserModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const form = useForm<UpdateUserInput>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: UserRole.VIEWER,
    },
    validate: zodResolver(UpdateUserSchema),
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        password: '', // Password stays empty unless changing
      });
    }
  }, [user]);

  const handleSubmit = async (values: UpdateUserInput) => {
    if (!user) return;
    
    try {
      // Only send password if it's not empty
      const data = { ...values };
      if (!data.password) delete data.password;

      await dispatch(updateUser({ id: user.id, data })).unwrap();
      notifications.show({
        title: t('common.success'),
        message: t('users.updateUserSuccess'),
        color: 'green',
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('users.updateUserError'),
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t('users.editUserTitle')} centered>
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
          description={t('users.passwordUpdateDescription')}
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
          <Button variant="default" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit">{t('common.save')}</Button>
        </Group>
      </form>
    </Modal>
  );
}
