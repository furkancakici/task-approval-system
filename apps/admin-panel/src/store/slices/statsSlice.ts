import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@repo/api-client';

interface AdminStats {
  totalUsers: number;
  pendingTasks: number;
  completedTasks: number;
}

interface StatsState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'stats/fetchAdminStats',
  async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export default statsSlice.reducer;
