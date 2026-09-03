import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, PieChart, TrendingUp, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Generating Legal Analytics...</div>;
  }

  const { metrics, categoryStats, statusStats } = analytics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#172033' }}>JusticeHub Executive Legal Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Case volume distribution by category, litigation progression metrics, and advocate network utilization.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          <Download size={16} /> Export Management Summary Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Case Resolution Rate</span>
          <h3 style={{ fontSize: '1.8rem', color: '#059669', marginTop: '0.2rem' }}>
            {metrics.totalCases > 0 ? Math.round((metrics.completedCases / metrics.totalCases) * 100) : 0}%
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{metrics.completedCases} Resolved out of {metrics.totalCases} Filed</p>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Average Advocate Utilization</span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--gold-dark)', marginTop: '0.2rem' }}>
            {metrics.totalLawyers > 0 ? (metrics.activeCases / metrics.totalLawyers).toFixed(1) : 0} Cases / Lawyer
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{metrics.activeCases} Active Matters Across {metrics.totalLawyers} Lawyers</p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Category Breakdown */}
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={20} color="var(--gold-accent)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)' }}>Case Distribution by Legal Practice Area</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoryStats.map((item) => {
              const percentage = Math.round((item.count / metrics.totalCases) * 100) || 0;
              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--navy-dark)' }}>{item._id}</span>
                    <span style={{ color: 'var(--gold-dark)' }}>{item.count} Cases ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-dark))', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={20} color="var(--navy-dark)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)' }}>Litigation Stage Progression Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {statusStats.map((item) => {
              const percentage = Math.round((item.count / metrics.totalCases) * 100) || 0;
              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--navy-dark)' }}>{item._id}</span>
                    <span style={{ color: 'var(--navy-dark)' }}>{item.count} Cases ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--navy-dark)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
