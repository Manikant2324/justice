import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { DocumentVault } from '../../components/documents/DocumentVault';
import { AppointmentsManager } from '../../components/appointments/AppointmentsManager';
import { ArrowLeft, Scale, User, Shield, FileText, MessageSquare, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const ClientCaseDetails = ({ caseId, onBack }) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/cases/${caseId}`);
      setCaseData(res.data);
    } catch (err) {
      console.error('Error fetching case details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Case Details...</div>;
  }

  if (!caseData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Case not found.</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '1rem' }}>Back to Dashboard</button>
      </div>
    );
  }

  const { title, caseNumber, category, priority, status, description, preferredLocation, assignedLawyer, timeline } = caseData;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Navigation */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--navy-dark)',
          marginBottom: '1.25rem'
        }}
      >
        <ArrowLeft size={16} /> Back to My Cases
      </button>

      {/* Case Header Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{caseNumber}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {category}</span>
              <span className={`badge badge-${priority.toLowerCase()}`}>{priority} Priority</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>{title}</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Jurisdiction: <strong>{preferredLocation}</strong></p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Current Status</span>
            <span className="badge badge-assigned" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>{status}</span>
          </div>
        </div>

        {/* Assigned Lawyer Card Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {assignedLawyer ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={assignedLawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'}
                alt={assignedLawyer.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-accent)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{assignedLawyer.name}</h4>
                  <span style={{ fontSize: '0.7rem', background: '#D1FAE5', color: '#065F46', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 600 }}>
                    Assigned Lead Advocate
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {assignedLawyer.specialization} • {assignedLawyer.experienceYears} Years Legal Experience
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--navy-dark)', fontWeight: 600 }}>
                  Contact: {assignedLawyer.phone} | {assignedLawyer.email}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={24} color="var(--gold-dark)" />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-dark)' }}>Lawyer Selection under Management Review</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  JusticeHub directors are inspecting your legal matter to select the most experienced advocate.
                </p>
              </div>
            </div>
          )}

          {assignedLawyer && (
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button onClick={() => setActiveTab('chat')} className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                <MessageSquare size={16} /> Encrypted Chat
              </button>
              <button onClick={() => setActiveTab('appointments')} className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
                <Calendar size={16} /> Book Consultation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        {[
          { id: 'overview', label: 'Overview & Details', icon: FileText },
          { id: 'timeline', label: 'Case Timeline', icon: Clock },
          { id: 'documents', label: 'Document Vault', icon: Shield },
          { id: 'chat', label: 'Client ↔ Lawyer Chat', icon: MessageSquare },
          { id: 'appointments', label: 'Consultations', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? 'var(--navy-dark)' : 'var(--text-muted)',
                borderBottom: isActive ? '3px solid var(--gold-accent)' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--gold-accent)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--navy-dark)' }}>Case Summary & Matter Description</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
            {description}
          </p>

          {caseData.assignmentNote && (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Management Assignment Note
              </span>
              <p style={{ fontSize: '0.85rem', color: '#78350F' }}>{caseData.assignmentNote}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--navy-dark)' }}>Chronological Case Progress Timeline</h3>

          {timeline && timeline.length > 0 ? (
            <div style={{ paddingLeft: '0.5rem' }}>
              {timeline.map((event, index) => (
                <div key={event._id || index} className="timeline-item">
                  <div className="timeline-dot" />
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {new Date(event.createdAt).toLocaleDateString()} • {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.25rem' }}>
                    {event.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {event.description}
                  </p>
                  <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'var(--text-main)', fontWeight: 600 }}>
                    Stage: {event.stage}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No timeline events recorded yet.</p>
          )}
        </div>
      )}

      {activeTab === 'documents' && <DocumentVault caseId={caseId} />}

      {activeTab === 'chat' && <ChatWindow caseId={caseId} />}

      {activeTab === 'appointments' && <AppointmentsManager caseId={caseId} assignedLawyer={assignedLawyer} />}
    </div>
  );
};
