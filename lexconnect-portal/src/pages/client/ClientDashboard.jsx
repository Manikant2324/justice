import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { SubmitCaseModal } from '../../components/client/SubmitCaseModal';
import { Plus, Briefcase, Clock, CheckCircle2, User, ChevronRight, Search, FileText } from 'lucide-react';

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cases');
      setCases(res.data);
    } catch (err) {
      console.error('Error fetching client cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Review': return <span className="badge badge-pending">Pending Review</span>;
      case 'Lawyer Assigned': return <span className="badge badge-assigned">Lawyer Assigned</span>;
      case 'Under Investigation':
      case 'Drafting & Filing':
      case 'In Negotiations': return <span className="badge badge-progress">{status}</span>;
      case 'Court Hearing': return <span className="badge badge-hearing">Court Hearing</span>;
      case 'Completed': return <span className="badge badge-completed">Completed</span>;
      default: return <span className="badge badge-low">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = cases.length;
  const activeCount = cases.filter(c => c.status !== 'Completed' && c.status !== 'Rejected').length;
  const completedCount = cases.filter(c => c.status === 'Completed').length;
  const pendingCount = cases.filter(c => c.status === 'Pending Review').length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Welcome Banner Card */}
      <div className="card-hover" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Client Workspace
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: '#172033', marginTop: '0.2rem', marginBottom: '0.4rem' }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ color: '#667085', fontSize: '0.9rem', maxWidth: '600px' }}>
            Track active court cases, exchange messages with your lawyer, and inspect submitted evidence documents.
          </p>
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="btn-gold" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
          <Plus size={18} />
          <span>Submit New Case</span>
        </button>
      </div>

      {/* Metrics Cards with Hover Movement */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Total Submitted Cases</span>
            <Briefcase size={18} color="#0B1628" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033' }}>{totalCount}</h3>
        </div>

        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Active Cases</span>
            <Clock size={18} color="#C9A45C" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#C9A45C' }}>{activeCount}</h3>
        </div>

        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Pending Review</span>
            <FileText size={18} color="#D97706" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#D97706' }}>{pendingCount}</h3>
        </div>

        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Resolved Cases</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#10B981' }}>{completedCount}</h3>
        </div>
      </div>

      {/* Filter & Search Header */}
      <div className="card-hover" style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#172033' }}>My Cases</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#F8F7F3',
            border: '1px solid #E2E8F0',
            padding: '0.45rem 0.85rem',
            borderRadius: '6px'
          }}>
            <Search size={16} color="#667085" />
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              background: '#F8F7F3',
              fontSize: '0.85rem'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Lawyer Assigned">Lawyer Assigned</option>
            <option value="Court Hearing">Court Hearing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Case List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#667085' }}>Loading cases...</div>
      ) : filteredCases.length === 0 ? (
        <div className="card-hover" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Briefcase size={40} color="#667085" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Cases Found</h4>
          <p style={{ color: '#667085', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            You haven't submitted any legal cases yet or no matches found for your filter.
          </p>
          <button onClick={() => setShowSubmitModal(true)} className="btn-gold">
            <Plus size={16} /> Submit Case
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem._id}
              onClick={() => navigate(`/client/cases/${caseItem._id}`)}
              className="card-hover"
              style={{
                padding: '1.35rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr auto',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer'
              }}
            >
              {/* Case Details Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C9A45C' }}>
                    {caseItem.caseNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#667085' }}>• {caseItem.category}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#172033', marginBottom: '0.4rem' }}>
                  {caseItem.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#667085', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {caseItem.description}
                </p>
              </div>

              {/* Status */}
              <div>
                <span style={{ fontSize: '0.75rem', color: '#667085', display: 'block', marginBottom: '0.35rem' }}>
                  Status
                </span>
                {getStatusBadge(caseItem.status)}
              </div>

              {/* Assigned Lawyer */}
              <div>
                <span style={{ fontSize: '0.75rem', color: '#667085', display: 'block', marginBottom: '0.35rem' }}>
                  Assigned Lawyer
                </span>
                {caseItem.assignedLawyer ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={caseItem.assignedLawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                      alt={caseItem.assignedLawyer.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#172033' }}>
                      {caseItem.assignedLawyer.name}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#667085' }}>
                    Awaiting Assignment
                  </span>
                )}
              </div>

              {/* Action Arrow */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#F8F7F3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B1628'
              }}>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Case Modal */}
      <SubmitCaseModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onCaseSubmitted={() => fetchCases()}
      />
    </div>
  );
};
