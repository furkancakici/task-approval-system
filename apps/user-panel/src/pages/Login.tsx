import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthLayout } from '@repo/ui';
import { zodResolver } from '@/utils/form-resolver';
import { LoginSchema, type LoginInput } from '@repo/schema';
import { login } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';

export function Login() {
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
      title="User Login" 
      subtitle="Access your tasks and dashboard"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="xl" type="submit" loading={status === 'loading'}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
