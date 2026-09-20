import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <i
            className="fa-solid fa-spinner fa-spin"
            style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}
          ></i>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading QueueLess session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
