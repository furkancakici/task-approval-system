import { useEffect, useState } from 'react';
import { Title, Table, Badge, Paper, TextInput, Select, Group, Button } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/slices/tasksSlice';
import { TaskStatus, TaskPriority, TaskCategory, type Task } from '@repo/types';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

export function AllTasks() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  
  const [debouncedSearch] = useDebouncedValue(search, 500);

  useEffect(() => {
    dispatch(fetchTasks({
      search: debouncedSearch || undefined,
      status: status as TaskStatus | undefined,
      priority: priority as TaskPriority | undefined,
      category: category as TaskCategory | undefined,
    }));
  }, [dispatch, debouncedSearch, status, priority, category]);

  const clearFilters = () => {
    setSearch('');
    setStatus(null);
    setPriority(null);
    setCategory(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatus.APPROVED: return 'green';
      case TaskStatus.REJECTED: return 'red';
      case TaskStatus.PENDING: return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'red';
      case TaskPriority.HIGH: return 'orange';
      case TaskPriority.NORMAL: return 'blue';
      case TaskPriority.LOW: return 'gray';
      default: return 'gray';
    }
  };

  const rows = tasks.map((task: Task) => (
    <Table.Tr key={task.id}>
      <Table.Td>{task.title}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(task.status)} variant="dot">
            {task.status}
        </Badge>
      </Table.Td>
      <Table.Td>{task.category}</Table.Td>
      <Table.Td>
        <Badge color={getPriorityColor(task.priority)} variant="light">
          {task.priority}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(task.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>{(task as any).user?.name || 'Unknown'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title order={2} mb="md">All Tasks History</Title>

      <Paper p="md" mb="xl" withBorder radius="md">
        <Group align="end">
            <TextInput
            label="Search"
            placeholder="Search by title..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
            />
            <Select
            label="Status"
            placeholder="Filter by status"
            data={Object.values(TaskStatus)}
            value={status}
            onChange={setStatus}
            clearable
            />
            <Select
            label="Priority"
            placeholder="Filter by priority"
            data={Object.values(TaskPriority)}
            value={priority}
            onChange={setPriority}
            clearable
            />
            <Button variant="light" color="gray" onClick={clearFilters} leftSection={<IconX size={16}/>}>
                Clear
            </Button>
        </Group>
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Creator</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : (
                <Table.Tr>
                    <Table.Td colSpan={6} style={{ textAlign: 'center', color: 'gray', padding: 20 }}>
                        {loading ? 'Loading...' : 'No tasks found matching your filters.'}
                    </Table.Td>
                </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}
