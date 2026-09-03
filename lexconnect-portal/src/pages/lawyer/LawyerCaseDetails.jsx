import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { DocumentVault } from '../../components/documents/DocumentVault';
import { AppointmentsManager } from '../../components/appointments/AppointmentsManager';
import { ArrowLeft, User, Shield, MessageSquare, Calendar, CheckSquare, FileText, Plus, Check, Clock, AlertCircle } from 'lucide-react';

export const LawyerCaseDetails = ({ caseId, onBack }) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Private Notes state
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    fetchCaseDetails();
    fetchNotes();
    fetchTasks();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/cases/${caseId}`);
      setCaseData(res.data);
      setStatus(res.data.status);
    } catch (err) {
      console.error('Error fetching lawyer case details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`/api/cases/${caseId}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      const caseTasks = res.data.filter(t => t.case?._id === caseId || t.case === caseId);
      setTasks(caseTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      const res = await axios.patch(`/api/cases/${caseId}/status`, {
        status,
        note: statusNote
      });
      setCaseData(res.data);
      setStatusNote('');
      alert('Case status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    try {
      const res = await axios.post(`/api/cases/${caseId}/notes`, {
        title: newNoteTitle || 'Internal Case Strategy Note',
        content: newNoteContent
      });
      setNotes([res.data, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await axios.post('/api/tasks', {
        caseId,
        title: newTaskTitle,
        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
        priority: 'Medium'
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Case Workspace...</div>;
  }

  if (!caseData) return null;

  const { client, caseNumber, category, priority, description, preferredLocation, timeline } = caseData;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Back */}
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
        <ArrowLeft size={16} /> Back to Assigned Cases
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{caseNumber}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {category}</span>
              <span className={`badge badge-${priority.toLowerCase()}`}>{priority} Priority</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>{caseData.title}</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Court Location: <strong>{preferredLocation}</strong></p>
          </div>

          {/* Status Update Form Panel */}
          <form onSubmit={handleUpdateStatus} style={{
            background: '#F8FAFC',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            minWidth: '320px'
          }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '0.35rem' }}>
              Update Case Stage Status
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ flex: 1, padding: '0.45rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <option value="Lawyer Assigned">Lawyer Assigned</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Drafting & Filing">Drafting & Filing</option>
                <option value="Court Hearing">Court Hearing</option>
                <option value="In Negotiations">In Negotiations</option>
                <option value="Completed">Completed</option>
              </select>
              <button type="submit" disabled={updatingStatus} className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                Save
              </button>
            </div>
            <input
              type="text"
              placeholder="Status update note (optional)..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              style={{ width: '100%', padding: '0.35rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-light)', fontSize: '0.75rem' }}
            />
          </form>
        </div>

        {/* Client Profile Summary Box */}
        <div style={{
          background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={client?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'}
              alt={client?.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Client Information</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{client?.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Phone: <strong>{client?.phone || 'N/A'}</strong> • Email: <strong>{client?.email}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'Overview & Client Matter', icon: FileText },
          { id: 'notes', label: 'Internal Notes', icon: FileText },
          { id: 'tasks', label: 'Tasks & Deadlines', icon: CheckSquare },
          { id: 'documents', label: 'Document Vault', icon: Shield },
          { id: 'chat', label: 'Client Chat', icon: MessageSquare },
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
                background: 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--gold-accent)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--navy-dark)' }}>Client Claim & Description</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {description}
          </p>
        </div>
      )}

      {/* Internal Notes Tab */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={handleAddNote} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-dark)' }}>Add Confidential Internal Note</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="text"
                placeholder="Note Title (e.g. Legal Research & Injunction Precedents)"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
              />
              <textarea
                rows={3}
                placeholder="Private lawyer observations, legal arguments, or case strategy..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary">
                  <Plus size={16} /> Save Private Note
                </button>
              </div>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notes.map((note) => (
              <div key={note._id} style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{note.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  Private Advocate Note
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={handleAddTask} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-dark)' }}>Add Case Task & Legal Deadline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.85rem' }}>
              <input
                type="text"
                placeholder="Task description (e.g. File Affidavit with Sub-Registrar)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                required
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
              />
              <button type="submit" className="btn-primary">
                <Plus size={16} /> Add Task
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  background: '#FFFFFF',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <button
                    onClick={() => handleToggleTask(task._id, task.status)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: '2px solid ' + (task.status === 'Completed' ? 'var(--success)' : 'var(--border-light)'),
                      background: task.status === 'Completed' ? 'var(--success)' : '#FFFFFF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {task.status === 'Completed' && <Check size={14} />}
                  </button>

                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--navy-dark)'
                  }}>
                    {task.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Due: {task.dueDate}</span>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && <DocumentVault caseId={caseId} />}
      {activeTab === 'chat' && <ChatWindow caseId={caseId} />}
      {activeTab === 'appointments' && <AppointmentsManager caseId={caseId} assignedLawyer={caseData.assignedLawyer} />}
    </div>
  );
};
