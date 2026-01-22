import { configureStore } from '@repo/store';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
