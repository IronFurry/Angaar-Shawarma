import React, { useState, useEffect, useCallback } from 'react';
import { getActiveOrders } from '../api/orderApi';

// ── Status meta ───────────────────────────────────────────────────────────────
const STATUS_META = {
  Pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Order Received', dot: '#f59e0b' },
  Confirmed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  label: 'Confirmed',      dot: '#3b82f6' },
  Preparing: { color: '#ff7a1a', bg: 'rgba(255,122,26,0.12)',  label: 'Being Prepared', dot: '#ff7a1a' },
  Ready:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Ready',          dot: '#10b981' },
};

const STATUS_PIPELINE = ['Pending', 'Confirmed', 'Preparing', 'Ready'];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ActivityIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ClockIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const FlameIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const CheckIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BellIcon = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const RefreshIcon = ({ size = 14, spinning }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', animation: spinning ? 'ao-spin 1s linear infinite' : 'none' }}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const PinIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

// Maps each status to its icon component
const StatusIcon = ({ status, size = 13 }) => {
  const color = STATUS_META[status]?.color || 'currentColor';
  switch (status) {
    case 'Pending':   return <ClockIcon size={size} color={color} />;
    case 'Confirmed': return <CheckIcon size={size} color={color} />;
    case 'Preparing': return <FlameIcon size={size} color={color} />;
    case 'Ready':     return <BellIcon  size={size} color={color} />;
    default:          return null;
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const BRANCH_SHORT = {
  'Vasai Gaon Outlet (Main Branch)':         'Vasai Gaon',
  'Vasai West Outlet (Angaar Shawarma 2.0)': 'Vasai West',
  'Nallasopara Outlet':                       'Nallasopara',
  'Virar Outlet':                             'Virar',
};

const timeAgo = (isoStr) => {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

// ── Order Card ────────────────────────────────────────────────────────────────
const ActiveOrderCard = ({ order }) => {
  const meta    = STATUS_META[order.status] || STATUS_META['Pending'];
  const pipeIdx = STATUS_PIPELINE.indexOf(order.status);

  return (
    <div className="ao-card" style={{ '--ao-status-color': meta.color }}>
      {/* Glowing left accent */}
      <div className="ao-card-accent" />

      {/* Header row */}
      <div className="ao-card-header">
        <div className="ao-card-bill">
          <span className="ao-bill-hash">#</span>
          {order.billNumber}
        </div>
        <span
          className="ao-status-badge"
          style={{ background: meta.bg, color: meta.color }}
        >
          <StatusIcon status={order.status} />
          &nbsp;{meta.label}
        </span>
      </div>

      {/* Progress stepper */}
      <div className="ao-stepper">
        {STATUS_PIPELINE.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`ao-step-dot ${i <= pipeIdx ? 'done' : ''} ${i === pipeIdx ? 'current' : ''}`}
              style={i <= pipeIdx ? { background: STATUS_META[s].color, boxShadow: `0 0 8px ${STATUS_META[s].color}80` } : {}}
              title={s}
            />
            {i < STATUS_PIPELINE.length - 1 && (
              <div className={`ao-step-line ${i < pipeIdx ? 'done' : ''}`}
                style={i < pipeIdx ? { background: `linear-gradient(90deg, ${STATUS_META[s].color}, ${STATUS_META[STATUS_PIPELINE[i+1]].color})` } : {}}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="ao-stepper-labels">
        {STATUS_PIPELINE.map((s) => (
          <span key={s} className={`ao-step-label ${s === order.status ? 'active' : ''}`}
            style={s === order.status ? { color: STATUS_META[s].color } : {}}>
            {s}
          </span>
        ))}
      </div>

      {/* Items summary */}
      <div className="ao-items">
        {order.items.slice(0, 3).map((item, i) => (
          <span key={i} className="ao-item-chip">
            {item.name}&nbsp;<span className="ao-item-qty">×{item.quantity}</span>
          </span>
        ))}
        {order.items.length > 3 && (
          <span className="ao-item-chip ao-item-more">+{order.items.length - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="ao-card-footer">
        <span className="ao-branch-tag">
          <PinIcon />
          {BRANCH_SHORT[order.branch] || order.branch}
        </span>
        <span className={`ao-type-badge ${order.orderType === 'Delivery' ? 'delivery' : 'takeaway'}`}>
          {order.orderType}
        </span>
        <span className="ao-time-ago">{timeAgo(order.createdAt)}</span>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ActiveOrders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const result = await getActiveOrders();
      if (result.success) {
        setOrders(result.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError('Could not load active orders.');
      }
    } catch {
      setError('Server is offline or unreachable.');
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 600);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Auto-refresh every 10 s
  useEffect(() => {
    const id = setInterval(() => fetchOrders(), 10000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const totalItems = orders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <section id="active-orders">
      {/* Section header */}
      <div className="reveal">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ActivityIcon size={14} /> Live Kitchen Queue
        </div>
        <h2 className="section-title">Active<br />Orders</h2>
        <p className="section-sub">
          Real-time view of every order currently being handled by our kitchen — from placed to ready.
        </p>
      </div>

      {/* Stats + refresh bar */}
      <div className="ao-control-bar reveal">
        <div className="ao-stats">
          {STATUS_PIPELINE.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            const meta  = STATUS_META[s];
            return (
              <div key={s} className="ao-stat-chip" style={{ '--chip-color': meta.color }}>
                <span className="ao-stat-icon"><StatusIcon status={s} size={12} /></span>
                <span className="ao-stat-label">{s}</span>
                <span className="ao-stat-count">{count}</span>
              </div>
            );
          })}
          <div className="ao-stat-chip ao-stat-total">
            <span className="ao-stat-label">Total items</span>
            <span className="ao-stat-count">{totalItems}</span>
          </div>
        </div>

        <div className="ao-refresh-group">
          {lastUpdated && (
            <span className="ao-last-updated">
              Updated {timeAgo(lastUpdated.toISOString())}
            </span>
          )}
          <button
            className="ao-refresh-btn"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            title="Refresh now"
          >
            <RefreshIcon size={14} spinning={refreshing} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="ao-loading reveal">
          <div className="ao-loading-dots">
            <span /><span /><span />
          </div>
          <p>Fetching live orders…</p>
        </div>
      ) : error ? (
        <div className="ao-error reveal">
          <p>{error}</p>
          <button className="ao-refresh-btn" onClick={() => fetchOrders(true)}>Try Again</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="ao-empty reveal">
          <div className="ao-empty-icon">
            <ActivityIcon size={42} />
          </div>
          <h3>Kitchen is quiet right now</h3>
          <p>No active orders at the moment. New orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="ao-grid reveal">
          {orders.map((order) => (
            <ActiveOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveOrders;
