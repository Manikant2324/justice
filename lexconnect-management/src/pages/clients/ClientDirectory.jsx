import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Phone, Briefcase } from 'lucide-react';

export const ClientDirectory = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Error fetching client directory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-dark)' }}>Registered Client Accounts Directory</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of clients enrolled in the JusticeHub platform and total cases filed.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Client Directory...</div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--navy-dark)', color: '#FFFFFF' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Client Profile</th>
                <th style={{ padding: '1rem 1.25rem' }}>Email Address</th>
                <th style={{ padding: '1rem 1.25rem' }}>Phone Contact</th>
                <th style={{ padding: '1rem 1.25rem' }}>Registered Date</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Submitted Cases</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={client.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                      alt={client.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{client.name}</span>
                      {client.bio && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{client.bio}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--navy-dark)' }}>{client.email}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{client.phone || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--gold-dark)' }}>
                    {client.totalSubmittedCases} Cases
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
