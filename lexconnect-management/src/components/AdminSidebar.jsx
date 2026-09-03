import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, UserCheck, Users, BarChart3 } from 'lucide-react';

export const AdminSidebar = ({ pendingCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'overview', path: '/overview', label: 'Management Overview', icon: LayoutDashboard },
    { id: 'cases', path: '/cases', label: 'Case Queue & Review', icon: Briefcase, badge: pendingCount },
    { id: 'lawyers', path: '/lawyers', label: 'Lawyers & Workload', icon: UserCheck },
    { id: 'clients', path: '/clients', label: 'Client Directory', icon: Users },
    { id: 'reports', path: '/reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <aside style={{
      width: '250px',
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      minHeight: 'calc(100vh - 58px)'
    }}>
      <div style={{
        padding: '0.4rem 0.75rem',
        fontSize: '0.68rem',
        fontWeight: 700,
        color: '#667085',
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }}>
        Directorate Navigation
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: isActive ? '#F8F7F3' : 'transparent',
              color: isActive ? '#0B1628' : '#667085',
              border: isActive ? '1px solid #E2E8F0' : '1px solid transparent',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Icon size={17} color={isActive ? '#C9A45C' : '#667085'} />
              <span>{item.label}</span>
            </div>

            {item.badge > 0 && (
              <span style={{
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '10px'
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
