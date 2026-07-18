import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDERS, USE_LIVE_DATA } from '../mockData';
import { getOrders, updateOrderStatus } from '../../api/orderApi';

const STATUS_CONFIG = {
  Pending: { color: '#f59e0b', bg: 'admin-badge-warning', dot: '🟡' },
  Preparing: { color: '#ff6b35', bg: 'admin-badge-primary', dot: '🟠' },
  Ready: { color: '#0891b2', bg: 'admin-badge-info', dot: '🔵' },
  'Out for Delivery': { color: '#7c3aed', bg: 'admin-badge-purple', dot: '🟣' },
  Delivered: { color: '#10b981', bg: 'admin-badge-success', dot: '🟢' },
  Cancelled: { color: '#ef4444', bg: 'admin-badge-danger', dot: '🔴' },
};

const ALL_STATUSES = ['All', 'Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

const adaptOrder = (o) => ({
  id: o._id || o.id,
  orderId: o.billNumber || o.orderId,
  customer: o.customerName || o.customer,
  phone: o.phone,
  branch: o.branch,
  items: (o.items || []).map(item => ({
    name: item.name,
    qty: item.quantity !== undefined ? item.quantity : item.qty,
    price: item.price,
    emoji: item.emoji || ''
  })),
  amount: o.totalAmount || o.amount,
  paymentStatus: o.paymentStatus || 'Paid',
  paymentMethod: o.paymentMethod || 'UPI',
  orderStatus: o.status || o.orderStatus,
  address: o.address,
  time: o.createdAt || o.time,
  specialInstructions: o.specialInstructions || '',
  timeline: o.timeline || [
    { status: 'Placed', time: new Date(o.createdAt || o.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
  ]
});

const OrdersPage = ({ toast }) => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(() => {
    // Pre-fill from TopBar global search
    const q = sessionStorage.getItem('angaar_admin_search') || '';
    if (q) sessionStorage.removeItem('angaar_admin_search');
    return q;
  });
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    if (!USE_LIVE_DATA) {
      setOrders(ORDERS.map(adaptOrder));
      return;
    }
    try {
      const res = await getOrders();
      if (res.success && res.data) {
        setOrders(res.data.map(adaptOrder));
      } else {
        setOrders(ORDERS.map(adaptOrder));
      }
    } catch (e) {
      console.warn('Failed fetching from server, falling back to mock orders:', e);
      setOrders(ORDERS.map(adaptOrder));
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || [o.orderId, o.customer, o.phone, o.branch].some(v => (v || '').toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || o.orderStatus === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (id, status) => {
    try {
      const res = await updateOrderStatus(id, status);
      if (res.success) {
        toast(`Order status updated to ${status}`, 'success');
        fetchOrders();
      } else {
        // Fallback local update if not in DB
        setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
        toast(`Order status updated to ${status} (Local only)`, 'success');
      }
    } catch (e) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
      toast(`Order status updated to ${status} (Local only)`, 'success');
    }
    setSelected(prev => prev && prev.id === id ? { ...prev, orderStatus: status } : prev);
  };

  const NEXT_STATUS = { Pending: 'Preparing', Preparing: 'Ready', Ready: 'Out for Delivery', 'Out for Delivery': 'Delivered' };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders Management</h1>
        <p className="admin-page-subtitle">Track and manage all customer orders across all branches.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="admin-filter-tabs admin-mb-16">
        {ALL_STATUSES.map(s => {
          const count = s === 'All' ? orders.length : orders.filter(o => o.orderStatus === s).length;
          return (
            <button
              key={s}
              className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_CONFIG[s]?.dot} {s} {count > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="admin-toolbar admin-mb-16">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, color: 'var(--admin-text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search by order ID, customer, branch..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>{filtered.length} orders</span>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Phone</th><th>Branch</th>
                <th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} onClick={() => setSelected(o)}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{o.orderId}</td>
                  <td style={{ fontWeight: 600 }}>{o.customer}</td>
                  <td className="muted">{o.phone}</td>
                  <td className="muted">{o.branch}</td>
                  <td className="muted">{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 700 }}>₹{o.amount}</td>
                  <td>
                    <span className={`admin-badge ${o.paymentStatus === 'Paid' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${STATUS_CONFIG[o.orderStatus]?.bg || 'admin-badge-gray'}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="muted">{new Date(o.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="admin-side-panel-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="admin-side-panel"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="admin-side-panel-header">
                <div>
                  <div className="admin-side-panel-title">{selected.orderId}</div>
                  <span className={`admin-badge ${STATUS_CONFIG[selected.orderStatus]?.bg || 'admin-badge-gray'}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                    {selected.orderStatus}
                  </span>
                </div>
                <button className="admin-side-panel-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="admin-side-panel-body">
                {/* Customer Info */}
                <div style={{ background: 'var(--admin-primary-soft)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--admin-primary)', marginBottom: 4 }}>{selected.customer}</div>
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>📞 {selected.phone}</div>
                  {selected.address && <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 4 }}>📍 {selected.address}</div>}
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 4 }}>🏪 {selected.branch}</div>
                  <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 4 }}>💳 {selected.paymentMethod} · {selected.paymentStatus}</div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--admin-text-primary)' }}>Ordered Items</div>
                  {selected.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>×{item.qty} @ ₹{item.price}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>₹{item.qty * item.price}</div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 800, fontSize: 16 }}>
                    <span>Total</span><span style={{ color: 'var(--admin-primary)' }}>₹{selected.amount}</span>
                  </div>
                </div>

                {/* Special Instructions */}
                {selected.specialInstructions && (
                  <div style={{ background: 'var(--admin-warning-soft)', borderRadius: 10, padding: 12, marginBottom: 20, border: '1px solid var(--admin-warning)' }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--admin-warning)', marginBottom: 4 }}>⚠️ SPECIAL INSTRUCTIONS</div>
                    <div style={{ fontSize: 13 }}>{selected.specialInstructions}</div>
                  </div>
                )}

                {/* Timeline */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Order Timeline</div>
                  <div className="admin-timeline">
                    {selected.timeline.map((t, i) => (
                      <div key={i} className="admin-timeline-item">
                        <div className="admin-timeline-dot" style={{ background: i === selected.timeline.length - 1 ? 'var(--admin-primary)' : 'var(--admin-success)' }} />
                        <div className="admin-timeline-content">
                          <div className="admin-timeline-label">{t.status}</div>
                          <div className="admin-timeline-time">{t.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Actions */}
                {NEXT_STATUS[selected.orderStatus] && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Update Status</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(NEXT_STATUS).map(([from, to]) => (
                        selected.orderStatus === from && (
                          <button
                            key={to}
                            className="admin-btn admin-btn-primary"
                            onClick={() => updateStatus(selected.id, to)}
                          >
                            Mark as {to}
                          </button>
                        )
                      ))}
                      {selected.orderStatus !== 'Cancelled' && selected.orderStatus !== 'Delivered' && (
                        <button className="admin-btn admin-btn-danger" onClick={() => updateStatus(selected.id, 'Cancelled')}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
