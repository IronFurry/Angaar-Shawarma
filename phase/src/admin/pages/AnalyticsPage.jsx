import React, { useState, useEffect, useMemo } from 'react';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';
import { getDashboardAnalytics } from '../../api/analyticsApi';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#ff4500', '#ff7a1a']; // UPI & COD Colors only

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = () => {
    getDashboardAnalytics()
      .then(res => {
        if (res?.success && res.data) {
          setAnalyticsData(res.data);
          setError(null);
        } else {
          setError(res?.message || 'Failed to fetch analytics');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'An error occurred while loading analytics');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-update analytics every 5 seconds to get real-time order updates
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Use memoization for calculations and safety checks
  const dashboard = useMemo(() => {
    return analyticsData || {};
  }, [analyticsData]);

  // Loading Skeleton Screen
  if (loading && !analyticsData) {
    return (
      <div className="admin-page">
        <style>{`
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .skeleton-box {
            background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite ease-in-out;
          }
        `}</style>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">Loading business insights...</p>
        </div>

        {/* KPI Cards Skeletons */}
        <div className="admin-kpi-grid admin-mb-24" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-box" style={{ height: '120px', borderRadius: '12px' }} />
          ))}
        </div>

        {/* Charts Skeletons */}
        <div className="admin-grid-2 admin-mb-24">
          <div className="skeleton-box" style={{ height: '300px', borderRadius: '12px' }} />
          <div className="skeleton-box" style={{ height: '300px', borderRadius: '12px' }} />
        </div>
        <div className="admin-grid-2 admin-mb-24">
          <div className="skeleton-box" style={{ height: '300px', borderRadius: '12px' }} />
          <div className="skeleton-box" style={{ height: '300px', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  // API Error Screen
  if (error && !analyticsData) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Analytics</h1>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.2)', padding: '24px', borderRadius: '12px', color: 'var(--admin-danger)', textAlign: 'center', margin: '40px 0' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️ Connection Error</div>
          <p style={{ margin: '0 0 16px 0' }}>{error}</p>
          <button className="admin-btn admin-btn-primary" onClick={() => { setLoading(true); fetchAnalytics(); }}>Retry Connection</button>
        </div>
      </div>
    );
  }

  // Check if there is any data
  const hasOrders = dashboard.todayOrders > 0 || (dashboard.revenueDaily && dashboard.revenueDaily.some(d => d.orders > 0));
  if (!hasOrders) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">🟢 Live business insights</p>
        </div>
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', padding: '40px', borderRadius: '12px', textAlign: 'center', margin: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--admin-text-primary)', marginBottom: '8px' }}>No Data Available</div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Once customers start placing orders, you will see real-time chart trends and revenue details here.</p>
        </div>
      </div>
    );
  }

  const showBranchPerformance = dashboard.branchPerformance && dashboard.branchPerformance.length > 1;
  const maxSold = Math.max(...(dashboard.topItems || []).map(i => i.totalSold), 1);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Analytics</h1>
        <p className="admin-page-subtitle">🟢 Live business insights derived from active order database</p>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid admin-mb-24" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        <KPICard icon="💰" label="Today's Revenue" value={dashboard.todayRevenue} prefix="₹" color="#ff4500" delay={0} />
        <KPICard icon="🛒" label="Today's Orders" value={dashboard.todayOrders} color="#10b981" delay={1} />
        <KPICard icon="📊" label="Average Order Value" value={dashboard.averageOrderValue} prefix="₹" color="#0891b2" delay={2} />
        <KPICard icon="⏳" label="Pending Orders" value={dashboard.pendingOrders} color="#ff7a1a" delay={3} />
      </div>

      {/* Row 1 */}
      <div className="admin-grid-2 admin-mb-24">
        <ChartWrapper title="Revenue Trend (Last 7 Days)" data={dashboard.revenueDaily} type="area" lines={[{ key: 'revenue', label: 'Revenue (₹)' }]} />
        <ChartWrapper title="Orders by Day" data={dashboard.revenueDaily} type="bar" bars={[{ key: 'orders', label: 'Orders' }]} />
      </div>

      {/* Row 2 */}
      <div className="admin-grid-2 admin-mb-24">
        <ChartWrapper title="Peak Ordering Hours" data={dashboard.peakHours} type="bar" xKey="hour" bars={[{ key: 'orders', label: 'Orders' }]} />

        {/* Payment Method Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Payment Method Breakdown (UPI & COD)</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            {dashboard.paymentMethods && dashboard.paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={dashboard.paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {dashboard.paymentMethods.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>No payment data</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 - Branch Revenue Comparison (hide if only one branch) */}
      {showBranchPerformance && (
        <div className="admin-grid-1 admin-mb-24">
          <ChartWrapper title="Branch Revenue Comparison" data={dashboard.branchPerformance} type="bar" xKey="branch" bars={[{ key: 'revenue', label: 'Revenue (₹)' }]} />
        </div>
      )}

      {/* Best Selling */}
      <div className="admin-grid-1">
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">🏆 Top 5 Best Selling Items</div></div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            {dashboard.topItems && dashboard.topItems.length > 0 ? (
              dashboard.topItems.map((item, i) => (
                <div key={item.name} style={{ marginBottom: 16 }}>
                  <div className="admin-flex-between" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-primary)' }}>{item.totalSold.toLocaleString()} sold</span>
                  </div>
                  <div className="admin-progress-bar">
                    <div className="admin-progress-fill" style={{ width: `${(item.totalSold / maxSold) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '20px' }}>No items sold yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
