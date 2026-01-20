import { Title, Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <Title>User Dashboard</Title>
      <Button color="red" onClick={handleLogout} mt="md">Logout</Button>
    </div>
  );
}
