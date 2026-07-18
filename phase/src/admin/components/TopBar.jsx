/**
 * TopBar — Admin panel top navigation bar.
 *
 * Modified to:
 * - Display the logged-in user's displayName and role badge from AuthContext.
 * - Show a Logout button that calls AuthContext.logout().
 * - Search bar navigates to Orders section and stores query.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = {
  owner:   { bg: 'rgba(255,69,0,0.15)',   text: '#ff4500' },
  manager: { bg: 'rgba(8,145,178,0.15)',  text: '#0891b2' },
  staff:   { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
};

const TopBar = ({ collapsed, onToggleSidebar, activeSection, theme, onToggleTheme, onExit, onNavigate }) => {
  const { user, logout } = useAuth();
  const [searchVal, setSearchVal] = useState('');

  const SECTION_LABELS = {
    dashboard: 'Dashboard', orders: 'Orders Management', customers: 'Customer Insights',
    menu: 'Menu Management', branches: 'Branch Management',
    analytics: 'Analytics', reviews: 'Reviews',
    coupons: 'Coupon Management', staffaccounts: 'Staff Accounts',
  };

  const roleBadge = user ? (ROLE_COLORS[user.role] || ROLE_COLORS.staff) : null;
  // Generate initials from username or displayName
  const initials = user
    ? (user.username || user.displayName || 'U')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SA';

  const handleLogout = () => {
    logout();
    // The AuthProvider will update isAuthenticated → LoginPage will render
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) return;
    // Store query so OrdersPage can pick it up
    sessionStorage.setItem('angaar_admin_search', q);
    if (onNavigate) onNavigate('orders');
    setSearchVal('');
  };

  return (
    <header className="admin-topbar">
      {/* Hamburger */}
      <button className="admin-topbar-hamburger" onClick={onToggleSidebar}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="admin-topbar-breadcrumb">
        <span>Angaar Shawarma / </span>{SECTION_LABELS[activeSection] || 'Dashboard'}
      </div>

      {/* Search — navigates to Orders and filters by name/bill */}
      <form className="admin-topbar-search" onSubmit={handleSearch}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, color: 'var(--admin-text-muted)' }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          placeholder="Search orders by name or bill #…"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
      </form>


      {/* Actions */}
      <div className="admin-topbar-actions">
        {/* Dark/Light Mode Toggle */}
        <button className="admin-topbar-icon-btn" onClick={onToggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Exit to Site */}
        <button className="admin-topbar-icon-btn" onClick={onExit} title="Back to Customer Site" style={{ background: 'var(--admin-primary-soft)', color: 'var(--admin-primary)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
        {/* Sign Out */}
        <button
          className="admin-topbar-icon-btn admin-signout-btn"
          onClick={handleLogout}
          title="Sign Out"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700, gap: '4px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="admin-signout-label">Sign Out</span>
        </button>

        {/* Profile — real user from AuthContext */}
        <div className="admin-topbar-profile">
          <div className="admin-topbar-avatar">{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span className="admin-topbar-profile-name">
            {user?.username || user?.displayName || 'Admin'}
            </span>
            {user && roleBadge && (
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '999px',
                background: roleBadge.bg,
                color: roleBadge.text,
                textTransform: 'capitalize',
                lineHeight: 1.4,
              }}>
                {user.role}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
