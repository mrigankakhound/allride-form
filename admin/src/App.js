import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RecordDetail from './pages/RecordDetail';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/records/:id" element={<ProtectedRoute><RecordDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
