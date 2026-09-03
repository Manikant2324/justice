import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCheck, Eye, Filter, RefreshCw, Briefcase } from 'lucide-react';

export const CaseManagement = ({ onOpenAssignModal, onOpenReviewModal }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cases');
      setCases(res.data);
    } catch (err) {
      console.error('Error fetching admin cases queue:', err);
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
      case 'Court Hearing': return <span className="badge badge-urgent">Court Hearing</span>;
      case 'Completed': return <span className="badge badge-completed">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
                          (c.client?.name && c.client.name.toLowerCase().includes(search.toLowerCase())) ||
                          (c.assignedLawyer?.name && c.assignedLawyer.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-dark)' }}>Comprehensive Case Queue & Administration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review case details, audit evidence files, search/filter litigation records, and assign lead advocates.
          </p>
        </div>

        <button onClick={fetchCases} className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#F8FAFC',
          border: '1px solid var(--border-light)',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          flex: 1,
          minWidth: '240px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by ID, title, client, or advocate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.85rem', background: '#F8FAFC' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Lawyer Assigned">Lawyer Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Court Hearing">Court Hearing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.85rem', background: '#F8FAFC' }}
          >
            <option value="All">All Categories</option>
            <option value="Property & Real Estate Law">Property & Real Estate Law</option>
            <option value="Corporate & Commercial Law">Corporate & Commercial Law</option>
            <option value="Criminal Defense">Criminal Defense</option>
            <option value="Intellectual Property">Intellectual Property</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Case Directory...</div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--navy-dark)', color: '#FFFFFF', borderBottom: '1px solid rgba(197, 160, 89, 0.3)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Case Reference</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Client Profile</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Assigned Advocate</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Status Stage</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{c.caseNumber}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)', margin: '0.15rem 0' }}>{c.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{c.client?.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{c.client?.email}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    {c.assignedLawyer ? (
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{c.assignedLawyer.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{c.assignedLawyer.specialization}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>Unassigned</span>
                    )}
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    {getStatusBadge(c.status)}
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => onOpenReviewModal(c._id)} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        <Eye size={14} /> Review
                      </button>
                      <button onClick={() => onOpenAssignModal(c)} className="btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        <UserCheck size={14} /> {c.assignedLawyer ? 'Reassign' : 'Assign'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
