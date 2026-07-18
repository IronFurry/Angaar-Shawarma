import React from 'react';
import { motion } from 'framer-motion';
import { INVENTORY } from '../mockData';

const InventoryPage = ({ toast }) => {
  const lowStock = INVENTORY.filter(i => i.currentStock <= i.minStock);
  const healthy = INVENTORY.filter(i => i.currentStock > i.minStock);

  const getStockPercent = (item) => Math.min(100, (item.currentStock / (item.minStock * 3)) * 100);
  const getStockColor = (item) => {
    const pct = getStockPercent(item);
    if (pct < 30) return '#ef4444';
    if (pct < 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="admin-page">
      <div className="admin-flex-between admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory Management</h1>
          <p className="admin-page-subtitle">Monitor ingredient stock levels and get low-stock alerts.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => toast('Restock order placed!', 'success')}>
          🛒 Order Restock
        </button>
      </div>

      {/* Stats */}
      <div className="admin-kpi-grid admin-mb-24" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {[
          { icon: '📦', label: 'Total Ingredients', value: INVENTORY.length, color: '#7c3aed' },
          { icon: '✅', label: 'Healthy Stock', value: healthy.length, color: '#10b981' },
          { icon: '⚠️', label: 'Low Stock Alert', value: lowStock.length, color: '#f59e0b' },
          { icon: '🚨', label: 'Critical Stock', value: INVENTORY.filter(i => i.daysRemaining <= 1).length, color: '#ef4444' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="admin-kpi-card" style={{ '--kpi-color': stat.color }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="admin-kpi-icon">{stat.icon}</div>
            <div className="admin-kpi-value">{stat.value}</div>
            <div className="admin-kpi-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Warning */}
      {lowStock.length > 0 && (
        <motion.div
          className="admin-card admin-mb-24"
          style={{ border: '1px solid var(--admin-warning)', background: 'var(--admin-warning-soft)' }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        >
          <div className="admin-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--admin-warning)' }}>Low Stock Alert — {lowStock.length} items need restocking</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {lowStock.map(item => (
                <span key={item.id} className="admin-badge admin-badge-warning">{item.ingredient}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Inventory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {INVENTORY.map((item, i) => {
          const stockPct = getStockPercent(item);
          const stockColor = getStockColor(item);
          const isLow = item.currentStock <= item.minStock;

          return (
            <motion.div
              key={item.id}
              className={`admin-inventory-card ${isLow ? 'low' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.ingredient}</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{item.category}</div>
                </div>
                {isLow ? (
                  <span className="admin-badge admin-badge-danger">⚠️ Low</span>
                ) : (
                  <span className="admin-badge admin-badge-success">✓ OK</span>
                )}
              </div>

              {/* Stock Progress */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: stockColor }}>{item.currentStock}</span>
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', alignSelf: 'flex-end', marginBottom: 4 }}>{item.unit}</span>
                </div>
                <div className="admin-progress-bar">
                  <motion.div
                    className="admin-progress-fill"
                    style={{ background: stockColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--admin-text-muted)' }}>
                  <span>Min: {item.minStock} {item.unit}</span>
                  <span style={{ color: item.daysRemaining <= 2 ? '#ef4444' : 'var(--admin-text-muted)' }}>~{item.daysRemaining} days left</span>
                </div>
              </div>

              <div className="admin-divider" />

              <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>🏭 {item.supplier}</div>
                <div>🔄 Last restocked: {item.lastRestocked}</div>
              </div>

              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                onClick={() => toast(`Restock request sent for ${item.ingredient}`, 'success')}
              >
                🛒 Request Restock
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryPage;
