import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import VoicePage from './pages/Voice';
import TopicsPage from './pages/Topics';
import ConsultationsPage from './pages/Consultations';
import DocumentsPage from './pages/Documents';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'advocate' ? '/advocate' : '/dashboard'} replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'advocate' ? '/advocate' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><Dashboard /></ProtectedRoute>} />
      <Route path="/consultations" element={<ProtectedRoute><ConsultationsPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><VoicePage /></ProtectedRoute>} />
      <Route path="/topics" element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/advocate" element={<ProtectedRoute allowedRoles={['advocate']}><AdvocateDashboard /></ProtectedRoute>} />
      <Route path="/advocate/clients" element={<ProtectedRoute allowedRoles={['advocate']}><AdvocateDashboard /></ProtectedRoute>} />
      <Route path="/advocate/cases" element={<ProtectedRoute allowedRoles={['advocate']}><AdvocateDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
