import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { User, PaginatedResponse, PaginationMeta } from '@repo/types';
import type { CreateUserInput } from '@repo/schema';

interface UsersState {
  users: User[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  meta: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params?: { page?: number; limit?: number }) => {
  const response = await api.get('/users', { params });
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData: CreateUserInput) => {
  const response = await api.post('/users', userData);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await api.delete(`/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PaginatedResponse<User>>) => {
        state.loading = false;
        state.users = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });

    // Create User
    builder
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
        // Optimistically update total count if meta exists, though ideally refresh list
        if (state.meta) {
           state.meta.total += 1;
        }
      });

    // Delete User
    builder
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.meta) {
            state.meta.total -= 1;
        }
      });
  },
});

export default usersSlice.reducer;
