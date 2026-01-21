import { UiProvider } from '@repo/ui';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';

import { Login } from './pages/Login';
import { CreateTask } from './pages/CreateTask';
import { MyTasks } from './pages/MyTasks';
import { Dashboard } from './pages/Dashboard';
import { UserLayout } from './components/Layout/UserLayout';
import { ProtectedRoute, PublicRoute } from './components/Auth/AuthRoutes';

function App() {
  return (
    <Provider store={store}>
      <UiProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<MyTasks />} />
                <Route path="/tasks/create" element={<CreateTask />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </UiProvider>
    </Provider>
  );
}

export default App;
