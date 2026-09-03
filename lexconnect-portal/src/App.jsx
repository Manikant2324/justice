import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientCaseDetails } from './pages/client/ClientCaseDetails';
import { LawyerDashboard } from './pages/lawyer/LawyerDashboard';
import { LawyerCaseDetails } from './pages/lawyer/LawyerCaseDetails';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1628', color: '#FFFFFF' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#C9A45C' }}>JUSTICEHUB</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'client' ? '/client/dashboard' : '/lawyer/dashboard'} replace />;
  }

  return children;
};

// Wrapper for Client Case Details using URL params
const ClientCaseDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ClientCaseDetails caseId={id} onBack={() => navigate('/client/dashboard')} />;
};

// Wrapper for Lawyer Case Details using URL params
const LawyerCaseDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <LawyerCaseDetails caseId={id} onBack={() => navigate('/lawyer/dashboard')} />;
};

// Main Layout Wrapper
const AppLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Hide top global workspace Navbar & bottom layout Footer when on LandingPage ('/'), Login, or Register routes
  const hideGlobalLayout = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F7F3', color: '#172033' }}>
      {user && !hideGlobalLayout && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'client' ? '/client/dashboard' : '/lawyer/dashboard'} replace /> : <Login defaultIsRegister={false} />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'client' ? '/client/dashboard' : '/lawyer/dashboard'} replace /> : <Login defaultIsRegister={true} />} />

          {/* Protected Client Routes */}
          <Route path="/client/dashboard" element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/cases/:id" element={
            <ProtectedRoute allowedRole="client">
              <ClientCaseDetailsWrapper />
            </ProtectedRoute>
          } />

          {/* Protected Lawyer Routes */}
          <Route path="/lawyer/dashboard" element={
            <ProtectedRoute allowedRole="lawyer">
              <LawyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/lawyer/cases/:id" element={
            <ProtectedRoute allowedRole="lawyer">
              <LawyerCaseDetailsWrapper />
            </ProtectedRoute>
          } />

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideGlobalLayout && (
        <footer style={{
          background: '#0B1628',
          color: '#94A3B8',
          padding: '1.25rem 2rem',
          borderTop: '1px solid #1E293B',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          <p>© 2026 JusticeHub Advocates & Legal Consultants. All Rights Reserved. Attorney-Client Privilege Protected.</p>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
