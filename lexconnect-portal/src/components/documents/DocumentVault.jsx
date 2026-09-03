import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Upload, Download, Eye, Image as ImageIcon, Music, Video, Plus, X } from 'lucide-react';

export const DocumentVault = ({ caseId }) => {
  const [documents, setDocuments] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Case Evidence');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const getFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    fetchDocuments();
  }, [caseId]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`/api/cases/${caseId}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title || file.name);
      formData.append('category', category);
      formData.append('file', file);

      await axios.post(`/api/cases/${caseId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowUploadModal(false);
      setTitle('');
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (filterType === 'all') return true;
    return doc.fileType === filterType;
  });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <ImageIcon size={22} color="#3B82F6" />;
      case 'audio': return <Music size={22} color="#8B5CF6" />;
      case 'video': return <Video size={22} color="#EC4899" />;
      default: return <FileText size={22} color="var(--gold-accent)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Upload CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pdf', 'image', 'audio', 'video'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                background: filterType === type ? 'var(--navy-dark)' : '#F1F5F9',
                color: filterType === type ? '#FFFFFF' : 'var(--text-muted)',
                border: '1px solid ' + (filterType === type ? 'var(--navy-dark)' : 'var(--border-light)')
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Grid / Table */}
      {filteredDocs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>No Documents Uploaded</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Upload contracts, evidence images, audio recordings or video statements for this case.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                padding: '1.1rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8FAFC',
                  border: '1px solid var(--border-light)'
                }}>
                  {getFileIcon(doc.fileType)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '0.2rem' }}>
                    {doc.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {doc.category} • {doc.fileSize}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    Uploaded by {doc.uploadedBy?.name} on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Media Preview Box */}
              {doc.fileType === 'audio' && (
                <audio controls src={getFileUrl(doc.fileUrl)} style={{ width: '100%', height: '32px' }} />
              )}
              {doc.fileType === 'video' && (
                <video controls src={getFileUrl(doc.fileUrl)} style={{ width: '100%', borderRadius: '6px', maxHeight: '160px' }} />
              )}
              {doc.fileType === 'image' && (
                <img
                  src={getFileUrl(doc.fileUrl)}
                  alt={doc.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => setPreviewMedia(doc)}
                />
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.65rem',
                marginTop: '0.25rem'
              }}>
                <button
                  onClick={() => window.open(getFileUrl(doc.fileUrl), '_blank')}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--navy-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Eye size={15} /> View File
                </button>

                <a
                  href={getFileUrl(doc.fileUrl)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--gold-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textDecoration: 'none'
                  }}
                >
                  <Download size={15} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>Upload Case Document</h3>
              <button onClick={() => setShowUploadModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Registered Land Sale Deed 2018"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <option value="Ownership & Title Deed">Ownership & Title Deed</option>
                  <option value="Case Evidence">Case Evidence</option>
                  <option value="Court Affidavit & Petition">Court Affidavit & Petition</option>
                  <option value="Audio Statement">Audio Statement</option>
                  <option value="Video Statement">Video Statement</option>
                  <option value="Identity Proof">Identity Proof</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Select File (PDF, Image, Audio, Video)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.webm"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--gold-accent)',
                    background: '#F8FAFC'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
