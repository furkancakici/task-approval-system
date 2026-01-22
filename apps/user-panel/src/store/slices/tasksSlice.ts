import { createSlice, createAsyncThunk, type PayloadAction } from '@repo/store';
import { api } from '@/lib/api';
import {
  TaskPriority,
  TaskStatus,
  TaskCategory,
  type Task,
  type PaginatedResponse,
  type PaginationMeta,
} from '@repo/types';
import type { CreateTaskInput } from '@repo/schema';

interface TasksState {
  tasks: Task[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

const initialState: TasksState = {
  tasks: [],
  meta: null,
  loading: false,
  error: null,
  lastUpdated: 0,
};

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: TaskCategory;
  }) => {
    // The backend uses the token to identify the user and filter tasks accordingly
    const response = await api.get('/tasks', { params });
    return response.data;
  }
);

export const createTask = createAsyncThunk('tasks/createTask', async (data: CreateTaskInput) => {
  const response = await api.post('/tasks', data);
  return response.data;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded: (state) => {
      state.lastUpdated = Date.now();
    },
    taskUpdated: (state) => {
      state.lastUpdated = Date.now();
    },
    taskDeleted: (state) => {
      state.lastUpdated = Date.now();
    },
  },
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
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      });
  },
});

export const { taskAdded, taskUpdated, taskDeleted } = tasksSlice.actions;
export default tasksSlice.reducer;
