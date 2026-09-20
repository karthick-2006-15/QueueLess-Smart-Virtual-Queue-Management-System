import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';

import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import QueueTrackPage from './pages/QueueTrackPage';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <QueueProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Student / General User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/queue" element={<QueueTrackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Staff and Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
                <Route path="/staff" element={<StaffPage />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </QueueProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
