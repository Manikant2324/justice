import React, { useState, useContext, useEffect } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Camera, Save, X, Shield, Phone, CheckCircle2 } from 'lucide-react';

export const AdminProfileModal = ({ isOpen, onClose }) => {
  const { admin, updateAdminProfile } = useContext(AdminAuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (admin) {
      setName(admin.name || '');
      setPhone(admin.phone || '');
      setAvatarPreview(admin.avatar || '');
    }
  }, [admin, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !admin) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await updateAdminProfile(formData);
      setSuccessMsg('Director profile and DP photo updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update director profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'rgba(11, 22, 40, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(11, 22, 40, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          margin: 'auto'
        }}
      >
        <div style={{
          background: '#0B1628',
          color: '#FFFFFF',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#C9A45C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
                Director Profile & DP Avatar
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Directorate Management Account Settings
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          {successMsg && (
            <div style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid #86EFAC'
            }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              border: '1px solid #FCA5A5'
            }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '0.75rem' }}>
              <img
                src={avatarPreview || admin.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
                alt={admin.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #C9A45C',
                  boxShadow: '0 4px 12px rgba(11, 22, 40, 0.15)'
                }}
              />
              <label
                htmlFor="admin-avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  background: '#0B1628',
                  color: '#C9A45C',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <Camera size={16} />
              </label>
              <input
                id="admin-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#172033' }}>
              {admin.name}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Director Profile • Click camera icon to upload DP
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                Director Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                Director Email Address
              </label>
              <input
                type="email"
                value={admin.email}
                disabled
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8F7F3', color: '#667085', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#172033' }}>
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{
              display: 'flex',
              justify: 'flex-end',
              gap: '0.85rem',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '1.25rem',
              marginTop: '0.75rem'
            }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                <Save size={16} />
                <span>{loading ? 'Saving Profile...' : 'Save Director Profile & DP'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
