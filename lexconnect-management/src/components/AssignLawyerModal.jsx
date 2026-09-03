import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, X, Award, Briefcase, Check, Sparkles, Send } from 'lucide-react';

export const AssignLawyerModal = ({ isOpen, caseItem, onClose, onAssigned }) => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyerId, setSelectedLawyerId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLawyers();
      if (caseItem?.assignedLawyer?._id) {
        setSelectedLawyerId(caseItem.assignedLawyer._id);
      }
    }
  }, [isOpen, caseItem]);

  const fetchLawyers = async () => {
    try {
      setFetching(true);
      const res = await axios.get('/api/admin/lawyers');
      setLawyers(res.data);
    } catch (err) {
      console.error('Error fetching lawyers list:', err);
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen || !caseItem) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedLawyerId) return;

    try {
      setLoading(true);
      await axios.post(`/api/admin/cases/${caseItem._id}/assign`, {
        lawyerId: selectedLawyerId,
        note
      });
      onAssigned();
      onClose();
    } catch (err) {
      console.error('Failed to assign lawyer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ padding: '2rem', maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
              Management Assignment Workflow
            </span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-dark)' }}>Select Lead Advocate for Case</h3>
          </div>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        {/* Target Case Info Box */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{caseItem.caseNumber}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {caseItem.category}</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{caseItem.title}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Client: <strong>{caseItem.client?.name}</strong> • Jurisdiction: <strong>{caseItem.preferredLocation}</strong>
          </p>
        </div>

        {/* Lawyers Selection List */}
        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>
              Available Advocates Directory (Workload & Specialization)
            </label>

            {fetching ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading advocates...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                {lawyers.map((lawyer) => {
                  const isSelected = selectedLawyerId === lawyer._id;
                  const isMatch = lawyer.specialization && caseItem.category && (
                    lawyer.specialization.toLowerCase().includes(caseItem.category.split(' ')[0].toLowerCase()) ||
                    caseItem.category.toLowerCase().includes(lawyer.specialization.split(' ')[0].toLowerCase())
                  );

                  return (
                    <div
                      key={lawyer._id}
                      onClick={() => setSelectedLawyerId(lawyer._id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--gold-accent)' : '1px solid var(--border-light)',
                        background: isSelected ? 'rgba(197, 160, 89, 0.06)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={lawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                          alt={lawyer.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{lawyer.name}</h4>
                            {isMatch && (
                              <span style={{ fontSize: '0.65rem', background: '#FEF3C7', color: '#92400E', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Sparkles size={10} /> Specialization Match
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {lawyer.specialization} • {lawyer.experienceYears} Yrs Exp
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background: lawyer.workloadStatus === 'Light' ? '#D1FAE5' : (lawyer.workloadStatus === 'Moderate' ? '#DBEAFE' : '#FEE2E2'),
                          color: lawyer.workloadStatus === 'Light' ? '#065F46' : (lawyer.workloadStatus === 'Moderate' ? '#1E40AF' : '#991B1B')
                        }}>
                          {lawyer.workloadStatus} Load ({lawyer.activeCaseCount} Active Cases)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.35rem' }}>
              Management Assignment Instructions / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Assigned to Adv. Priya due to her 12+ years experience in North Delhi property titles..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading || !selectedLawyerId} className="btn-primary">
              <Send size={16} />
              <span>{loading ? 'Assigning Advocate...' : 'Confirm Lawyer Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
