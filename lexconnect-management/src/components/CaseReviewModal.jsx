import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText, Download, UserCheck, Shield, Clock, Eye, Music, Video } from 'lucide-react';

export const CaseReviewModal = ({ isOpen, caseId, onClose, onOpenAssignModal }) => {
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && caseId) {
      fetchCaseDetails();
    }
  }, [isOpen, caseId]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const [caseRes, docsRes] = await Promise.all([
        axios.get(`/api/cases/${caseId}`),
        axios.get(`/api/cases/${caseId}/documents`)
      ]);
      setCaseData(caseRes.data);
      setDocuments(docsRes.data);
    } catch (err) {
      console.error('Error fetching case review details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
              Management Audit & Review
            </span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-dark)' }}>Case Document & Submission Inspection</h3>
          </div>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        {loading || !caseData ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Case Inspection Data...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info */}
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{caseData.caseNumber}</span>
                <span className="badge badge-pending">{caseData.status}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)', marginBottom: '0.4rem' }}>{caseData.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category: <strong>{caseData.category}</strong> • Priority: <strong>{caseData.priority}</strong></p>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.35rem' }}>Full Legal Claim Description</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, background: '#FFFFFF', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                {caseData.description}
              </p>
            </div>

            {/* Client Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Client Details</h4>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{caseData.client?.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: {caseData.client?.email}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone: {caseData.client?.phone || 'N/A'}</p>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Assigned Advocate</h4>
                {caseData.assignedLawyer ? (
                  <>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{caseData.assignedLawyer.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{caseData.assignedLawyer.specialization}</p>
                  </>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 600 }}>Unassigned (Action Required)</p>
                )}
              </div>
            </div>

            {/* Uploaded Evidence Documents */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>
                Uploaded Evidence & Documents ({documents.length})
              </h4>
              {documents.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No documents uploaded for this case yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {documents.map((doc) => (
                    <div key={doc._id} style={{ background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-dark)', display: 'block', truncate: 'true' }}>{doc.title}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.fileType.toUpperCase()} • {doc.fileSize}</span>
                      </div>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                        <Eye size={15} /> Inspect
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Close Review</button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAssignModal(caseData);
                }}
                className="btn-primary"
              >
                <UserCheck size={16} />
                <span>{caseData.assignedLawyer ? 'Reassign Advocate' : 'Assign Suitable Lawyer'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
