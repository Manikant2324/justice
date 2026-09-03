import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Scale, ArrowRight, AlertCircle, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';

export const Login = ({ defaultIsRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(defaultIsRegister || location.pathname === '/register');

  useEffect(() => {
    setIsRegister(location.pathname === '/register' || defaultIsRegister);
  }, [location.pathname, defaultIsRegister]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [specialization, setSpecialization] = useState('Property & Real Estate Law');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email ? email.trim() : '';
    const cleanPassword = password ? password.trim() : '';

    try {
      if (isRegister) {
        await register({ name: name.trim(), email: cleanEmail, password: cleanPassword, role, phone, specialization });
      } else {
        await login(cleanEmail, cleanPassword);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    const cleanDemoEmail = demoEmail.trim();
    const cleanDemoPassword = demoPassword.trim();
    setEmail(cleanDemoEmail);
    setPassword(cleanDemoPassword);
    setLoading(true);
    setError('');
    try {
      await login(cleanDemoEmail, cleanDemoPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      background: '#FFFFFF',
      margin: 0,
      padding: 0
    }}>
      {/* LEFT SIDE: FULL-BLEED 100vh THEME PANEL (LADY JUSTICE COURTROOM) */}
      <div style={{
        position: 'relative',
        backgroundImage: 'linear-gradient(180deg, rgba(11, 22, 40, 0.78) 0%, rgba(11, 22, 40, 0.95) 100%), url("https://res.cloudinary.com/zh5vbr6r/image/upload/v1788374306/justicehub_legal_vault/lady_justice.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '4rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}>
        {/* Top Branding Header */}
        <div>
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#C9A45C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Scale size={24} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#CBD5E1', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                Legal Case Management Platform
              </span>
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Judicial Truth.<br />
            <span style={{ color: '#C9A45C' }}>Unbiased Representation.</span>
          </h1>

          <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', marginBottom: '2rem' }}>
            Unified portal for Clients and Advocates. Track litigation progress in real time, upload evidence documents securely, and schedule video consultations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#E2E8F0' }}>
              <CheckCircle2 size={18} color="#C9A45C" />
              <span>100% Encrypted Attorney-Client Confidentiality</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#E2E8F0' }}>
              <CheckCircle2 size={18} color="#C9A45C" />
              <span>Real-Time Hearing & Petition Progress Tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#E2E8F0' }}>
              <CheckCircle2 size={18} color="#C9A45C" />
              <span>Workload-Balanced Senior Advocate Allocation</span>
            </div>
          </div>
        </div>

        {/* Bottom Quick Demo Login Overlay Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(201, 164, 92, 0.35)',
          borderRadius: '10px',
          padding: '1.35rem',
          maxWidth: '520px',
          marginTop: '2rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C9A45C', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⚡ Instant Evaluator Demo Access
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('client@justicehub.com', 'password123')}
              style={{
                padding: '0.7rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <span>Client (Rahul Sharma)</span>
              <ArrowRight size={14} color="#C9A45C" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('lawyer1@justicehub.com', 'password123')}
              style={{
                padding: '0.7rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <span>Lawyer (Adv. Priya Mehta)</span>
              <ArrowRight size={14} color="#C9A45C" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FULL 100vh FORM PANEL */}
      <div style={{
        padding: '4rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#FFFFFF',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Top Link Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#667085'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          {/* Header Tab Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => { setIsRegister(false); navigate('/login'); }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: !isRegister ? 700 : 500,
                color: !isRegister ? '#0B1628' : '#667085',
                borderBottom: !isRegister ? '3px solid #C9A45C' : '3px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); navigate('/register'); }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: isRegister ? 700 : 500,
                color: isRegister ? '#0B1628' : '#667085',
                borderBottom: isRegister ? '3px solid #C9A45C' : '3px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Register
            </button>
          </div>

          <p style={{ color: '#667085', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            {isRegister ? 'Create your Client or Lawyer account to get started.' : 'Enter your credentials to access your legal workspace.'}
          </p>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid #FCA5A5'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#172033' }}>
                    Select Account Type *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: role === 'client' ? '#0B1628' : '#F8F7F3',
                        color: role === 'client' ? '#FFFFFF' : '#667085',
                        border: '1px solid #CBD5E1'
                      }}
                    >
                      Client Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('lawyer')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: role === 'lawyer' ? '#0B1628' : '#F8F7F3',
                        color: role === 'lawyer' ? '#FFFFFF' : '#667085',
                        border: '1px solid #CBD5E1'
                      }}
                    >
                      Lawyer / Advocate
                    </button>
                  </div>
                </div>

                {role === 'lawyer' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                      Specialization *
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.9rem' }}
                    >
                      <option value="Property & Real Estate Law">Property & Real Estate Law</option>
                      <option value="Corporate & Commercial Law">Corporate & Commercial Law</option>
                      <option value="Criminal Defense">Criminal Defense</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                Password *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <span>{loading ? 'Authenticating...' : (isRegister ? 'Create Account' : 'Sign In to Workspace')}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const nextState = !isRegister;
                setIsRegister(nextState);
                navigate(nextState ? '/register' : '/login');
              }}
              style={{ fontSize: '0.88rem', color: '#0B1628', fontWeight: 600 }}
            >
              {isRegister ? 'Already registered? Sign In to Workspace' : 'New user? Create Client or Lawyer account'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p style={{ position: 'absolute', bottom: '2rem', left: '5rem', right: '5rem', textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
          By logging in, you agree to JusticeHub Terms of Service & Confidentiality Protocols.
        </p>
      </div>
    </div>
  );
};
