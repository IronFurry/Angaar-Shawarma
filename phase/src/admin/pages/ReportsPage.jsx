import React from 'react';
import { motion } from 'framer-motion';

const REPORTS = [
  { id: 1, name: 'Daily Sales Report', icon: '📅', desc: 'Orders, revenue, and payment breakdown for today', period: 'Today', color: '#ff6b35' },
  { id: 2, name: 'Weekly Report', icon: '📆', desc: 'Complete weekly performance summary with trends', period: 'This Week', color: '#7c3aed' },
  { id: 3, name: 'Monthly Report', icon: '🗓️', desc: 'Full monthly analytics with branch comparison', period: 'This Month', color: '#0891b2' },
  { id: 4, name: 'Revenue Report', icon: '💰', desc: 'Detailed revenue breakdown by branch, item, and payment method', period: 'Custom', color: '#10b981' },
  { id: 5, name: 'Customer Report', icon: '👥', desc: 'Customer acquisition, retention, and LTV analysis', period: 'Custom', color: '#e94560' },
  { id: 6, name: 'Inventory Report', icon: '📦', desc: 'Stock levels, consumption rates, and restock history', period: 'Current', color: '#f59e0b' },
];

const ReportsPage = ({ toast }) => {
  const handleExport = (report, format) => {
    toast(`📄 Generating ${report.name} (${format})...`, 'info');
    setTimeout(() => toast(`✅ ${report.name} downloaded!`, 'success'), 1500);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reports</h1>
        <p className="admin-page-subtitle">Generate and export comprehensive reports in multiple formats.</p>
      </div>

      {/* Quick Stats */}
      <div className="admin-card admin-mb-24">
        <div className="admin-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
            {[
              { label: 'Reports Generated', value: '247', icon: '📋', sub: 'This Month' },
              { label: 'Last Export', value: 'Today', icon: '📤', sub: '2:30 PM' },
              { label: 'Scheduled Reports', value: '3', icon: '⏰', sub: 'Auto-send' },
              { label: 'Formats', value: '2', icon: '📎', sub: 'PDF & Excel' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--admin-text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.id}
            className="admin-report-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            style={{ borderLeft: `4px solid ${report.color}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>{report.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{report.name}</div>
                <span className="admin-badge admin-badge-primary" style={{ marginTop: 4 }}>{report.period}</span>
              </div>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--admin-text-secondary)', lineHeight: 1.55, margin: 0 }}>{report.desc}</p>

            {/* Date Range (for custom) */}
            {report.period === 'Custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">From</label>
                  <input type="date" className="admin-input" style={{ padding: '7px 10px', fontSize: 12 }} />
                </div>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">To</label>
                  <input type="date" className="admin-input" style={{ padding: '7px 10px', fontSize: 12 }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="admin-btn admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleExport(report, 'PDF')}
              >
                📄 Export PDF
              </button>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleExport(report, 'Excel')}
              >
                📊 Export Excel
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>⏰ Scheduled Reports</div>
        <div className="admin-card">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Report</th><th>Frequency</th><th>Next Run</th><th>Recipients</th><th>Format</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { name: 'Daily Sales', freq: 'Daily at 11 PM', next: 'Tonight 11:00 PM', recipients: 'admin@angaar.com', format: 'PDF', active: true },
                  { name: 'Weekly Performance', freq: 'Sunday 9 AM', next: 'Sun Jul 5, 9:00 AM', recipients: 'team@angaar.com', format: 'Excel', active: true },
                  { name: 'Monthly Revenue', freq: 'Last day of month', next: 'Jul 31, 11:59 PM', recipients: 'owner@angaar.com', format: 'PDF', active: false },
                ].map((rep, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{rep.name}</td>
                    <td className="muted">{rep.freq}</td>
                    <td className="muted">{rep.next}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{rep.recipients}</td>
                    <td><span className="admin-badge admin-badge-info">{rep.format}</span></td>
                    <td>
                      <button className={`admin-toggle ${rep.active ? 'on' : ''}`} onClick={() => toast('Schedule updated', 'success')} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
