import { createSlice, createAsyncThunk } from '@repo/store';
import { api } from '@/lib/api';

interface StatsState {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  loading: false,
  error: null,
};

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.pending = action.payload.pending;
        state.approved = action.payload.approved;
        state.rejected = action.payload.rejected;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export default statsSlice.reducer;
