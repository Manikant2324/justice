import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AdminAuthProvider, AdminAuthContext } from './context/AdminAuthContext';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminOverview } from './pages/dashboard/AdminOverview';
import { CaseManagement } from './pages/cases/CaseManagement';
import { LawyerDirectory } from './pages/lawyers/LawyerDirectory';
import { ClientDirectory } from './pages/clients/ClientDirectory';
import { ReportsAnalytics } from './pages/reports/ReportsAnalytics';
import { AssignLawyerModal } from './components/AssignLawyerModal';
import { CaseReviewModal } from './components/CaseReviewModal';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1628', color: '#FFFFFF' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#C9A45C' }}>JUSTICEHUB MANAGEMENT</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Authenticating Director Workspace...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminLayout = () => {
  const { admin } = useContext(AdminAuthContext);
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetCaseForAssign, setTargetCaseForAssign] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetCaseIdForReview, setTargetCaseIdForReview] = useState(null);

  useEffect(() => {
    if (admin) {
      fetchPendingCount();
    }
  }, [admin, location.pathname]);

  const fetchPendingCount = async () => {
    try {
      const res = await axios.get('/api/cases');
      const pending = res.data.filter(c => c.status === 'Pending Review');
      setPendingCount(pending.length);
    } catch (err) {
      console.error('Error fetching pending count:', err);
    }
  };

  const handleOpenAssign = (caseItem) => {
    setTargetCaseForAssign(caseItem);
    setAssignModalOpen(true);
  };

  const handleOpenReview = (caseId) => {
    setTargetCaseIdForReview(caseId);
    setReviewModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar pendingCount={pendingCount} />

        <main style={{ flex: 1, padding: '2rem 2.5rem', background: 'var(--bg-main)', overflowY: 'auto' }}>
          <Routes>
            <Route path="/overview" element={
              <AdminOverview onOpenAssignModal={handleOpenAssign} onOpenReviewModal={handleOpenReview} />
            } />
            <Route path="/cases" element={
              <CaseManagement onOpenAssignModal={handleOpenAssign} onOpenReviewModal={handleOpenReview} />
            } />
            <Route path="/lawyers" element={<LawyerDirectory />} />
            <Route path="/clients" element={<ClientDirectory />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <AssignLawyerModal
        isOpen={assignModalOpen}
        caseItem={targetCaseForAssign}
        onClose={() => setAssignModalOpen(false)}
        onAssigned={() => fetchPendingCount()}
      />

      <CaseReviewModal
        isOpen={reviewModalOpen}
        caseId={targetCaseIdForReview}
        onClose={() => setReviewModalOpen(false)}
        onOpenAssignModal={handleOpenAssign}
      />
    </div>
  );
};

const AdminMainApp = () => {
  const { admin } = useContext(AdminAuthContext);

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/overview" replace /> : <AdminLogin />} />
      <Route path="/*" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminMainApp />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
