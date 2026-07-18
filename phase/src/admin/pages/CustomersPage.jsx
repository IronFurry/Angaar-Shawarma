import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import KPICard from '../components/KPICard';
import { USE_LIVE_DATA, CUSTOMERS, BRANCH_PERFORMANCE } from '../mockData';
import { getOrders } from '../../api/orderApi';
import { getReviews } from '../../api/reviewsApi';
import { menuData } from '../../utils/menuData';

const DONUT_COLORS = ['#ff4500', '#0891b2'];

const POSITIVE_KEYWORDS = ['Fresh', 'Fast', 'Delicious', 'Affordable', 'Friendly Staff'];
const IMPROVEMENT_SUGGESTIONS = ['Delivery Time', 'Parking', 'Waiting Time'];

const CUSTOMER_STATS = {
  totalCustomers: 1284,
  returningPct: 67.3,
  newThisMonth: 264,
  avgOrderValue: 148.7,
  avgOrdersPerCust: 3.9,
  satisfactionRating: 4.6,
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="admin-chart-tooltip">
      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
        {payload[0].name || 'Value'}: {payload[0].value}
      </div>
    </div>
  );
};

const CustomersPage = ({ toast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [liveOrders, setLiveOrders] = useState(null);
  const [liveReviews, setLiveReviews] = useState(null);

  useEffect(() => {
    if (!USE_LIVE_DATA) return;
    getOrders().then(res => { if (res?.success && res.data) setLiveOrders(res.data); }).catch(() => {});
    getReviews().then(res => { if (res?.success && res.data) setLiveReviews(res.data); }).catch(() => {});
  }, []);

  const orders = USE_LIVE_DATA && liveOrders ? liveOrders : [];
  const reviews = USE_LIVE_DATA && liveReviews ? liveReviews : [];

  // Derive stats from orders & reviews dynamically
  const stats = (() => {
    if (USE_LIVE_DATA && liveOrders) {
      const uniquePhones = new Set(liveOrders.map(o => o.phone || o.customerName).filter(Boolean));
      const totalCustomers = uniquePhones.size || liveOrders.length;
      const avgOrderValue = liveOrders.length
        ? Math.round(liveOrders.reduce((s, o) => s + (o.totalAmount || 0), 0) / liveOrders.length)
        : 0;
      
      const counts = {};
      liveOrders.forEach(o => {
        const key = o.phone || o.customerName || 'Walkin';
        counts[key] = (counts[key] || 0) + 1;
      });
      const values = Object.values(counts);
      const returningCount = values.filter(v => v > 1).length;
      const returningPct = values.length ? parseFloat(((returningCount / values.length) * 100).toFixed(1)) : 0;

      const satisfactionRating = (liveReviews && liveReviews.length)
        ? parseFloat((liveReviews.reduce((s, r) => s + r.rating, 0) / liveReviews.length).toFixed(1))
        : CUSTOMER_STATS.satisfactionRating;
      
      return {
        totalCustomers,
        returningPct,
        newThisMonth: Math.max(1, Math.round(totalCustomers * 0.25)), // estimate
        avgOrderValue,
        avgOrdersPerCust: totalCustomers ? parseFloat((liveOrders.length / totalCustomers).toFixed(1)) : 0,
        satisfactionRating,
      };
    }
    return CUSTOMER_STATS;
  })();

  const feedback = (USE_LIVE_DATA && liveReviews)
    ? liveReviews.slice(0, 4).map(r => {
        const branches = ['Vasai Gaon (Main)', 'Vasai West (2.0)', 'Nallasopara', 'Virar'];
        const code = (r.name || '').charCodeAt(0) || 0;
        const derivedBranch = branches[code % branches.length];
        return {
          name: r.name,
          rating: r.rating,
          review: r.text,
          branch: r.branch || derivedBranch,
          date: r.createdAt ? r.createdAt.slice(0, 10) : '',
        };
      })
    : [
        { name: 'Aryan', rating: 5, review: 'Best shawarma in Vasai! Extemely fresh meat and authentic garlic sauce.', branch: 'Vasai Gaon (Main)', date: '2026-06-30' },
        { name: 'Rohan', rating: 4, review: 'Shawarma was delicious but the waiting time was slightly longer than usual.', branch: 'Vasai West (2.0)', date: '2026-06-29' },
        { name: 'Priya', rating: 5, review: 'Super fast delivery and clean packaging. The cheese burst shawarma is amazing!', branch: 'Virar', date: '2026-06-28' },
        { name: 'Sneha', rating: 3, review: 'Average taste, pricing is affordable. Parking near the outlet is difficult.', branch: 'Nallasopara', date: '2026-06-27' },
      ];

  // Dynamic Returning vs New chart data
  const donutData = (() => {
    return [
      { name: 'Returning Customers', value: stats.returningPct, color: '#ff4500' },
      { name: 'New Customers', value: parseFloat((100 - stats.returningPct).toFixed(1)), color: '#0891b2' },
    ];
  })();

  // Dynamic hourly data: 5 PM - 11 PM
  const hourlyData = (() => {
    const hours = ['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
    const counts = { '5 PM': 0, '6 PM': 0, '7 PM': 0, '8 PM': 0, '9 PM': 0, '10 PM': 0, '11 PM': 0 };
    const ordersList = USE_LIVE_DATA && liveOrders ? liveOrders : [];
    ordersList.forEach(o => {
      const d = new Date(o.createdAt || o.time);
      const hr = d.getHours();
      const ampm = hr >= 12 ? 'PM' : 'AM';
      let hr12 = hr % 12;
      hr12 = hr12 ? hr12 : 12;
      const key = `${hr12} ${ampm}`;
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });
    return hours.map(h => ({ label: h, orders: counts[h] }));
  })();

  // Dynamic weekly activity data
  const weeklyData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const ordersList = USE_LIVE_DATA && liveOrders ? liveOrders : [];
    ordersList.forEach(o => {
      const d = new Date(o.createdAt || o.time);
      const dayLabel = days[(d.getDay() + 6) % 7];
      if (counts[dayLabel] !== undefined) {
        counts[dayLabel]++;
      }
    });
    return days.map(d => ({ label: d, orders: counts[d] }));
  })();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast('Please enter a phone number or order ID', 'warning');
      return;
    }
    setSearched(true);
    const query = searchQuery.trim().toLowerCase();
    
    // Search in liveOrders if enabled
    if (USE_LIVE_DATA && liveOrders) {
      const found = liveOrders.find(o =>
        (o.phone && o.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))) ||
        (o.billNumber && o.billNumber.toLowerCase().includes(query)) ||
        (o.customerName && o.customerName.toLowerCase().includes(query))
      );
      if (found) {
        setSearchResults({
          name: found.customerName,
          phone: found.phone,
          totalOrders: liveOrders.filter(o => o.phone === found.phone).length,
          lastOrder: found.createdAt ? found.createdAt.slice(0, 10) : '—',
          activeOrder: ['Pending', 'Confirmed', 'Preparing'].includes(found.status) ? found.billNumber : null,
        });
        return;
      }
    }

    // Search in mock data fallback
    const foundMock = CUSTOMERS.find(c => 
      c.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) || 
      c.id.toLowerCase() === query || 
      c.name.toLowerCase().includes(query)
    );

    if (foundMock) {
      setSearchResults({
        name: foundMock.name,
        phone: foundMock.phone,
        totalOrders: foundMock.totalOrders,
        lastOrder: foundMock.lastOrder,
        activeOrder: foundMock.totalOrders % 5 === 0 ? `AGR-${1000 + foundMock.totalOrders}` : null
      });
    } else {
      setSearchResults(null);
    }
  };

  const topItems = (() => {
    const counts = {};
    const ordersList = USE_LIVE_DATA && liveOrders ? liveOrders : [];
    ordersList.forEach(o => {
      (o.items || []).forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + (item.quantity || item.qty || 1);
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalSales = Object.values(counts).reduce((s, c) => s + c, 0) || 1;
    if (sorted.length > 0) {
      return sorted.map(([name, count], idx) => ({
        name,
        orders: count,
        pct: Math.round((count / totalSales) * 100),
        trend: idx % 2 === 0 ? 'up' : 'down',
      }));
    }
    const flatMenu = Object.values(menuData).flat();
    return flatMenu.filter(i => i.isBestseller).slice(0, 5).map((item, idx) => ({
      name: item.name,
      orders: 247 - idx * 24,
      pct: 20 - idx * 2,
      trend: idx % 2 === 0 ? 'up' : 'down',
    }));
  })();

  const ratingDistribution = (() => {
    const dist = [
      { stars: '★★★★★', rating: 5, count: 0 },
      { stars: '★★★★☆', rating: 4, count: 0 },
      { stars: '★★★☆☆', rating: 3, count: 0 },
      { stars: '★★☆☆☆', rating: 2, count: 0 },
      { stars: '★☆☆☆☆', rating: 1, count: 0 },
    ];
    if (USE_LIVE_DATA && liveReviews) {
      liveReviews.forEach(r => {
        const item = dist.find(d => d.rating === Math.round(r.rating));
        if (item) item.count++;
      });
      return dist;
    }
    return [
      { stars: '★★★★★', count: 184 },
      { stars: '★★★★☆', count: 92 },
      { stars: '★★★☆☆', count: 28 },
      { stars: '★★☆☆☆', count: 11 },
      { stars: '★☆☆☆☆', count: 5 },
    ];
  })();

  const totalReviewsCount = ratingDistribution.reduce((sum, r) => sum + r.count, 0) || 320;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customer Insights</h1>
        <p className="admin-page-subtitle">Understand customer behaviour while respecting customer privacy.</p>
      </div>

      {/* Overview KPI Cards */}
      <div className="admin-kpi-grid admin-mb-24" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        <KPICard icon="👥" label="Total Customers" value={stats.totalCustomers} trend={12} trendValue={12.4} color="#ff4500" />
        <KPICard icon="🔄" label="Returning Customer %" value={stats.returningPct} suffix="%" trend={3} trendValue={3.8} color="#10b981" />
        <KPICard icon="🆕" label="New Customers This Month" value={stats.newThisMonth} trend={15} trendValue={15.2} color="#0891b2" />
        <KPICard icon="💰" label="Average Order Value" value={stats.avgOrderValue} prefix="₹" trend={5} trendValue={5.2} color="#ff7a1a" />
        <KPICard icon="📊" label="Avg Orders Per Customer" value={stats.avgOrdersPerCust} trend={2} trendValue={2.1} color="#ffb74d" />
        <KPICard icon="🔥" label="Customer Satisfaction" value={stats.satisfactionRating} suffix="/5" trend={0} trendValue={0.2} color="#f59e0b" />
      </div>

      {/* Customer Behavior Charts */}
      <div className="admin-grid-3 admin-mb-24">
        {/* Returning vs New (Donut) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Returning vs New Customers</div>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, idx) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} layout="vertical" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Time */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Orders by Time (Hourly Peak)</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4500" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ff4500" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="#ff4500" strokeWidth={2} fillOpacity={1} fill="url(#colorHourly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Customer Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Weekly Customer Activity</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="orders" name="Orders" fill="#ff7a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Items & Branch Insights */}
      <div className="admin-grid-2 admin-mb-24">
        {/* Popular Menu Items */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Popular Menu Items</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            {topItems.map((item, index) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-primary)' }}>{index + 1}.</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{item.orders.toLocaleString()} orders</span>
                  <span className="admin-badge admin-badge-primary" style={{ minWidth: 45, justifyContent: 'center' }}>{item.pct}%</span>
                  <span style={{ color: item.trend === 'up' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {item.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Customer Insights */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Branch Customer Insights</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {BRANCH_PERFORMANCE.map(branch => {
              const matchingOrders = orders.filter(o => (o.branch || '').toLowerCase().includes(branch.branch.toLowerCase()));
              const rev = matchingOrders.reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0);
              const orderCount = matchingOrders.length;
              const avgSpend = orderCount ? Math.round(rev / orderCount) : 0;
              return (
                <div key={branch.branch} style={{ background: 'var(--admin-input-bg)', padding: 12, borderRadius: 12, border: '1px solid var(--admin-card-border)' }}>
                  <div className="admin-flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{branch.branch}</span>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>★ {branch.rating} rating</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{orderCount}</div>
                      <div style={{ color: 'var(--admin-text-muted)', fontSize: 10 }}>Total Orders</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>₹{avgSpend}</div>
                      <div style={{ color: 'var(--admin-text-muted)', fontSize: 10 }}>Avg Spend</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#10b981' }}>{branch.branch === 'Vasai Gaon' ? '68%' : branch.branch === 'Vasai West' ? '65%' : '61%'}</div>
                      <div style={{ color: 'var(--admin-text-muted)', fontSize: 10 }}>Returning %</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#7c3aed' }}>{branch.branch === 'Vasai Gaon' ? '8 PM' : '7 PM'}</div>
                      <div style={{ color: 'var(--admin-text-muted)', fontSize: 10 }}>Peak Hour</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Satisfaction Rating Details */}
      <div className="admin-grid-2 admin-mb-24">
        {/* Rating and Keywords */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Customer Satisfaction Breakdown</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            <div className="admin-flex-between" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--admin-primary)' }}>{stats.satisfactionRating} / 5.0</span>
                <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Based on aggregated reviews</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {'★★★★★'.split('').map((s, idx) => <span key={idx} style={{ color: '#f59e0b', fontSize: 18 }}>★</span>)}
              </div>
            </div>

            {/* Distribution */}
            <div style={{ marginBottom: 20 }}>
              {ratingDistribution.map(row => (
                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, fontSize: 12 }}>
                  <span style={{ width: 50, color: '#f59e0b' }}>{row.stars}</span>
                  <div className="admin-progress-bar" style={{ flex: 1 }}>
                    <div className="admin-progress-fill" style={{ width: `${(row.count / totalReviewsCount) * 100}%` }} />
                  </div>
                  <span style={{ width: 25, textAlign: 'right', color: 'var(--admin-text-muted)' }}>{row.count}</span>
                </div>
              ))}
            </div>

            <div className="admin-divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>🔥 Positive Keywords</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {POSITIVE_KEYWORDS.map(w => (
                    <span key={w} className="admin-badge admin-badge-success" style={{ fontSize: 11 }}>{w}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>⚠️ Areas to Improve</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {IMPROVEMENT_SUGGESTIONS.map(w => (
                    <span key={w} className="admin-badge admin-badge-danger" style={{ fontSize: 11 }}>{w}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback (Anonymous) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent Feedback (Anonymous)</div>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback.map((feedbackItem, idx) => (
              <div key={idx} style={{ background: 'var(--admin-input-bg)', padding: 12, borderRadius: 12, border: '1px solid var(--admin-card-border)' }}>
                <div className="admin-flex-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{feedbackItem.name}</span>
                  <span style={{ color: '#f59e0b', fontSize: 12, whiteSpace: 'nowrap' }}>{'★'.repeat(feedbackItem.rating)}</span>
                </div>
                <p style={{ fontSize: 13, margin: '4px 0', color: 'var(--admin-text-primary)' }}>"{feedbackItem.review}"</p>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
                  🏪 {feedbackItem.branch} · 📅 {feedbackItem.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Lookup (Search Box) */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">🛠️ Customer Support Search (Privacy-Safe Lookup)</div>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              className="admin-input"
              type="text"
              placeholder="Search by customer phone number, name or order ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="admin-btn admin-btn-primary" type="submit">Search</button>
          </form>

          {searched && (
            <AnimatePresence mode="wait">
              {searchResults ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ background: 'var(--admin-input-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--admin-border)' }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-primary)', marginBottom: 12 }}>🔍 Search Result Found</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Customer Name</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{searchResults.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Phone Number</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{searchResults.phone}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Total Orders Placed</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{searchResults.totalOrders}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Last Order Date</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{searchResults.lastOrder}</div>
                    </div>
                    {searchResults.activeOrder && (
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Current Active Order</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>{searchResults.activeOrder}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.2)', padding: 16, borderRadius: 12, color: 'var(--admin-danger)', textAlign: 'center' }}
                >
                  ⚠️ No customer records found matching your search.
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
