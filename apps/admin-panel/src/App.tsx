import { UiProvider } from '@repo/ui';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { PendingTasks } from './pages/PendingTasks';
import { AllTasks } from './pages/AllTasks';
import { AdminLayout } from './components/Layout/AdminLayout';
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
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/tasks/pending" element={<PendingTasks />} />
                <Route path="/tasks/all" element={<AllTasks />} />
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
