import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BRANCHES, BRANCH_PERFORMANCE, USE_LIVE_DATA } from '../mockData';
import { getOrders } from '../../api/orderApi';
import ChartWrapper from '../components/ChartWrapper';

const BranchesPage = () => {
  const [liveOrders, setLiveOrders] = useState(null);

  useEffect(() => {
    if (!USE_LIVE_DATA) return;
    getOrders()
      .then(res => {
        if (res?.success && res.data) {
          setLiveOrders(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const branchPerfData = (() => {
    if (USE_LIVE_DATA && liveOrders) {
      // Aggregate real orders per branch
      return BRANCH_PERFORMANCE.map(bp => {
        const matchingOrders = liveOrders.filter(o => {
          const orderBranch = (o.branch || '').toLowerCase();
          const bpShort = bp.branch.toLowerCase();
          return orderBranch.includes(bpShort) || bpShort.includes(orderBranch);
        });

        const totalRevenue = matchingOrders.reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0);
        return {
          ...bp,
          revenue: totalRevenue,
          orders: matchingOrders.length,
        };
      });
    }
    return BRANCH_PERFORMANCE;
  })();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Branch Management</h1>
        <p className="admin-page-subtitle">
          {USE_LIVE_DATA && liveOrders
            ? '🟢 Live performance metrics from order database'
            : 'Monitor performance and compare all Angaar Shawarma locations.'}
        </p>
      </div>

      {/* Branch Cards */}
      <div className="admin-grid-2 admin-mb-24">
        {BRANCHES.map((branch, i) => {
          const perf = branchPerfData.find(b => b.branch === branch.short) || {};
          return (
            <motion.div
              key={branch.id}
              className="admin-branch-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
            >
              <div className="admin-branch-accent" style={{ background: `linear-gradient(90deg, ${branch.color}, transparent)` }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--admin-text-primary)', marginBottom: 2 }}>{branch.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--admin-text-muted)' }}>📍 {branch.address}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>⭐ {branch.rating}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Revenue', value: `₹${((perf.revenue || 0) / 1000).toFixed(1)}K`, color: branch.color },
                  { label: 'Orders', value: (perf.orders || 0).toLocaleString('en-IN'), color: '#10b981' },
                  { label: 'Avg Prep', value: `${perf.avgPrepTime || 0}m`, color: '#f59e0b' },
                  { label: 'Staff', value: perf.employees || 0, color: '#7c3aed' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--admin-input-bg)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ fontSize: 12.5, color: 'var(--admin-text-muted)' }}>👨‍💼 {branch.manager}</div>
                <div style={{ fontSize: 12.5, color: 'var(--admin-text-muted)' }}>📞 {branch.phone}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Branch Comparison Charts */}
      <div className="admin-grid-2">
        <ChartWrapper
          title="Revenue by Branch"
          data={branchPerfData}
          type="bar"
          xKey="branch"
          bars={[{ key: 'revenue', label: 'Revenue (₹)' }]}
        />
        <ChartWrapper
          title="Orders by Branch"
          data={branchPerfData}
          type="bar"
          xKey="branch"
          bars={[{ key: 'orders', label: 'Orders' }]}
        />
      </div>
    </div>
  );
};

export default BranchesPage;
