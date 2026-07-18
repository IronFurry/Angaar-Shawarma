import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUPONS } from '../mockData';

const CouponsPage = ({ toast }) => {
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('angaar_coupons');
      return saved ? JSON.parse(saved) : COUPONS;
    } catch (e) {
      return COUPONS;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    localStorage.setItem('angaar_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const EMPTY = { code: '', type: 'Percentage', discount: '', minOrder: '', maxUses: '', expiry: '', branch: 'All', active: true };

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    toast('Coupon status updated', 'success');
  };

  const deleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast('Coupon deleted', 'success');
  };

  const saveCoupon = () => {
    if (!editing?.code || !editing?.discount) { toast('Code and discount required', 'error'); return; }
    if (editing.id) {
      setCoupons(prev => prev.map(c => c.id === editing.id ? editing : c));
      toast('Coupon updated', 'success');
    } else {
      setCoupons(prev => [...prev, { ...editing, id: `cp${Date.now()}`, used: 0 }]);
      toast('Coupon created!', 'success');
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-flex-between admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupon Management</h1>
          <p className="admin-page-subtitle">Create and manage promotional coupons for all branches.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditing({ ...EMPTY }); setShowModal(true); }}>
          + Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="admin-kpi-grid admin-mb-24" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {[
          { label: 'Total Coupons', value: coupons.length, icon: '🎟️', color: '#7c3aed' },
          { label: 'Active Coupons', value: coupons.filter(c => c.active).length, icon: '✅', color: '#10b981' },
          { label: 'Total Redemptions', value: coupons.reduce((s, c) => s + c.used, 0), icon: '🎯', color: '#ff6b35' },
          { label: 'Expired', value: coupons.filter(c => !c.active).length, icon: '⏰', color: '#6b7280' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="admin-kpi-card" style={{ '--kpi-color': stat.color }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="admin-kpi-icon">{stat.icon}</div>
            <div className="admin-kpi-value">{stat.value}</div>
            <div className="admin-kpi-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Coupon Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Code</th><th>Type</th><th>Discount</th><th>Min Order</th><th>Used/Max</th><th>Expiry</th><th>Branch</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td style={{ fontWeight: 800, color: 'var(--admin-primary)', letterSpacing: 1 }}>{coupon.code}</td>
                  <td>
                    <span className={`admin-badge ${coupon.type === 'Percentage' ? 'admin-badge-primary' : 'admin-badge-purple'}`}>
                      {coupon.type === 'Percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                    </span>
                  </td>
                  <td>{coupon.type === 'Percentage' ? `${coupon.discount}%` : `₹${coupon.discount} off`}</td>
                  <td className="muted">₹{coupon.minOrder || 0}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{coupon.used}</span>
                    <span style={{ color: 'var(--admin-text-muted)' }}>{coupon.maxUses ? `/${coupon.maxUses}` : '/∞'}</span>
                  </td>
                  <td className="muted">{coupon.expiry}</td>
                  <td className="muted">{coupon.branch}</td>
                  <td>
                    <button className={`admin-toggle ${coupon.active ? 'on' : ''}`} onClick={() => toggleActive(coupon.id)} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setEditing({ ...coupon }); setShowModal(true); }}>Edit</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteCoupon(coupon.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="admin-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div className="admin-modal-title">{editing.id ? 'Edit Coupon' : 'Create New Coupon'}</div>
                <button className="admin-side-panel-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Coupon Code *</label>
                  <input className="admin-input" value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER30" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Discount Type</label>
                    <select className="admin-input admin-select" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                      <option>Percentage</option><option>Flat</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Discount Amount *</label>
                    <input className="admin-input" type="number" value={editing.discount} onChange={e => setEditing({ ...editing, discount: e.target.value })} placeholder={editing.type === 'Percentage' ? '20' : '50'} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Minimum Order (₹)</label>
                    <input className="admin-input" type="number" value={editing.minOrder} onChange={e => setEditing({ ...editing, minOrder: e.target.value })} placeholder="0" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Maximum Uses (0 = unlimited)</label>
                    <input className="admin-input" type="number" value={editing.maxUses} onChange={e => setEditing({ ...editing, maxUses: e.target.value })} placeholder="500" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Expiry Date</label>
                    <input className="admin-input" type="date" value={editing.expiry} onChange={e => setEditing({ ...editing, expiry: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Branch</label>
                    <select className="admin-input admin-select" value={editing.branch} onChange={e => setEditing({ ...editing, branch: e.target.value })}>
                      <option>All</option>
                      <option>Vasai Gaon (Main)</option><option>Vasai West (2.0)</option>
                      <option>Nallasopara</option><option>Virar</option>
                    </select>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
                  Active (visible to customers)
                </label>
                <div className="admin-modal-footer">
                  <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="admin-btn admin-btn-primary" onClick={saveCoupon}>
                    {editing.id ? 'Save Changes' : 'Create Coupon'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponsPage;
