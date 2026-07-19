import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Wraps a route component and redirects to /login
 * if the admin session is not set.
 */
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
