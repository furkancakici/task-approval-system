import { configureStore } from '@repo/store';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import usersReducer from './slices/usersSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    users: usersReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
