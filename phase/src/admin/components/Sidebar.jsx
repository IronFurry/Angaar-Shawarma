import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = {
  owner:   { bg: 'rgba(255,69,0,0.15)',   text: '#ff4500' },
  staff:   { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
};

// SVG Icon Components for Sidebar
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);

const OrdersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CustomersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const BranchesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ReviewsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CouponsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const StaffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'orders',    label: 'Orders',           icon: <OrdersIcon /> },
      { id: 'customers', label: 'Customer Insights', icon: <CustomersIcon /> },
      { id: 'menu',      label: 'Menu Management',  icon: <MenuIcon /> },
      { id: 'branches',  label: 'Branches',          icon: <BranchesIcon /> },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
      { id: 'reviews',   label: 'Reviews',   icon: <ReviewsIcon /> },
    ]
  },
  {
    label: 'Promotions',
    items: [
      { id: 'coupons', label: 'Coupons', icon: <CouponsIcon /> },
    ]
  },
  {
    label: 'Access',
    items: [
      { id: 'staffaccounts', label: 'Staff Accounts', icon: <StaffIcon /> },
    ]
  },
];

const Sidebar = ({ activeSection, onNavigate, collapsed, mobileOpen }) => {
  const { user } = useAuth();

  const roleBadge = user ? (ROLE_BADGE[user.role] || ROLE_BADGE.staff) : null;
  const initials = user
    ? (user.username || user.displayName || 'U')
        .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SA';

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        </div>
        <motion.div
          className="admin-sidebar-logo-text"
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <div className="admin-sidebar-logo-title">Angaar Shawarma</div>
          <div className="admin-sidebar-logo-sub">Admin Panel</div>
        </motion.div>
      </div>

      {/* Nav */}
      <div className="admin-sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="admin-sidebar-section-label">{section.label}</div>
            )}
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <motion.span
                    className="admin-nav-label"
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* User Footer — real user from AuthContext */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">{initials}</div>
          {!collapsed && (
            <motion.div
              className="admin-sidebar-user-info"
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <div className="admin-sidebar-user-name">
              {user?.username || user?.displayName || 'Admin'}
              </div>
              {user && roleBadge && (
                <div style={{
                  fontSize: 10, fontWeight: 700, marginTop: 2,
                  padding: '1px 6px', borderRadius: 999,
                  background: roleBadge.bg, color: roleBadge.text,
                  display: 'inline-block', textTransform: 'capitalize',
                }}>
                  {user.role}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
