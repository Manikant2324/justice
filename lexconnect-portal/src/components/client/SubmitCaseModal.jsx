import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scale, X, Send, AlertCircle, ChevronDown, BookOpen, Award, ShieldAlert } from 'lucide-react';

const caseTitlesByCategory = {
  'Property & Real Estate Law': [
    'Commercial Office Title Dispute & Boundary Breach',
    'Ancestral Land Partition & Inheritance Claim',
    'Builder-Buyer Agreement Breach & Delay Penalty',
    'Illegal Encroachment & Permanent Injunction Suit',
    'Tenant Eviction & Commercial Lease Agreement Default',
    'Other / Custom Property Law Matter'
  ],
  'Corporate & Commercial Law': [
    'Shareholder Dispute & Oppression/Mismanagement Claim',
    'Breach of Commercial Vendor Contract & Damages',
    'Joint Venture Dissolution & Equity Dispute',
    'Non-Disclosure Agreement (NDA) & Trade Secret Breach',
    'Director Fiduciary Duty Breach & Audit Investigation',
    'Other / Custom Corporate Law Matter'
  ],
  'Criminal Defense': [
    'Anticipatory Bail & Quashing of Criminal FIR',
    'Economic Offence / Financial Fraud & PMLA Defense',
    'Cheque Bounce (Section 138 NI Act) Defense',
    'Cybercrime & Online Identity Theft Defense',
    'Bail Petition & Criminal Trial Representation',
    'Other / Custom Criminal Defense Matter'
  ],
  'Intellectual Property (IP) Law': [
    'Trademark Infringement & Passing Off Action',
    'Copyright Ownership & Royalty Breach Litigation',
    'Patent Invalidation & Infringement Defense',
    'Trade Secret Misappropriation & Ex-Parte Injunction',
    'Brand Counterfeiting & Domain Name Dispute (UDRP)',
    'Other / Custom Intellectual Property Matter'
  ],
  'Family & Matrimonial Law': [
    'Mutual Consent / Contested Divorce Petition',
    'Child Custody & International Guardianship Application',
    'Maintenance & Alimony Permanent Settlement Proceedings',
    'Domestic Violence & Protection Order Application',
    'HUF Partition & Family Settlement Deed Enforcement',
    'Other / Custom Family Law Matter'
  ],
  'Civil Litigation': [
    'Money Recovery Suit & Summary Procedure (Order 37)',
    'Defamation Suit for Damages & Public Injunction',
    'Specific Performance of Agreement Enforcement',
    'Civil Declaration of Rights & Title Suit',
    'Other / Custom Civil Litigation Matter'
  ],
  'Constitutional & Public Law': [
    'Writ Petition under Article 226 / 32 (Habeas Corpus / Mandamus)',
    'Public Interest Litigation (PIL) on Fundamental Rights',
    'Challenge to Government Tender / Executive Order',
    'Service & Administrative Tribunal (CAT) Appeal',
    'Other / Custom Constitutional Law Matter'
  ],
  'Consumer Law': [
    'Defective Product & Unfair Trade Practice Complaint',
    'Medical Negligence & Hospital Compensation Claim',
    'Insurance Claim Repudiation Dispute (Life / Health / Cargo)',
    'E-Commerce Fraud & Refund Default Action',
    'Other / Custom Consumer Rights Matter'
  ],
  'Labour & Employment Law': [
    'Unlawful Employee Termination & Reinstatement Claim',
    'Non-Compete Clause Enforcement & Non-Solicitation Dispute',
    'Gratuity, PF & Unpaid Severance Recovery',
    'Workplace Harassment & POSH Compliance Defense',
    'Other / Custom Labour Law Matter'
  ],
  'Tax Law': [
    'Income Tax Assessment & ITAT Appeal Petition',
    'GST Notice Challenge & Input Tax Credit Dispute',
    'Customs Duty Valuation & Seizure Injunction',
    'Transfer Pricing & International Taxation Audit',
    'Other / Custom Tax Law Matter'
  ],
  'Banking & Finance Law': [
    'DRT Recovery & Debt Recovery Appellate Tribunal Appeal',
    'SARFAESI Act Notice Injunction & Possession Challenge',
    'Loan Default Restructuring & One-Time Settlement (OTS)',
    'Banking Fraud & Unauthorized Transaction Liability',
    'Other / Custom Banking Law Matter'
  ],
  'Cyber & Technology Law': [
    'Data Privacy Breach & IT Act Section 66 Dispute',
    'Crypto Asset / Fintech Regulatory Enforcement',
    'Source Code Theft & SaaS Platform Misappropriation',
    'Online Harassment & Digital Content Takedown Notice',
    'Other / Custom Cyber Law Matter'
  ],
  'Insolvency & Bankruptcy Law': [
    'NCLT Corporate Insolvency Resolution Process (CIRP) Petition',
    'Operational Creditor Section 9 Insolvency Notice',
    'Financial Creditor Section 7 Recovery Application',
    'Personal Guarantor Insolvency Proceedings',
    'Other / Custom Bankruptcy Matter'
  ],
  'Immigration Law': [
    'Visa Repudiation & Deportation Stay Petition',
    'NRI Citizenship & Overseas Citizen of India (OCI) Dispute',
    'Corporate Foreign Worker Visa Compliance',
    'Extradition Representation & Red Corner Notice Relief',
    'Other / Custom Immigration Law Matter'
  ],
  'Environmental Law': [
    'National Green Tribunal (NGT) Pollution Injunction',
    'Environmental Clearance (EC) & Coastal Regulation Breach',
    'Industrial Effluent Default & Pollution Control Notice',
    'Other / Custom Environmental Law Matter'
  ],
  'Arbitration & Dispute Resolution': [
    'Section 11 Arbitrator Appointment Petition',
    'Section 9 Interim Measures Injunction Application',
    'Section 34 Challenge to Arbitral Award',
    'International Commercial Arbitration Enforcement',
    'Other / Custom Arbitration Matter'
  ],
  'Contract Law': [
    'Breach of Vendor Master Service Agreement (MSA)',
    'Force Majeure & Contract Frustration Claim',
    'Indemnity & Contractual Penalty Recovery',
    'Other / Custom Contract Law Matter'
  ],
  'Media & Entertainment Law': [
    'Film Copyright & Script Plagiarism Litigation',
    'Artist Management Contract & Exclusivity Breach',
    'Broadcasting Rights & OTT Content Censorship Injunction',
    'Celebrity Personality Rights Misappropriation',
    'Other / Custom Media Law Matter'
  ]
};

export const SubmitCaseModal = ({ isOpen, onClose, onCaseSubmitted }) => {
  const [category, setCategory] = useState('Property & Real Estate Law');
  const [selectedTitle, setSelectedTitle] = useState('Commercial Office Title Dispute & Boundary Breach');
  const [customTitle, setCustomTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Delhi NCR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update selectedTitle when category changes
  useEffect(() => {
    const availableTitles = caseTitlesByCategory[category] || caseTitlesByCategory['Property & Real Estate Law'];
    if (availableTitles && availableTitles.length > 0) {
      setSelectedTitle(availableTitles[0]);
      setCustomTitle('');
    }
  }, [category]);

  // Lock body scroll when modal is open
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

  if (!isOpen) return null;

  const isCustomSelected = selectedTitle.startsWith('Other / Custom');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalTitle = isCustomSelected ? (customTitle.trim() || selectedTitle) : selectedTitle;

    if (!finalTitle) {
      setError('Please select or enter a valid case title subject.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/cases', {
        title: finalTitle,
        category,
        priority,
        description,
        preferredLocation
      });

      onCaseSubmitted(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '2.25rem', maxWidth: '680px', borderRadius: '12px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#0B1628',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(11,22,40,0.15)'
            }}>
              <Scale size={22} color="#C9A45C" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', color: '#0B1628', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                Submit New Legal Case
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#667085' }}>
                Select your practice area category and specific case subject from the dropdown lists.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#667085', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #FCA5A5'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* 1. Category Selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1628', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={15} color="#C9A45C" />
                <span>1. Select Legal Specialization Category *</span>
              </label>
              <span style={{ fontSize: '0.72rem', background: '#F8F7F3', border: '1px solid #E2E8F0', padding: '0.15rem 0.5rem', borderRadius: '4px', color: '#C9A45C', fontWeight: 700 }}>
                18 Practice Areas
              </span>
            </div>

            <div className="select-premium-wrapper">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-premium"
              >
                {Object.keys(caseTitlesByCategory).map((catName) => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </select>
              <div className="select-icon">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* 2. Structured Case Title Dropdown Menu */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1628', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={15} color="#C9A45C" />
                <span>2. Select Specific Case Title / Subject *</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: '#667085', fontWeight: 600 }}>
                Tailored for {category}
              </span>
            </div>

            <div className="select-premium-wrapper">
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="select-premium"
                style={{ borderColor: '#C9A45C', background: '#FAF9F6' }}
              >
                {(caseTitlesByCategory[category] || []).map((titleOption, idx) => (
                  <option key={idx} value={titleOption}>{titleOption}</option>
                ))}
              </select>
              <div className="select-icon">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* 2b. Custom Title Input Box if "Other / Custom" selected */}
          {isCustomSelected && (
            <div style={{ background: '#FAF9F6', padding: '1rem', borderRadius: '8px', border: '1px solid #C9A45C' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0B1628' }}>
                Specify Custom Case Title Subject *
              </label>
              <input
                type="text"
                placeholder="Type your custom legal matter subject title here..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
                required
              />
            </div>
          )}

          {/* 3. Priority & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: '#0B1628' }}>
                Urgency / Priority *
              </label>
              <div className="select-premium-wrapper">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="select-premium"
                >
                  <option value="Low">Low (Standard Review)</option>
                  <option value="Medium">Medium (Regular Notice)</option>
                  <option value="High">High (Impending Court Date)</option>
                  <option value="Urgent">Urgent (Immediate Stay/Injunction Needed)</option>
                </select>
                <div className="select-icon">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: '#0B1628' }}>
                Preferred Court Jurisdiction / City
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi High Court / Mumbai NCLT / Supreme Court"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '8px', border: '1.5px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* 4. Detailed Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem', color: '#0B1628' }}>
              Detailed Description of Legal Matter *
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed summary of your legal issue, key dates, opposing parties, and required legal remedies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '8px', border: '1.5px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
              required
            />
          </div>

          <div style={{
            display: 'flex',
            justify: 'flex-end',
            gap: '0.85rem',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.35rem',
            marginTop: '0.5rem'
          }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '0.7rem 1.35rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '0.7rem 1.6rem', fontWeight: 700 }}>
              <Send size={16} />
              <span>{loading ? 'Submitting Case...' : 'Submit Case to Management'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
