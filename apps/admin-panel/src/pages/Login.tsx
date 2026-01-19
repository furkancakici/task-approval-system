import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, PasswordInput, TextInput, Paper, Title, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
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
    <Container size={420} my={40}>
      <Title ta="center" className="font-bold text-2xl mb-4">
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput 
            label="Email" 
            placeholder="you@mantine.dev" 
            withAsterisk 
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            withAsterisk 
            mt="md" 
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

          <Button fullWidth mt="xl" type="submit" loading={status === 'loading'}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
