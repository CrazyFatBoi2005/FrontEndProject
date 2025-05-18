import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // ещё не создан

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Защищённые маршруты */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            {/* позже: /projects, /tasks и т.д. */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
