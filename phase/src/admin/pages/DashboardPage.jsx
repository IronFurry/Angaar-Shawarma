import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import KPICard from '../components/KPICard';
import ChartWrapper from '../components/ChartWrapper';
import {
  USE_LIVE_DATA,
  KPI_DATA, REVENUE_DAILY, REVENUE_WEEKLY, REVENUE_MONTHLY,
  PEAK_HOURS, ORDERS as MOCK_ORDERS, REVIEWS as MOCK_REVIEWS, BRANCH_PERFORMANCE,
} from '../mockData';
import { getOrders, getBestsellers } from '../../api/orderApi';
import { getReviews } from '../../api/reviewsApi';
import { menuData } from '../../utils/menuData';

const STATUS_BADGE = {
  Delivered: 'admin-badge-success', Pending: 'admin-badge-warning',
  Preparing: 'admin-badge-primary', Confirmed: 'admin-badge-primary',
  Ready: 'admin-badge-info', 'Out for Delivery': 'admin-badge-purple', Cancelled: 'admin-badge-danger',
};

const FLAT_MENU = Object.entries(menuData).flatMap(([, items]) => items);

const isTodayLocal = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

const DashboardPage = ({ onNavigate }) => {
  const [period, setPeriod] = useState('Daily');
  const [liveOrders, setLiveOrders] = useState(null);
  const [liveReviews, setLiveReviews] = useState(null);
  const [liveBestsellers, setLiveBestsellers] = useState(null);

  useEffect(() => {
    if (!USE_LIVE_DATA) return;
    getOrders().then(res => {
      if (res?.success && res.data) setLiveOrders(res.data);
    }).catch(() => {});
    getReviews().then(res => {
      if (res?.success && res.data) setLiveReviews(res.data);
    }).catch(() => {});
    getBestsellers().then(res => {
      if (res?.success && res.data) setLiveBestsellers(res.data);
    }).catch(() => {});

    const timer = setInterval(() => {
      getOrders().then(res => { if (res?.success && res.data) setLiveOrders(res.data); }).catch(() => {});
      getBestsellers().then(res => { if (res?.success && res.data) setLiveBestsellers(res.data); }).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const orders = USE_LIVE_DATA && liveOrders ? liveOrders : MOCK_ORDERS;
  const reviews = USE_LIVE_DATA && liveReviews ? liveReviews : MOCK_REVIEWS;

  // Compute live KPIs
  const todayOrders = orders.filter(o => isTodayLocal(o.createdAt || o.time));
  
  const totalRevenueAll = orders.reduce((s, o) => s + (o.totalAmount || o.amount || 0), 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenueAll / orders.length) : 0;
  
  const satisfactionRating = reviews.length
    ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 5.0;

  const returningCustomerPct = (() => {
    if (orders.length === 0) return 0;
    const counts = {};
    orders.forEach(o => {
      const key = o.phone || o.customerName || 'Walkin';
      counts[key] = (counts[key] || 0) + 1;
    });
    const values = Object.values(counts);
    const returning = values.filter(v => v > 1).length;
    return parseFloat(((returning / values.length) * 100).toFixed(1));
  })();

  const computedKPI = {
    todayRevenue: todayOrders.reduce((s, o) => s + (o.totalAmount || o.amount || 0), 0),
    todayOrders: todayOrders.length,
    pendingOrders: orders.filter(o => ['Pending', 'Confirmed', 'Preparing'].includes(o.status || o.orderStatus)).length,
    completedOrders: orders.filter(o => (o.status || o.orderStatus) === 'Delivered').length,
    cancelledOrders: orders.filter(o => (o.status || o.orderStatus) === 'Cancelled').length,
    avgOrderValue,
    returningCustomerPct,
    satisfactionRating,
  };

  const kpis = [
    { icon: '💰', label: "Today's Revenue", value: computedKPI.todayRevenue, prefix: '₹', trend: 12.4, color: '#ff4500' },
    { icon: '🛒', label: "Today's Orders", value: computedKPI.todayOrders, trend: 8.2, color: '#ff7a1a' },
    { icon: '⏳', label: 'Pending Orders', value: computedKPI.pendingOrders, trend: -3.1, color: '#f59e0b' },
    { icon: '✅', label: 'Completed Orders', value: computedKPI.completedOrders, trend: 9.5, color: '#10b981' },
    { icon: '❌', label: 'Cancelled Orders', value: computedKPI.cancelledOrders, trend: -15, color: '#ef4444' },
    { icon: '📊', label: 'Avg Order Value', value: computedKPI.avgOrderValue, prefix: '₹', trend: 5.2, color: '#0891b2' },
    { icon: '🔄', label: 'Returning Customers', value: computedKPI.returningCustomerPct, suffix: '%', trend: 3.8, color: '#ffb74d' },
    { icon: '🔥', label: 'Satisfaction Rating', value: computedKPI.satisfactionRating, suffix: '/5', trend: 0.2, color: '#ff4500' },
  ];

  // Dynamic Chart Data Grouping
  const dynamicChartData = (() => {
    if (period === 'Daily') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const revenue = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const count = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      orders.forEach(o => {
        const d = new Date(o.createdAt || o.time);
        const dayLabel = days[(d.getDay() + 6) % 7]; // Adjust so Mon is 0, Sun is 6
        if (revenue[dayLabel] !== undefined) {
          revenue[dayLabel] += (o.totalAmount || o.amount || 0);
          count[dayLabel]++;
        }
      });
      return days.map(d => ({ label: d, revenue: revenue[d], orders: count[d] }));
    } else if (period === 'Weekly') {
      const weeks = ['W1', 'W2', 'W3', 'W4'];
      const revenue = { W1: 0, W2: 0, W3: 0, W4: 0 };
      const count = { W1: 0, W2: 0, W3: 0, W4: 0 };
      orders.forEach(o => {
        const d = new Date(o.createdAt || o.time);
        const date = d.getDate();
        const wk = date <= 7 ? 'W1' : date <= 14 ? 'W2' : date <= 21 ? 'W3' : 'W4';
        revenue[wk] += (o.totalAmount || o.amount || 0);
        count[wk]++;
      });
      return weeks.map(w => ({ label: w, revenue: revenue[w], orders: count[w] }));
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenue = {};
      const count = {};
      months.forEach(m => { revenue[m] = 0; count[m] = 0; });
      orders.forEach(o => {
        const d = new Date(o.createdAt || o.time);
        const mLabel = months[d.getMonth()];
        revenue[mLabel] += (o.totalAmount || o.amount || 0);
        count[mLabel]++;
      });
      return months.map(m => ({ label: m, revenue: revenue[m], orders: count[m] }));
    }
  })();

  // Peak Ordering Hours dynamic calculation: only show 5 PM - 11 PM
  const peakHoursData = (() => {
    const hours = ['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
    const counts = { '5 PM': 0, '6 PM': 0, '7 PM': 0, '8 PM': 0, '9 PM': 0, '10 PM': 0, '11 PM': 0 };
    orders.forEach(o => {
      const d = new Date(o.createdAt || o.time);
      const hour = d.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      let hr12 = hour % 12;
      hr12 = hr12 ? hr12 : 12;
      const key = `${hr12} ${ampm}`;
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });
    return hours.map(h => ({ hour: h, orders: counts[h] }));
  })();

  // Top selling menu items — pulled from the SAME /bestsellers endpoint the
  // customer-facing Bestsellers section uses, so admin and customer views never diverge.
  const topItems = (() => {
    if (USE_LIVE_DATA && liveBestsellers && liveBestsellers.length > 0) {
      return liveBestsellers.slice(0, 5).map(entry => {
        const match = FLAT_MENU.find(m => m.name.toLowerCase() === entry.name.toLowerCase());
        return {
          name: entry.name,
          totalSold: entry.totalSold,
          price: match ? match.price : '—',
          emoji: match ? match.emoji : '🌯',
        };
      });
    }
    // Fallback: derive from whatever order data is on hand (mock mode / offline)
    const counts = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + (item.quantity || item.qty || 1);
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sorted.length > 0) {
      return sorted.map(([name, count]) => {
        const match = FLAT_MENU.find(m => m.name === name);
        return {
          name,
          totalSold: count,
          price: match ? match.price : '—',
          emoji: match ? match.emoji : '🌯',
        };
      });
    }
    return FLAT_MENU.filter(i => i.isBestseller).slice(0, 5).map(i => ({
      name: i.name,
      totalSold: '—',
      price: i.price,
      emoji: i.emoji,
    }));
  })();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time))
    .slice(0, 5)
    .map(o => ({
      id: o._id || o.id,
      orderId: o.billNumber || o.orderId,
      customer: o.customerName || o.customer,
      amount: o.totalAmount || o.amount,
      orderStatus: o.status || o.orderStatus,
    }));

  const recentReviewsList = [...reviews]
    .slice(0, 3)
    .map(r => ({
      id: r._id || r.id,
      customer: r.name || r.customer,
      rating: r.rating,
      text: r.text,
      branch: r.branch || '—',
      date: r.createdAt ? r.createdAt.slice(0, 10) : (r.date || ''),
      color: r.color || '#fff4b8',
    }));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview 🔥</h1>
        <p className="admin-page-subtitle">
          {USE_LIVE_DATA
            ? `🟢 Live Database View — ${orders.length} orders total`
            : '🟡 Offline Mock Mode — set USE_LIVE_DATA=true in mockData.js'}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="admin-kpi-grid">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} delay={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="admin-grid-2 admin-mb-24">
        <ChartWrapper
          title="Revenue Trend"
          data={dynamicChartData}
          type="area"
          lines={[{ key: 'revenue', label: 'Revenue (₹)' }]}
          showToggle
          onPeriodChange={setPeriod}
        />
        <ChartWrapper
          title="Orders Volume"
          data={dynamicChartData}
          type="bar"
          bars={[{ key: 'orders', label: 'Orders' }]}
        />
      </div>

      {/* Peak Hours + Branch Performance */}
      <div className="admin-grid-2 admin-mb-24">
        <ChartWrapper
          title="Peak Ordering Hours (5 PM - 11 PM)"
          data={peakHoursData}
          type="bar"
          xKey="hour"
          bars={[{ key: 'orders', label: 'Orders' }]}
        />

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Branch Performance</div>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onNavigate('branches')}>View All</button>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            {BRANCH_PERFORMANCE.map((b, i) => {
              // Aggregate live branch sales dynamically
              const matchingOrders = orders.filter(o => (o.branch || '').toLowerCase().includes(b.branch.toLowerCase()));
              const rev = matchingOrders.reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0);
              const orderCount = matchingOrders.length;
              return (
                <div key={b.branch} style={{ marginBottom: 16 }}>
                  <div className="admin-flex-between admin-mb-8" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{b.branch}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-primary)' }}>₹{(rev / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="admin-progress-bar">
                    <motion.div
                      className="admin-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${rev ? Math.min((rev / 285000) * 100, 100) : 0}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 11.5, color: 'var(--admin-text-muted)' }}>
                    <span>Orders: {orderCount}</span>
                    <span>🔥 {b.rating}</span>
                    <span>Prep: {b.avgPrepTime}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Items */}
      <div className="admin-grid-2 admin-mb-24">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent Orders</div>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onNavigate('orders')}>View All</button>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id || o.orderId}>
                      <td style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{o.orderId}</td>
                      <td>{o.customer}</td>
                      <td style={{ fontWeight: 700 }}>₹{o.amount}</td>
                      <td><span className={`admin-badge ${STATUS_BADGE[o.orderStatus] || 'admin-badge-gray'}`}>{o.orderStatus}</span></td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: 20 }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Top Selling Items</div>
            <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Synced with customer site</span>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {topItems.map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    position: 'relative',
                    background: 'var(--admin-primary-soft)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '14px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', top: 8, left: 8,
                      width: 20, height: 20, borderRadius: 6,
                      background: 'var(--admin-primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 26, textAlign: 'center', marginTop: 6 }}>{item.emoji || '🌯'}</div>
                  <div
                    style={{
                      fontSize: 12.5, fontWeight: 700, textAlign: 'center',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--admin-text-muted)', textAlign: 'center' }}>
                    {typeof item.totalSold === 'number' ? `${item.totalSold} sold` : 'Bestseller'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--admin-primary)', textAlign: 'center' }}>
                    {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                  </div>
                </div>
              ))}
              {topItems.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--admin-text-muted)', padding: 20 }}>No sales data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Recent Customer Reviews</div>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onNavigate('reviews')}>View All</button>
        </div>
        <div className="admin-card-body" style={{ paddingTop: 8 }}>
          {recentReviewsList.length === 0 && (
            <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: 24 }}>
              No reviews yet. Post one from the frontend!
            </p>
          )}
          <div className="admin-grid-3">
            {recentReviewsList.map(r => (
              <div key={r.id || r.customer} className="admin-sticky-note" style={{ background: r.color }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1208' }}>{r.customer}</span>
                  <span style={{ fontSize: 12, whiteSpace: 'nowrap', display: 'inline-block' }}>{'🔥'.repeat(Math.round(r.rating))}</span>
                </div>
                <p style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.5, margin: 0 }}>{r.text.slice(0, 100)}{r.text.length > 100 ? '…' : ''}</p>
                {r.date && <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280' }}>{r.branch !== '—' ? `${r.branch} · ` : ''}{r.date}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
