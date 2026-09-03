import React, { useState, useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import { Scale, Lock, AlertCircle, Shield, ArrowRight } from 'lucide-react';

export const AdminLogin = () => {
  const { loginAdmin } = useContext(AdminAuthContext);
  const [email, setEmail] = useState('admin@justicehub.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email.trim(), password.trim());
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B1628',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.35)',
        border: '1px solid #1E293B',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: '#0B1628',
            color: '#C9A45C',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(11,22,40,0.2)'
          }}>
            <Scale size={26} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#0B1628', marginBottom: '0.2rem' }}>
            JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
          </h1>
          <span style={{ fontSize: '0.72rem', color: '#667085', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
            Directorate Management Authentication
          </span>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #FCA5A5'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0B1628' }}>
              Director Email Address
            </label>
            <input
              type="email"
              placeholder="admin@justicehub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0B1628' }}>
              Director Access Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '0.8rem',
              justifyContent: 'center',
              marginTop: '0.5rem',
              fontSize: '0.92rem',
              fontWeight: 700
            }}
          >
            <Lock size={16} />
            <span>{loading ? 'Authenticating Director...' : 'Sign In to Management Portal'}</span>
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#667085'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#92400E', fontWeight: 600 }}>
            <Shield size={14} color="#C9A45C" />
            <span>Restricted Directorate Portal</span>
          </div>
          <p style={{ marginTop: '0.3rem', fontSize: '0.72rem' }}>
            Demo Admin: <strong>admin@justicehub.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
