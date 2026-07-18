import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="admin-chart-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 6, color: '#fff' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontSize: 12 }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value >= 1000
            ? `₹${entry.value.toLocaleString('en-IN')}`
            : entry.value}
        </div>
      ))}
    </div>
  );
};

const PERIODS = ['Daily', 'Weekly', 'Monthly'];

const ChartWrapper = ({ title, data, type = 'area', lines = [], bars = [], xKey = 'label', showToggle = false, onPeriodChange }) => {
  const [period, setPeriod] = useState('Daily');

  const handlePeriod = (p) => {
    setPeriod(p);
    onPeriodChange && onPeriodChange(p);
  };

  const CHART_COLORS = ['#ff6b35', '#e94560', '#7c3aed', '#10b981', '#0891b2'];

  return (
    <div className="admin-card" style={{ height: '100%' }}>
      <div className="admin-card-header">
        <div className="admin-card-title">{title}</div>
        {showToggle && (
          <div className="admin-chart-toggle">
            {PERIODS.map((p) => (
              <button
                key={p}
                className={`admin-chart-toggle-btn ${period === p ? 'active' : ''}`}
                onClick={() => handlePeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="admin-card-body" style={{ paddingTop: 8 }}>
        <ResponsiveContainer width="100%" height={260}>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {bars.map((b, i) => (
                <Bar key={b.key} dataKey={b.key} name={b.label} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              {lines.map((l, i) => (
                <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} dot={false} />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                {lines.map((l, i) => (
                  <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              {lines.map((l, i) => (
                <Area key={l.key} type="monotone" dataKey={l.key} name={l.label}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5}
                  fill={`url(#grad-${l.key})`} dot={false} />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWrapper;
