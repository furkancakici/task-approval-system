import { UiProvider } from '@repo/ui';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';

import { Login } from './pages/Login';
import { CreateTask } from './pages/CreateTask';
import { MyTasks } from './pages/MyTasks';
import { UserLayout } from './components/Layout/UserLayout';

function App() {
  return (
    <Provider store={store}>
      <UiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<MyTasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </UiProvider>
    </Provider>
  );
}

export default App;
