import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Scale, Shield, Users, FileText, Headphones, ArrowRight, Play, CheckCircle2,
  Building2, Gavel, Briefcase, Award, Phone, Mail, MapPin, ChevronRight, Lock, Search, Star, LogOut
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToSection = (id) => {
    setActiveTab(id);
    if (id === 'how-it-works' || id === 'tracking') {
      const element = document.getElementById('how-it-works');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [lawyersList, setLawyersList] = useState([]);

  React.useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axios.get('/api/auth/lawyers');
      if (res.data && res.data.length > 0) {
        setLawyersList(res.data);
      } else {
        setLawyersList([
          {
            _id: 'default1',
            name: 'Adv. Priya Mehta',
            specialization: 'Property & Real Estate Law',
            experienceYears: 14,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch lawyers for landing page:', err);
    }
  };

  return (
    <div style={{ background: '#F8F7F3', color: '#172033', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      {/* 1. TOP NAVIGATION BAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 3.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        {/* Logo Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: '#0B1628',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C9A45C'
          }}>
            <Scale size={20} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#0B1628',
              letterSpacing: '-0.01em'
            }}>
              JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.2rem' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Practice Areas' },
            { id: 'lawyers', label: 'Our Lawyers' },
            { id: 'how-it-works', label: 'Case Tracking' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                fontSize: '0.88rem',
                fontWeight: activeTab === item.id ? 700 : 500,
                color: activeTab === item.id ? '#0B1628' : '#667085',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === item.id ? '2px solid #C9A45C' : '2px solid transparent',
                paddingBottom: '0.2rem'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              color: '#172033',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              textDecoration: 'none',
              background: '#FFFFFF'
            }}
          >
            <Lock size={13} color="#C9A45C" /> Director Portal
          </a>

          {user ? (
            <>
              <button
                onClick={() => navigate(user.role === 'client' ? '/client/dashboard' : '/lawyer/dashboard')}
                className="btn-gold"
                style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem' }}
              >
                <span>Workspace Dashboard</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={logout}
                style={{
                  background: '#FEE2E2',
                  color: '#991B1B',
                  border: '1px solid #FCA5A5',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  color: '#0B1628',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  background: '#FFFFFF'
                }}
              >
                Log In
              </button>

              <button
                onClick={() => navigate('/register')}
                className="btn-gold"
                style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem' }}
              >
                Submit Your Case
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO CONTAINER */}
      <section id="home" style={{ padding: '3.5rem 3.5rem 2rem' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '4rem 4rem',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '3.5rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Left Column */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#F8F7F3',
              color: '#172033',
              border: '1px solid #E2E8F0',
              padding: '0.35rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Award size={14} color="#C9A45C" /> Judicial & Legal Case Platform
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '3.5rem',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#172033',
              marginBottom: '1.25rem'
            }}>
              Reliable Legal Support.<br />
              <span style={{ color: '#C9A45C' }}>Every Step of the Way.</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#667085',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              Connect with verified senior advocates, track court proceedings in real time, and manage confidential documents through our secure platform.
            </p>

            {/* Search Triage Bar */}
            <div style={{
              background: '#F8F7F3',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.35rem 0.35rem 0.35rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              <Search size={18} color="#667085" />
              <input
                type="text"
                placeholder="Search practice area or lawyer specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: '#172033',
                  background: 'transparent'
                }}
              />
              <button
                onClick={() => navigate('/register')}
                className="btn-gold"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
              >
                Search
              </button>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <button
                onClick={() => navigate('/register')}
                className="btn-gold"
                style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
              >
                <span>Submit Your Case</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => scrollToSection('lawyers')}
                className="btn-secondary"
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
              >
                <Users size={16} color="#0B1628" />
                <span>Our Lawyers</span>
              </button>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E2E8F0'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033', fontWeight: 700 }}>10K+</h3>
                <p style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 600 }}>Cases Resolved</p>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033', fontWeight: 700 }}>500+</h3>
                <p style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 600 }}>Empaneled Lawyers</p>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033', fontWeight: 700 }}>25+</h3>
                <p style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 600 }}>Practice Areas</p>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#172033', fontWeight: 700 }}>98%</h3>
                <p style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 600 }}>Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Column: Lady Justice Courtroom Image Card */}
          <div style={{ position: 'relative' }}>
            <div className="card-hover" style={{ padding: '0.75rem' }}>
              <img
                src="https://res.cloudinary.com/zh5vbr6r/image/upload/v1788374306/justicehub_legal_vault/lady_justice.jpg"
                alt="Lady Justice Blindfolded Statue in Courtroom"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  display: 'block'
                }}
              />
              <div style={{
                padding: '0.85rem 0.5rem 0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <span style={{ fontWeight: 700, color: '#172033' }}>Lady Justice — Emblem of Judicial Truth</span>
                <span style={{ fontWeight: 700, color: '#C9A45C' }}>• Blindfolded Equality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE HIGHLIGHTS BAR */}
      <section style={{ padding: '1.5rem 3.5rem 3.5rem' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              background: '#F8F7F3',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A45C',
              flexShrink: 0
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#172033', marginBottom: '0.15rem' }}>Secure & Confidential</h4>
              <p style={{ fontSize: '0.78rem', color: '#667085' }}>Your information is protected with top-level security.</p>
            </div>
          </div>

          <div className="card-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              background: '#F8F7F3',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A45C',
              flexShrink: 0
            }}>
              <Users size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#172033', marginBottom: '0.15rem' }}>Expert Lawyers</h4>
              <p style={{ fontSize: '0.78rem', color: '#667085' }}>Access experienced and specialized legal professionals.</p>
            </div>
          </div>

          <div className="card-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              background: '#F8F7F3',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A45C',
              flexShrink: 0
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#172033', marginBottom: '0.15rem' }}>Case Tracking</h4>
              <p style={{ fontSize: '0.78rem', color: '#667085' }}>Track your case status and updates in real time.</p>
            </div>
          </div>

          <div className="card-hover" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              background: '#F8F7F3',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A45C',
              flexShrink: 0
            }}>
              <Headphones size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#172033', marginBottom: '0.15rem' }}>24/7 Support</h4>
              <p style={{ fontSize: '0.78rem', color: '#667085' }}>Our team is available round the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRACTICE AREAS GRID */}
      <section id="services" style={{ padding: '4.5rem 3.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Legal Practice Areas
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#172033', marginTop: '0.3rem', marginBottom: '0.75rem' }}>
            Comprehensive Legal Disciplines
          </h2>
          <p style={{ color: '#667085', fontSize: '0.95rem' }}>
            Authoritative counsel and trial representation across major court jurisdictions.
          </p>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { title: 'Property & Real Estate Law', desc: 'Land title validation, commercial lease agreements, sub-registrar deeds, and boundary litigation.', icon: Building2 },
            { title: 'Corporate & Commercial Law', desc: 'Shareholder agreements, business contract litigation, M&A due diligence, and NCLT tribunal disputes.', icon: Briefcase },
            { title: 'Criminal Defense & Appeals', desc: 'Bail applications, economic offenses defense, FIR quashing, and High Court appellate litigation.', icon: Gavel },
            { title: 'Intellectual Property', desc: 'Patent prosecution, trademark infringement defense, brand protection, and copyright litigation.', icon: Award },
            { title: 'Family & Matrimonial Law', desc: 'Mutual consent divorce petitions, child custody, alimony settlements, and probate succession.', icon: Users },
            { title: 'Civil Litigation & Suits', desc: 'Recovery suits, breach of contract arbitration, injunction petitions, and appellate representation.', icon: Scale }
          ].map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    background: '#0B1628',
                    color: '#C9A45C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#172033', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>{service.title}</h3>
                  <p style={{ color: '#667085', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{service.desc}</p>
                </div>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#0B1628',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  Consult Specialist <ChevronRight size={15} color="#C9A45C" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. OUR LAWYERS SECTION */}
      <section id="lawyers" style={{ padding: '4.5rem 3.5rem', background: '#F8F7F3', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Empaneled Counsel
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#172033', marginTop: '0.3rem', marginBottom: '0.75rem' }}>
            Our Senior Advocates
          </h2>
          <p style={{ color: '#667085', fontSize: '0.95rem' }}>
            Verified advocates allocated based on workload balance and legal specialization.
          </p>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {lawyersList.map((lawyer, idx) => (
            <div key={lawyer._id || idx} className="card-hover" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <img
                    src={lawyer.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'}
                    alt={lawyer.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9A45C' }}
                  />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#172033', marginBottom: '0.15rem' }}>
                      {lawyer.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#667085', display: 'block' }}>
                      {lawyer.specialization || 'Senior Counsel'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                      <Star size={13} color="#C9A45C" fill="#C9A45C" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#172033' }}>
                        {lawyer.experienceYears || 10}+ Years Exp.
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8F7F3', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#667085' }}>Specialization:</span>
                    <strong style={{ color: '#172033' }}>{lawyer.specialization}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#667085' }}>Experience & Track:</span>
                    <span style={{ color: '#0B1628', fontWeight: 600 }}>{lawyer.experience} • {lawyer.casesHandled}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <span>Consult Advocate</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CASE TRACKING & HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{ padding: '4.5rem 3.5rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Live Case Progress
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#172033', marginTop: '0.3rem', marginBottom: '0.75rem' }}>
            Case Tracking & Workflow
          </h2>
          <p style={{ color: '#667085', fontSize: '0.95rem' }}>
            A four-step legal workflow providing real-time litigation tracking and direct lawyer interaction.
          </p>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { step: '01', title: 'Submit Intake', desc: 'Fill out the confidential form and attach preliminary evidence documents.' },
            { step: '02', title: 'Management Allocation', desc: 'Directors inspect requirements and allocate the most qualified advocate.' },
            { step: '03', title: 'Advocate Representation', desc: 'Assigned lawyer audits evidence, files petitions, and represents you in court.' },
            { step: '04', title: 'Real-Time Case Tracking', desc: 'Monitor hearing updates, inspect filing documents, and chat securely.' }
          ].map((item, idx) => (
            <div key={idx} className="card-hover" style={{ padding: '1.75rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#C9A45C',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                {item.step}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: '#172033', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>{item.title}</h3>
              <p style={{ color: '#667085', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Case Tracker CTA Box */}
        <div className="card-hover" style={{
          maxWidth: '800px',
          margin: '3rem auto 0',
          padding: '2rem',
          textAlign: 'center',
          background: '#FAF9F6',
          border: '1px solid #E2E8F0'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#172033', marginBottom: '0.5rem' }}>
            Want to track an existing case?
          </h3>
          <p style={{ color: '#667085', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Log in to your client dashboard to view your case timeline, court hearing dates, and advocate messages.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <FileText size={16} /> Open Case Tracker Dashboard
          </button>
        </div>
      </section>

      {/* 7. ABOUT US & CONTACT SECTION */}
      <section id="about" style={{ padding: '4.5rem 3.5rem', background: '#F8F7F3', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#C9A45C', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              About JusticeHub
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: '#172033', marginTop: '0.3rem', marginBottom: '1rem' }}>
              Institutional Judicial Oversight & Confidential Legal Tech
            </h2>
            <p style={{ color: '#667085', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              JusticeHub bridges the gap between clients seeking trusted legal counsel and verified senior advocates. Managed by an institutional directorate, every case undergoes strict intake review and workload-balanced lawyer assignment.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#172033' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#C9A45C" />
                <span>100% Encrypted Attorney-Client Privilege</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#C9A45C" />
                <span>Empaneled Supreme Court & High Court Counsel</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#C9A45C" />
                <span>Direct Director Audit & Transparent Case Timelines</span>
              </div>
            </div>
          </div>

          <div id="contact" className="card-hover" style={{ padding: '2rem 2.25rem', background: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#172033', marginBottom: '0.5rem' }}>
              Contact Legal Chambers
            </h3>
            <p style={{ color: '#667085', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Have questions regarding case submission or advocate empanelment?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="#C9A45C" />
                <span>Bar Council Chambers, Supreme Court Enclave, New Delhi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="#C9A45C" />
                <span>+91 98765 00000 / 011-23456789</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="#C9A45C" />
                <span>chambers@justicehub.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer style={{ background: '#0B1628', color: '#94A3B8', padding: '3.5rem 3.5rem 1.5rem', fontSize: '0.85rem' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.25fr',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: '#C9A45C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Scale size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
                JusticeHub<span style={{ color: '#C9A45C' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#94A3B8' }}>
              Institutional Legal Case Management Platform connecting clients, advocates, and judicial directors.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => scrollToSection('home')} style={{ color: '#94A3B8', textAlign: 'left', background: 'none', border: 'none' }}>Home</button>
              <button onClick={() => scrollToSection('services')} style={{ color: '#94A3B8', textAlign: 'left', background: 'none', border: 'none' }}>Practice Areas</button>
              <button onClick={() => scrollToSection('lawyers')} style={{ color: '#94A3B8', textAlign: 'left', background: 'none', border: 'none' }}>Our Lawyers</button>
              <button onClick={() => scrollToSection('how-it-works')} style={{ color: '#94A3B8', textAlign: 'left', background: 'none', border: 'none' }}>Case Tracking</button>
              <button onClick={() => navigate('/login')} style={{ color: '#C9A45C', textAlign: 'left', background: 'none', border: 'none', fontWeight: 600 }}>Log In to Workspace</button>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase' }}>Practice Areas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span>Property & Land Law</span>
              <span>Corporate & Commercial</span>
              <span>Criminal Defense</span>
              <span>Intellectual Property</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase' }}>Chambers Office</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={16} color="#C9A45C" />
                <span>Bar Council Chambers, Supreme Court Enclave, New Delhi</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Phone size={16} color="#C9A45C" />
                <span>+91 98765 00000</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', borderTop: '1px solid #1E293B', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem' }}>
          <p>© 2026 JusticeHub Advocates & Legal Consultants. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};
