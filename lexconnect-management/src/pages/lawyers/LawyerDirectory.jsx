import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Award, Phone, Mail, Briefcase, Sparkles } from 'lucide-react';

export const LawyerDirectory = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/lawyers');
      setLawyers(res.data);
    } catch (err) {
      console.error('Error fetching lawyers directory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-dark)' }}>Empaneled Advocates Directory & Workload Tracker</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Inspect lawyer legal specializations, active case loads, contact credentials, and experience ratings.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Advocate Network...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {lawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <img
                  src={lawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'}
                  alt={lawyer.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', fontWeight: 700 }}>{lawyer.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block' }}>
                    {lawyer.specialization}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lawyer.experienceYears} Years Legal Experience
                  </span>
                </div>
              </div>

              {lawyer.bio && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', background: '#F8FAFC', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                  "{lawyer.bio}"
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="var(--gold-accent)" /> <span>{lawyer.phone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--gold-accent)" /> <span>{lawyer.email}</span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--navy-dark)', fontWeight: 600 }}>
                  Total Handled: {lawyer.totalCaseCount}
                </span>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  background: lawyer.workloadStatus === 'Light' ? '#D1FAE5' : (lawyer.workloadStatus === 'Moderate' ? '#DBEAFE' : '#FEE2E2'),
                  color: lawyer.workloadStatus === 'Light' ? '#065F46' : (lawyer.workloadStatus === 'Moderate' ? '#1E40AF' : '#991B1B')
                }}>
                  {lawyer.workloadStatus} Load ({lawyer.activeCaseCount} Active)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
