import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, Video, User, Plus, X } from 'lucide-react';

export const AppointmentsManager = ({ caseId, assignedLawyer }) => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('Legal Consultation Session');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState('Video Call');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [caseId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      const caseAppts = res.data.filter((app) => app.case?._id === caseId || app.case === caseId);
      setAppointments(caseAppts);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/appointments', {
        caseId,
        lawyerId: assignedLawyer?._id,
        title,
        date,
        time,
        type,
        notes
      });
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      console.error('Error creating appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.15rem' }}>Scheduled Consultations</h3>
        {assignedLawyer ? (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> Book Consultation
          </button>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Lawyer assignment pending before booking consultations.
          </p>
        )}
      </div>

      {appointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming appointments scheduled.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {appointments.map((app) => (
            <div
              key={app._id}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-assigned">{app.status}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-dark)' }}>{app.type}</span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>
                {app.title}
              </h4>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} color="var(--gold-accent)" />
                  <span>Date: {app.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} color="var(--gold-accent)" />
                  <span>Time: {app.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--gold-accent)" />
                  <span>With: {user.role === 'client' ? app.lawyer?.name : app.client?.name}</span>
                </div>
              </div>

              {app.notes && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: '#F8FAFC', padding: '0.5rem', borderRadius: '4px' }}>
                  {app.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>Book Legal Consultation</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Consultation Purpose
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Mode</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                >
                  <option value="Video Call">High-Security Video Call</option>
                  <option value="In-Person Consultation">In-Person Office Consultation</option>
                  <option value="Phone Call">Confidential Phone Call</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Notes for Lawyer</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key topics or documents you wish to discuss..."
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
