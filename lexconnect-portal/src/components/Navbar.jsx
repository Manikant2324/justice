import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import { Scale, LogOut, Briefcase, User, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!user) return null;

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
        {/* Brand Logo */}
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
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#0B1628',
              letterSpacing: '-0.01em'
            }}>
              JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.62rem',
              color: '#667085',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              Legal Case Management
            </span>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{
          background: '#F8F7F3',
          border: '1px solid #E2E8F0',
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          <Briefcase size={14} color="#C9A45C" />
          <span style={{ color: '#0B1628', textTransform: 'capitalize' }}>
            {user.role === 'client' ? 'Client Workspace' : 'Lawyer Workspace'}
          </span>
        </div>

        {/* User Actions & Profile Avatar Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
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
            title="Edit Profile & Change DP Photo"
          >
            <img
              src={user.avatar || (user.role === 'lawyer'
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100')}
              alt={user.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #C9A45C'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#172033' }}>{user.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#667085' }}>{user.email}</span>
            </div>
            <Settings size={15} color="#C9A45C" style={{ marginLeft: '0.3rem' }} />
          </button>

          <button
            onClick={logout}
            title="Logout"
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
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Profile & DP Avatar Edit Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
