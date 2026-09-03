import React, { useContext, useState } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { AdminProfileModal } from './AdminProfileModal';
import { ShieldCheck, LogOut, Scale, Settings } from 'lucide-react';

export const AdminNavbar = () => {
  const { admin, logoutAdmin } = useContext(AdminAuthContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!admin) return null;

  return (
    <>
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#172033',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: '#0B1628',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C9A45C'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: '#0B1628' }}>
              JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.62rem', color: '#667085', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Directorate Management Portal
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: '#92400E',
            fontWeight: 700
          }}>
            <ShieldCheck size={14} /> DIRECTORATE ACCESS
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              background: '#FAF9F6',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            title="Edit Director Profile & DP Photo"
          >
            <img
              src={admin.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
              alt={admin.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9A45C' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#172033' }}>{admin.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#667085' }}>{admin.email}</span>
            </div>
            <Settings size={15} color="#C9A45C" style={{ marginLeft: '0.3rem' }} />
          </button>

          <button
            onClick={logoutAdmin}
            style={{
              background: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #FCA5A5',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Admin Director Profile & DP Modal */}
      <AdminProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
