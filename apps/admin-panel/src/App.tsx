import { UiProvider } from '@repo/ui';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import { Login } from './pages/Login';

function App() {
  return (
    <Provider store={store}>
      <UiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </UiProvider>
    </Provider>
  );
}

export default App;
