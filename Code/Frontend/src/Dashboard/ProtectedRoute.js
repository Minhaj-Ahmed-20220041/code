import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../authContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { state } = useAuth();
  const { isLoggedIn, user } = state;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />; // Redirect to home if the user doesn't have the required role
  }

  return <Outlet />;
};

export default ProtectedRoute;
