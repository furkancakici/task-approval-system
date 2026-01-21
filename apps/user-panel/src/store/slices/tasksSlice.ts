import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Task, PaginatedResponse, PaginationMeta } from '@repo/types';
import type { CreateTaskInput } from '@repo/schema';

interface TasksState {
  tasks: Task[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  meta: null,
  loading: false,
  error: null,
};

export const fetchMyTasks = createAsyncThunk('tasks/fetchMyTasks', async (params?: { page?: number; limit?: number }) => {
  // The backend uses the token to identify the user and filter tasks accordingly
  const response = await api.get('/tasks', { params });
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (data: CreateTaskInput) => {
  const response = await api.post('/tasks', data);
  return response.data;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action: PayloadAction<PaginatedResponse<Task>>) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
        if (state.meta) {
           state.meta.total += 1;
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      });
  },
});

export default tasksSlice.reducer;
