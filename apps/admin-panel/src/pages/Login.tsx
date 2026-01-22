import { useDispatch } from '@repo/store';
import { useNavigate } from 'react-router-dom';
import { Button, PasswordInput, TextInput, useForm } from '@repo/mantine';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@repo/ui';
import { zodResolver } from '@/utils/form-resolver';
import { LoginSchema, type LoginInput } from '@repo/schema';
import { login } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';

export function Login() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const form = useForm<LoginInput>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(LoginSchema),
  });

  const handleSubmit = async (values: LoginInput) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title={t('auth.adminLoginTitle')}
      subtitle={t('auth.adminLoginSubtitle')}
      currentLanguage={i18n.language}
      onLanguageChange={(lang) => i18n.changeLanguage(lang)}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label={t('auth.password')}
          placeholder={t('auth.passwordPlaceholder')}
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="xl" type="submit" loading={status === 'loading'}>
          {t('auth.signIn')}
        </Button>
      </form>
    </AuthLayout>
  );
}
