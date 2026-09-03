import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, User, Clock, CheckSquare, Calendar, Search, ChevronRight } from 'lucide-react';

export const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [casesRes, tasksRes] = await Promise.all([
        axios.get('/api/cases'),
        axios.get('/api/tasks')
      ]);
      setCases(casesRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching lawyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lawyer Assigned': return <span className="badge badge-assigned">Assigned</span>;
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
                          (c.client?.name && c.client.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAssigned = cases.length;
  const activeCount = cases.filter(c => c.status !== 'Completed').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Lawyer Header Card */}
      <div className="card-hover" style={{
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt={user?.name}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #C9A45C'
            }}
          />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Advocate Workspace
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: '#172033', marginTop: '0.1rem', marginBottom: '0.2rem' }}>
              {user?.name}
            </h1>
            <p style={{ color: '#667085', fontSize: '0.85rem' }}>
              Specialization: <strong>{user?.specialization || 'General Practice'}</strong> • {user?.experienceYears || 8} Yrs Experience
            </p>
          </div>
        </div>

        <div style={{
          background: '#F8F7F3',
          border: '1px solid #E2E8F0',
          padding: '0.65rem 1.15rem',
          borderRadius: '8px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#667085', display: 'block' }}>Active Workload</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#C9A45C' }}>
            {activeCount} Active Cases
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Assigned Cases</span>
            <Briefcase size={18} color="#0B1628" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033' }}>{totalAssigned}</h3>
        </div>

        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Active Matters</span>
            <Clock size={18} color="#C9A45C" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#C9A45C' }}>{activeCount}</h3>
        </div>

        <div className="card-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#667085' }}>Pending Tasks</span>
            <CheckSquare size={18} color="#D97706" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#D97706' }}>{pendingTasksCount}</h3>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="card-hover" style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#172033' }}>Assigned Cases</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              placeholder="Search title or client..."
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
            <option value="Lawyer Assigned">Lawyer Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Court Hearing">Court Hearing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#667085' }}>Loading assigned cases...</div>
      ) : filteredCases.length === 0 ? (
        <div className="card-hover" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Briefcase size={40} color="#667085" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Cases Assigned Yet</h4>
          <p style={{ color: '#667085', fontSize: '0.85rem' }}>
            Cases assigned to your chambers by management will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredCases.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/lawyer/cases/${c._id}`)}
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C9A45C' }}>{c.caseNumber}</span>
                  <span style={{ fontSize: '0.75rem', color: '#667085' }}>• {c.category}</span>
                  <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#172033', marginBottom: '0.4rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#667085', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#667085', display: 'block', marginBottom: '0.35rem' }}>
                  Status Stage
                </span>
                {getStatusBadge(c.status)}
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#667085', display: 'block', marginBottom: '0.35rem' }}>
                  Client Profile
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={c.client?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                    alt={c.client?.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#172033', display: 'block' }}>
                      {c.client?.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#667085' }}>{c.client?.phone}</span>
                  </div>
                </div>
              </div>

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
    </div>
  );
};
