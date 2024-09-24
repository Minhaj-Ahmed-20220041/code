import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../authContext';

const ProtectedRoute = () => {
  const { state: authState } = useAuth();
  const location = useLocation();

  return authState.isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />
  );
};

export default ProtectedRoute;
