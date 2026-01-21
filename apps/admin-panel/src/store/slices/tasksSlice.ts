import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Task, TaskStatus } from '@repo/types';
import type { TaskQueryInput, UpdateTaskInput } from '@repo/schema';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (query: TaskQueryInput) => {
  const response = await api.get('/tasks', { params: query });
  return response.data;
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, data }: { id: string; data: UpdateTaskInput }) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });

    // Update Task Status
    builder.addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
      // Update the task in the list
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    });
  },
});

export default tasksSlice.reducer;
