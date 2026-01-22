import { UiProvider } from '@repo/ui';
import { Provider } from '@repo/store';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/store';
import { router } from '@/lib/routes';
import { useSocket } from '@repo/socket/client';
import { taskAdded, taskUpdated, taskDeleted } from '@/store/slices/tasksSlice';
import { useMemo } from 'react';

function AppContent() {
  const socketActions = useMemo(
    () => ({
      onTaskCreated: () => taskAdded(),
      onTaskUpdated: () => taskUpdated(),
      onTaskDeleted: () => taskDeleted(),
    }),
    []
  );

  useSocket(socketActions);
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <UiProvider theme={{ primaryColor: 'cyan' }}>
        <AppContent />
      </UiProvider>
    </Provider>
  );
}

export default App;
