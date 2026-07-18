import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = {
  owner:   { bg: 'rgba(255,69,0,0.15)',   text: '#ff4500' },
  staff:   { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
};

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'orders',    label: 'Orders',           icon: '🛒' },
      { id: 'customers', label: 'Customer Insights', icon: '👥' },
      { id: 'menu',      label: 'Menu Management',  icon: '🍽️' },
      { id: 'branches',  label: 'Branches',          icon: '🏪' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'reviews',   label: 'Reviews',   icon: '⭐' },
    ]
  },
  {
    label: 'Promotions',
    items: [
      { id: 'coupons', label: 'Coupons', icon: '🎟️' },
    ]
  },
  {
    label: 'Access',
    items: [
      { id: 'staffaccounts', label: 'Staff Accounts', icon: '🔐' },
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
        <div className="admin-sidebar-logo-icon">🔥</div>
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
