import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, UserCheck, Users, AlertCircle, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const AdminOverview = ({ onOpenAssignModal, onOpenReviewModal }) => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingCases, setPendingCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, casesRes, lawyersRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/cases'),
        axios.get('/api/admin/lawyers')
      ]);

      setAnalytics(analyticsRes.data);
      setPendingCases(casesRes.data.filter(c => c.status === 'Pending Review'));
      setLawyers(lawyersRes.data);
    } catch (err) {
      console.error('Error fetching admin overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Management Dashboard...</div>;
  }

  const { metrics } = analytics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome */}
      <div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-dark)', marginBottom: '0.35rem' }}>
          Management Executive Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time litigation monitoring, lawyer workload distribution, and case assignment pipeline.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Submitted Cases</span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--navy-dark)', marginTop: '0.2rem' }}>{metrics.totalCases}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #EF4444' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991B1B' }}>Pending Lawyer Assignment</span>
          <h3 style={{ fontSize: '1.8rem', color: '#991B1B', marginTop: '0.2rem' }}>{metrics.pendingCases}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Litigation Matters</span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-dark)', marginTop: '0.2rem' }}>{metrics.activeCases}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Empaneled Advocates</span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--navy-dark)', marginTop: '0.2rem' }}>{metrics.totalLawyers}</h3>
        </div>
      </div>

      {/* Pending Assignments Queue */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>Action Required</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)' }}>Pending Case Assignments Queue ({pendingCases.length})</h3>
          </div>
        </div>

        {pendingCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>All submitted cases have been assigned to suitable advocates!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pendingCases.map((caseItem) => (
              <div
                key={caseItem._id}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  background: '#FFFBEB',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr auto',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{caseItem.caseNumber}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', margin: '0.1rem 0' }}>{caseItem.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {caseItem.category}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Client</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-dark)' }}>{caseItem.client?.name}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Priority</span>
                  <span className={`badge badge-${caseItem.priority.toLowerCase()}`}>{caseItem.priority}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => onOpenReviewModal(caseItem._id)} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    Review Details
                  </button>
                  <button onClick={() => onOpenAssignModal(caseItem)} className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <UserCheck size={15} /> Assign Advocate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advocates Workload Summary Table */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', marginBottom: '1rem' }}>Advocate Workload Monitor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {lawyers.map((lawyer) => (
            <div key={lawyer._id} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={lawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                  alt={lawyer.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{lawyer.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lawyer.specialization}</p>
                </div>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                background: lawyer.workloadStatus === 'Light' ? '#D1FAE5' : (lawyer.workloadStatus === 'Moderate' ? '#DBEAFE' : '#FEE2E2'),
                color: lawyer.workloadStatus === 'Light' ? '#065F46' : (lawyer.workloadStatus === 'Moderate' ? '#1E40AF' : '#991B1B')
              }}>
                {lawyer.activeCaseCount} Active Cases
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
