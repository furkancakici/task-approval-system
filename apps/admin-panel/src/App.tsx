import { UiProvider } from '@repo/ui';
import { Provider } from '@repo/store';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/store';
import { router } from '@/lib/routes';

function App() {
  return (
    <Provider store={store}>
      <UiProvider>
        <RouterProvider router={router} />
      </UiProvider>
    </Provider>
  );
}

export default App;
