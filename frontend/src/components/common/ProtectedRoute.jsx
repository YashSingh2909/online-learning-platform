import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingScreen = () => (
  <div className="dashboard-page">
    <div className="dashboard-container">
      <div className="dashboard-loading">
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  </div>
);

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <h1>403 Unauthorized access</h1>
            <p>Your account does not have permission to open this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
