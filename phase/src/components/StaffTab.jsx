import React, { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../api/orderApi';
import { API_BASE_URL } from '../api/config';

const STATUS_PIPELINE = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

// SVG Icons replacing emojis
const ClockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FlameIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const BellIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const PinIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LockIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', color: 'var(--primary)' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const TrashIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const HomeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const RefreshIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ListIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const FoodIcon = ({ emoji, size = 18 }) => {
  switch (emoji) {
    case '🌯':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff7a1a', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case '🧀':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffb703', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M14 22V10a2 2 0 0 0-2-2H2" />
          <path d="M20 22V4a2 2 0 0 0-2-2H2" />
          <path d="M2 14h12" />
          <path d="M2 18h16" />
        </svg>
      );
    case '🍽️':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff5400', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
    case '🥗':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70e000', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6" />
        </svg>
      );
    case '🥤':
    case '🍹':
    case '🍉':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#06d6a0', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M18 22H6L4 6h16l-2 16z" />
          <path d="M12 6V1M12 1h4" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const STATUS_META = {
  Pending: { icon: <ClockIcon color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Pending' },
  Confirmed: { icon: <CheckIcon color="#3b82f6" />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Confirmed' },
  Preparing: { icon: <FlameIcon color="#ff7a1a" />, color: '#ff7a1a', bg: 'rgba(255,122,26,0.12)', label: 'Preparing' },
  Ready: { icon: <BellIcon color="#10b981" />, color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Ready' },
  Delivered: { icon: <CheckIcon color="#6b7280" />, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', label: 'Delivered' },
};

const BRANCH_SHORT = {
  'Vasai Gaon Outlet (Main Branch)': 'Vasai Gaon',
  'Vasai West Outlet (Angaar Shawarma 2.0)': 'Vasai West',
  'Nallasopara Outlet': 'Nallasopara',
  'Virar Outlet': 'Virar',
};



const timeAgo = (isoStr) => {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

// ── OrderCard ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, onAdvance, onDelete }) => {
  const meta = STATUS_META[order.status];
  const idx = STATUS_PIPELINE.indexOf(order.status);
  const next = STATUS_PIPELINE[idx + 1];
  const isLast = idx === STATUS_PIPELINE.length - 1;

  return (
    <div className="staff-order-card" style={{ borderColor: meta.color }}>
      {/* Card Header */}
      <div className="soc-header">
        <div className="soc-bill">
          <span className="soc-hash">#</span>{order.billNumber}
        </div>
        <span className="soc-badge" style={{ background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {/* Customer Info */}
      <div className="soc-customer">
        <div className="soc-name">{order.customerName}</div>
        <div className="soc-phone" style={{ display: 'flex', alignItems: 'center' }}><PhoneIcon size={13} /> {order.phone}</div>
      </div>

      {/* Branch + Type */}
      <div className="soc-branch-row">
        <span className="soc-branch-tag" style={{ display: 'flex', alignItems: 'center' }}>
          <PinIcon size={12} /> {BRANCH_SHORT[order.branch] || order.branch}
        </span>
        <span className={`soc-type-tag ${order.orderType === 'Delivery' ? 'delivery' : 'takeaway'}`}>
          {order.orderType === 'Delivery' ? 'Delivery' : 'Takeaway'}
        </span>
      </div>

      {/* Items */}
      <div className="soc-items">
        {order.items.map((item, i) => (
          <div className="soc-item-row" key={i}>
            <span className="soc-item-name" style={{ display: 'flex', alignItems: 'center' }}>
              <FoodIcon emoji={item.emoji} /> {item.name}
            </span>
            <span className="soc-item-qty">×{item.quantity}</span>
            <span className="soc-item-price">₹{item.lineTotal}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="soc-totals">
        {order.deliveryCharge > 0 && (
          <div className="soc-total-row">
            <span>Delivery</span><span>₹{order.deliveryCharge}</span>
          </div>
        )}
        <div className="soc-total-row soc-grand">
          <span>Total</span><span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Address (delivery only) */}
      {order.orderType === 'Delivery' && order.address && (
        <div className="soc-address" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
          <HomeIcon size={12} /> {order.address}
        </div>
      )}

      {/* Timestamp */}
      <div className="soc-time">{timeAgo(order.createdAt)}</div>

      {/* Action Row */}
      <div className="soc-actions">
        {!isLast && (
          <button
            className="soc-btn-advance"
            onClick={() => onAdvance(order._id)}
            style={{ background: `linear-gradient(135deg, ${meta.color}, ${STATUS_META[next]?.color || meta.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            {STATUS_META[next]?.icon} Mark as {next}
          </button>
        )}
        {isLast && (
          <div className="soc-done-label">Order Complete</div>
        )}
        <button className="soc-btn-delete" onClick={() => onDelete(order._id)} title="Remove order">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

// Valid staff hashes for each branch to prevent URL cracking
const VALID_STAFF_HASHES = {
  '#staff-vasaigaon': 'Vasai Gaon Outlet (Main Branch)',
  '#staff-vasaiwest': 'Vasai West Outlet (Angaar Shawarma 2.0)',
  '#staff-nallasopara': 'Nallasopara Outlet',
  '#staff-virar': 'Virar Outlet',
};

// ── StaffTab (main) ─────────────────────────────────────────────────────────
const StaffTab = ({ onExit }) => {
  const currentHash = window.location.hash;
  const isHashValid = Object.keys(VALID_STAFF_HASHES).includes(currentHash);
  const targetBranchName = VALID_STAFF_HASHES[currentHash] || null;

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterBranch, setFilterBranch] = useState(() => {
    return targetBranchName || 'All';
  });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // ── Auth state ──
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(targetBranchName || '');
  const [unlocked, setUnlocked] = useState(() => {
    // Restore session from sessionStorage (clears when tab closes)
    const saved = sessionStorage.getItem('angaar_staff_branch');
    return !!saved && saved === (targetBranchName || saved);
  });
  const [activeBranch, setActiveBranch] = useState(() => {
    return sessionStorage.getItem('angaar_staff_branch') || targetBranchName || '';
  });
  const [staffToken, setStaffToken] = useState(() => {
    return sessionStorage.getItem('angaar_staff_token') || null;
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const BRANCH_OPTIONS = [
    'Vasai Gaon Outlet (Main Branch)',
    'Vasai West Outlet (Angaar Shawarma 2.0)',
    'Nallasopara Outlet',
    'Virar Outlet',
  ];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Customer Support Search state ──
  const [supportQuery, setSupportQuery] = useState('');
  const [supportResult, setSupportResult] = useState(null);

  const handleSupportSearch = () => {
    const q = supportQuery.trim().toLowerCase();
    if (!q) return;
    // Search by bill number (full or partial) or last 4 digits of phone
    const found = orders.find(o => {
      const billMatch = String(o.billNumber || '').toLowerCase().includes(q);
      const phoneMatch = String(o.phone || '').slice(-4) === q;
      return billMatch || phoneMatch;
    });
    setSupportResult(found || 'not_found');
  };

  // Keep branch in sync if hash changes dynamically
  useEffect(() => {
    if (targetBranchName) {
      setFilterBranch(targetBranchName);
      setSelectedBranch(targetBranchName);
    }
  }, [targetBranchName]);


  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const token = staffToken || sessionStorage.getItem('angaar_staff_token');
      const result = await getOrders(token)
      if (result.success) setOrders(result.data)
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  },[staffToken])
  useEffect(() => { refresh() }, [refresh])
  useEffect(() => {
    const id = setInterval(() => {
      refresh(true)
    }, 60000);
    return () => clearInterval(id)
  }, [refresh])
  // ── Status advance ──
  const handleAdvance = async (id) => {
    const order = orders.find(o => o._id === id);
    const nextStatus = STATUS_PIPELINE[STATUS_PIPELINE.indexOf(order.status) + 1];
    const token = staffToken || sessionStorage.getItem('angaar_staff_token');
    const result = await updateOrderStatus(id, nextStatus, token);
    if (result.success) {
      setOrders(prev => prev.map(o => o._id === id ? result.data : o));
    }
  };

  // ── Delete order ──
  const handleDelete = async (id) => {
    const token = staffToken || sessionStorage.getItem('angaar_staff_token');
    const result = await deleteOrder(id, token);
    if (result.success) {
      setOrders(prev => prev.filter(o => o._id !== id));
    }
  };

  const clearDelivered = async () => {
    const token = staffToken || sessionStorage.getItem('angaar_staff_token');
    const delivered = orders.filter(o => o.status === 'Delivered');
    await Promise.all(delivered.map(o => deleteOrder(o._id, token)));
    setOrders(prev => prev.filter(o => o.status !== 'Delivered'));
  };

  // ── Staff API login ──
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBranch) { setAuthError('Please select your branch.'); return; }
    if (!passwordInput)  { setAuthError('Please enter the password.'); return; }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: selectedBranch, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');
      // Save branch + token to sessionStorage so refresh doesn't re-prompt
      sessionStorage.setItem('angaar_staff_branch', selectedBranch);
      sessionStorage.setItem('angaar_staff_token', data.data.token);
      setStaffToken(data.data.token);
      setActiveBranch(selectedBranch);
      setFilterBranch(selectedBranch);
      setUnlocked(true);
    } catch (err) {
      setAuthError(err.message || 'Incorrect password. Try again.');
      setPasswordInput('');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('angaar_staff_branch');
    sessionStorage.removeItem('angaar_staff_token');
    setUnlocked(false);
    setStaffToken(null);
    setPasswordInput('');
    setAuthError('');
  };


  // ── Filtered + sorted orders ──
  const filtered = orders
    .filter((o) => filterStatus === 'All' || o.status === filterStatus)
    .filter((o) => filterBranch === 'All' || o.branch === filterBranch)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const counts = STATUS_PIPELINE.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const branches = [...new Set(orders.map((o) => o.branch))];

  // ── Route Invalid screen ──
  if (!isHashValid) {
    return (
      <section id="staff-dashboard" className="reveal visible" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="staff-pin-card" style={{ maxWidth: '420px' }}>
          <button className="staff-back-site-btn" onClick={onExit}>← Back to Site</button>
          <div className="staff-pin-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ef4444' }}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 className="staff-pin-title" style={{ color: '#ef4444' }}>Invalid Access Link</h2>
          <p className="staff-pin-sub">This staff route is inactive or incorrect. Please use your branch-specific staff link (e.g. #staff-vasaigaon) to manage orders.</p>
        </div>
      </section>
    );
  }

  // ── Login Screen ─────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <section id="staff-dashboard" className="reveal visible">
        <div className="staff-pin-screen">
          <div className="staff-pin-card">
            <button className="staff-back-site-btn" onClick={onExit}>← Back to Site</button>
            <div className="staff-pin-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <LockIcon />
            </div>
            <h2 className="staff-pin-title">Staff Access</h2>
            <p className="staff-pin-sub">Select your branch and enter the staff password.</p>
            <form onSubmit={handleLoginSubmit} className="staff-pin-form">
              <select
                value={selectedBranch}
                onChange={e => {
                  const newBranch = e.target.value;
                  setSelectedBranch(newBranch);
                  setAuthError('');
                  const HASH_BY_BRANCH = {
                    'Vasai Gaon Outlet (Main Branch)': '#staff-vasaigaon',
                    'Vasai West Outlet (Angaar Shawarma 2.0)': '#staff-vasaiwest',
                    'Nallasopara Outlet': '#staff-nallasopara',
                    'Virar Outlet': '#staff-virar',
                  };
                  const newHash = HASH_BY_BRANCH[newBranch];
                  if (newHash) {
                    window.location.hash = newHash;
                  }
                }}
                className="staff-branch-select"
              >
                <option value="">— Select your branch —</option>
                {BRANCH_OPTIONS.map(b => (
                  <option key={b} value={b}>{BRANCH_SHORT[b] || b}</option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Enter staff password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setAuthError(''); }}
                className={`staff-pin-input ${authError ? 'error' : ''}`}
                autoFocus
                disabled={authLoading}
              />
              {authError && <p className="staff-pin-error">{authError}</p>}
              <button type="submit" className="staff-pin-btn" disabled={authLoading}>
                {authLoading ? 'Verifying…' : 'Unlock Dashboard →'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // ── Main Dashboard ────────────────────────────────────────────────────────
  return (
    <section id="staff-dashboard" className="reveal visible">
      {/* Header */}
      <div className="staff-header">
        <div>
          <div className="section-eyebrow">Staff Panel</div>
          <h2 className="section-title">Order Management</h2>
          <p className="section-sub">Managing live orders for: <strong>{BRANCH_SHORT[activeBranch] || activeBranch}</strong></p>
        </div>
        <div className="staff-header-actions">
          <button className="staff-refresh-btn" onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <RefreshIcon /> Refresh
          </button>
          <button className="staff-lock-btn" onClick={handleLock} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <LockIcon size={14} /> Lock
          </button>
          <button className="staff-back-site-btn inline" onClick={onExit}>
            ← Site
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="staff-stats-bar">
        {STATUS_PIPELINE.map((s) => (
          <div
            key={s}
            className={`staff-stat-chip ${filterStatus === s ? 'active' : ''}`}
            style={{ '--chip-color': STATUS_META[s].color }}
            onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}
          >
            <span className="stat-emoji">{STATUS_META[s].icon}</span>
            <span className="stat-label">{s}</span>
            <span className="stat-count">{counts[s]}</span>
          </div>
        ))}
        <div
          className={`staff-stat-chip all-chip ${filterStatus === 'All' ? 'active' : ''}`}
          onClick={() => setFilterStatus('All')}
        >
          <span className="stat-emoji"><ListIcon /></span>
          <span className="stat-label">All</span>
          <span className="stat-count">{orders.length}</span>
        </div>
      </div>

      {/* ── Customer Support Search (Privacy-Safe Lookup) ── */}
      <div style={{
        background: 'rgba(8,145,178,0.06)',
        border: '1px solid rgba(8,145,178,0.18)',
        borderRadius: 14,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#38bdf8', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🛠️ Customer Support Search <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 4 }}>(Privacy-Safe Lookup)</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Bill # or last 4 digits of phone…"
            value={supportQuery}
            onChange={e => { setSupportQuery(e.target.value); setSupportResult(null); }}
            onKeyDown={e => e.key === 'Enter' && handleSupportSearch()}
            style={{
              flex: 1, minWidth: 200,
              padding: '0.55rem 0.85rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(8,145,178,0.3)',
              borderRadius: 8, color: 'var(--text)',
              fontSize: '0.85rem', outline: 'none',
            }}
          />
          <button
            onClick={handleSupportSearch}
            style={{
              padding: '0.55rem 1.1rem',
              background: 'rgba(8,145,178,0.18)',
              border: '1px solid rgba(8,145,178,0.35)',
              borderRadius: 8, color: '#38bdf8',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Search
          </button>
        </div>
        {supportResult === 'not_found' && (
          <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.5rem' }}>No order found for that bill number or phone suffix.</p>
        )}
        {supportResult && supportResult !== 'not_found' && (
          <div style={{ marginTop: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>#{supportResult.billNumber} — {supportResult.customerName}</div>
            <div style={{ color: 'var(--muted)', marginBottom: 2 }}>Branch: {BRANCH_SHORT[supportResult.branch] || supportResult.branch} · {supportResult.orderType}</div>
            <div style={{ color: 'var(--muted)', marginBottom: 2 }}>Items: {supportResult.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</div>
            <div style={{ color: 'var(--muted)', marginBottom: 4 }}>Total: ₹{supportResult.totalAmount} · Phone: ••••{String(supportResult.phone || '').slice(-4)}</div>
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: 999,
              background: STATUS_META[supportResult.status]?.bg || 'rgba(255,255,255,0.1)',
              color: STATUS_META[supportResult.status]?.color || '#fff',
              fontSize: '0.75rem', fontWeight: 700,
            }}>{supportResult.status}</span>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="staff-controls">
        <div className="staff-meta-info" style={{ marginLeft: 'auto' }}>
          <span>Last refreshed: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          {counts.Delivered > 0 && (
            <button className="staff-clear-delivered-btn" onClick={clearDelivered}>
              Clear Delivered ({counts.Delivered})
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="staff-empty">
          <div className="staff-empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
            <ListIcon size={48} />
          </div>
          <h3>No orders {filterStatus !== 'All' ? `with status "${filterStatus}"` : 'yet'}</h3>
          <p>New orders placed by customers will appear here automatically.</p>
        </div>
      ) : (
        <div className="staff-cards-grid">
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onAdvance={handleAdvance}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StaffTab;
