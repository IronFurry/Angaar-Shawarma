import React, { useState, useEffect, useCallback } from 'react';
import { menuData } from '../utils/menuData';
import { getOrderById } from '../api/orderApi';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const ClipboardIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const ShawarmaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff7a1a', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const PlatterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff5400', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const SaladIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70e000', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6" />
  </svg>
);

const MocktailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#06d6a0', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M18 22H6L4 6h16l-2 16z" />
    <path d="M12 6V1M12 1h4" />
  </svg>
);

const ChiliIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ef4444', display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2c-.55 0-1 .45-1 1s.45 1 1 1c1.65 0 3 1.35 3 3 0 .55.45 1 1 1s1-.45 1-1c0-2.76-2.24-5-5-5zm0 8c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);

const CartIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const FoodIcon = ({ emoji, size = 24 }) => {
  switch (emoji) {
    case '🌯': return <ShawarmaIcon size={size} />;
    case '🧀':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffb703' }}>
          <path d="M14 22V10a2 2 0 0 0-2-2H2" /><path d="M20 22V4a2 2 0 0 0-2-2H2" /><path d="M2 14h12" /><path d="M2 18h16" />
        </svg>
      );
    case '🍽️': return <PlatterIcon size={size} />;
    case '🥗':  return <SaladIcon size={size} />;
    case '🥤':
    case '🍹':
    case '🍉':  return <MocktailIcon size={size} />;
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_META = {
  Pending:   { label: 'Received',   color: '#b45309', inkColor: '#92400e', bg: '#fef3c7' },
  Confirmed: { label: 'Confirmed',  color: '#1d4ed8', inkColor: '#1e40af', bg: '#dbeafe' },
  Preparing: { label: 'Cooking!',   color: '#c2410c', inkColor: '#9a3412', bg: '#ffedd5' },
  Ready:     { label: 'Ready!',     color: '#065f46', inkColor: '#064e3b', bg: '#d1fae5' },
  Delivered: { label: 'Delivered',  color: '#374151', inkColor: '#1f2937', bg: '#f3f4f6' },
  Cancelled: { label: 'Cancelled',  color: '#991b1b', inkColor: '#7f1d1d', bg: '#fee2e2' },
};

const timeAgo = (isoStr) => {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

// ─── Skeuomorphic ticket card ─────────────────────────────────────────────────
const OrderTicket = ({ order }) => {
  const meta = STATUS_META[order.status] || STATUS_META['Pending'];
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="mo-ticket">
      {/* Paper body */}
      <div className="mo-ticket-body">
        {/* Header strip */}
        <div className="mo-ticket-header">
          <span className="mo-ticket-brand">ANGAAR</span>
          <span className="mo-ticket-hash">#{order.billNumber}</span>
        </div>

        <div className="mo-ticket-divider-dots" />

        {/* Items summary */}
        <div className="mo-ticket-items">
          {order.items.slice(0, 2).map((item, i) => (
            <div key={i} className="mo-ticket-item-row">
              <span className="mo-ticket-item-name">{item.name}</span>
              <span className="mo-ticket-item-qty">×{item.quantity}</span>
              <span className="mo-ticket-item-price">₹{item.lineTotal}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="mo-ticket-more">+{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}</div>
          )}
        </div>

        <div className="mo-ticket-divider-solid" />

        {/* Totals */}
        <div className="mo-ticket-total-row">
          <span>{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
          <span className="mo-ticket-total-amt">₹{order.totalAmount}</span>
        </div>

        {/* Type badge */}
        <div className="mo-ticket-meta">
          <span className={`mo-ticket-type ${order.orderType === 'Delivery' ? 'delivery' : 'takeaway'}`}>
            {order.orderType}
          </span>
          <span className="mo-ticket-time">{timeAgo(order.createdAt)}</span>
        </div>

        {/* Rubber stamp status */}
        <div
          className="mo-stamp"
          style={{ '--stamp-color': meta.inkColor, '--stamp-bg': meta.bg }}
        >
          <span className="mo-stamp-text">{meta.label}</span>
        </div>
      </div>

      {/* Perforated bottom tear */}
      <div className="mo-ticket-tear" />
    </div>
  );
};

// ─── My Orders widget ──────────────────────────────────────────────────────────
const MyOrdersWidget = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(true);

  const fetchMyOrders = useCallback(async () => {
    try {
      const ids = JSON.parse(localStorage.getItem('angaar_my_orders') || '[]');
      if (!ids.length) { setLoading(false); return; }

      const results = await Promise.all(ids.map(id => getOrderById(id)));
      const valid   = results.filter(r => r.success).map(r => r.data);
      
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const recent = valid.filter(order => (now - new Date(order.createdAt).getTime()) < oneDayMs);

      if (recent.length !== ids.length) {
        const newIds = recent.map(o => o._id);
        localStorage.setItem('angaar_my_orders', JSON.stringify(newIds));
      }

      // Show only active (non-delivered, non-cancelled) orders first
      const sorted  = recent.sort((a, b) => {
        const rank = { Pending: 0, Confirmed: 1, Preparing: 2, Ready: 3, Delivered: 4, Cancelled: 5 };
        return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
      });
      setOrders(sorted);
    } catch { /* silently ignore */ }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchMyOrders(); }, [fetchMyOrders]);
  // Auto-refresh every 12 s
  useEffect(() => {
    const id = setInterval(fetchMyOrders, 12000);
    return () => clearInterval(id);
  }, [fetchMyOrders]);

  const ids = JSON.parse(localStorage.getItem('angaar_my_orders') || '[]');
  if (!ids.length) return null; // nothing to show if user hasn't ordered yet

  return (
    <div className="mo-widget">
      {/* Widget header */}
      <button className="mo-widget-header" onClick={() => setOpen(o => !o)}>
        <span className="mo-widget-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          My Orders
        </span>
        <span className="mo-widget-toggle">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mo-widget-body">
          {loading ? (
            <div className="mo-loading">
              <span className="mo-loading-dot" /><span className="mo-loading-dot" /><span className="mo-loading-dot" />
            </div>
          ) : orders.length === 0 ? (
            <p className="mo-empty-text">No active orders found.</p>
          ) : (
            <div className="mo-tickets-list">
              {orders.map(order => (
                <OrderTicket key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Menu component ───────────────────────────────────────────────────────
const Menu = ({ addToCart }) => {
  const [activeTab, setActiveTab] = useState('shawarma');
  const [selectedItem, setSelectedItem] = useState(menuData.shawarma[0]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (menuData[activeTab] && menuData[activeTab].length > 0) {
      setSelectedItem(menuData[activeTab][0]);
    }
  }, [activeTab]);

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setAnimating(true);
    setTimeout(() => { setActiveTab(tab); setAnimating(false); }, 180);
  };

  return (
    <section id="menu">
      <div className="reveal">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ClipboardIcon /> Full Menu
        </div>
        <h2 className="section-title">Everything<br />We Serve</h2>
        <p className="section-sub">Shawarmas, platters, fresh salads, and mocktails to wash it all down.</p>
      </div>

      <div className="menu-layout">
        {/* ── Left column: category tabs + My Orders widget ── */}
        <div className="menu-tabs">
          <button className={`menu-tab ${activeTab === 'shawarma' ? 'active' : ''}`} onClick={() => handleTabSwitch('shawarma')} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="tab-icon" style={{ display: 'flex', alignSelf: 'center' }}><ShawarmaIcon /></span> Shawarmas
            <span className="tab-count">{menuData.shawarma.length}</span>
          </button>
          <button className={`menu-tab ${activeTab === 'platter' ? 'active' : ''}`} onClick={() => handleTabSwitch('platter')} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="tab-icon" style={{ display: 'flex', alignSelf: 'center' }}><PlatterIcon /></span> Platters
            <span className="tab-count">{menuData.platter.length}</span>
          </button>
          <button className={`menu-tab ${activeTab === 'salad' ? 'active' : ''}`} onClick={() => handleTabSwitch('salad')} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="tab-icon" style={{ display: 'flex', alignSelf: 'center' }}><SaladIcon /></span> Salads
            <span className="tab-count">{menuData.salad.length}</span>
          </button>
          <button className={`menu-tab ${activeTab === 'mocktail' ? 'active' : ''}`} onClick={() => handleTabSwitch('mocktail')} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="tab-icon" style={{ display: 'flex', alignSelf: 'center' }}><MocktailIcon /></span> Mocktails
            <span className="tab-count">{menuData.mocktail.length}</span>
          </button>

          {/* ── Skeuomorphic My Orders widget ── */}
          <MyOrdersWidget />
        </div>

        {/* ── Middle: items list ── */}
        <div
          className="menu-items"
          id="menu-items"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.18s ease, transform 0.18s ease'
          }}
        >
          {menuData[activeTab].map(item => (
            <React.Fragment key={item.id}>
              {selectedItem?.id === item.id && (
                <div className="mobile-detail-wrapper">
                  <div className="menu-detail-card mobile-only">
                    {selectedItem.isBestseller && (<span className="detail-bestseller-badge">BESTSELLER</span>)}
                    <div className="detail-img-wrap">
                      <div className="detail-img-fallback"><FoodIcon emoji={selectedItem.emoji} size={56} /></div>
                      <img
                        src={selectedItem.img}
                        alt={selectedItem.name}
                        className="detail-img"
                        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                      />
                      <div className="detail-img-overlay"></div>
                    </div>
                    <div className="detail-content">
                      <div className="detail-header">
                        <h3 className="detail-name">{selectedItem.name}</h3>
                        <span className="detail-price">{selectedItem.price}</span>
                      </div>
                      <p className="detail-desc">{selectedItem.desc}</p>
                      <div className="detail-nutrition">
                        <div className="nutrition-item"><span className="nutrition-val">{selectedItem.protein}</span><span className="nutrition-label">Protein</span></div>
                        <div className="nutrition-item"><span className="nutrition-val">{selectedItem.calories}</span><span className="nutrition-label">Calories</span></div>
                        <div className="nutrition-item"><span className="nutrition-val">{selectedItem.carbs}</span><span className="nutrition-label">Carbs</span></div>
                      </div>
                      <div className="detail-ingredients-section">
                        <h4 className="detail-section-title">Ingredients</h4>
                        <div className="detail-ingredients-list">
                          {selectedItem.ingredients.map((ing, i) => (<span key={i} className="ingredient-tag">{ing}</span>))}
                        </div>
                      </div>
                      <button className="detail-order-btn" onClick={() => addToCart(selectedItem, true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Place Order <CartIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={`menu-item ${selectedItem?.id === item.id ? 'selected' : ''}`} onClick={() => setSelectedItem(item)}>
                <div className="menu-item-emoji">
                  <FoodIcon emoji={item.emoji} size={24} />
                  {item.spicy && (<span className="chili-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChiliIcon /></span>)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="menu-item-name">{item.name}</div>
                  <div className="menu-item-desc">{item.desc}</div>
                </div>
                <div className="menu-item-price-actions">
                  <div className="menu-item-price">{item.price}</div>
                  <button className="quick-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(item); }} title="Add to order">+</button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Right: detail card (desktop only) ── */}
        {selectedItem && (
          <div className="menu-detail-card desktop-only">
            {selectedItem.isBestseller && (<span className="detail-bestseller-badge">BESTSELLER</span>)}
            <div className="detail-img-wrap">
              <div className="detail-img-fallback"><FoodIcon emoji={selectedItem.emoji} size={56} /></div>
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className="detail-img"
                onError={(e) => { e.currentTarget.style.opacity = '0'; }}
              />
              <div className="detail-img-overlay"></div>
            </div>
            <div className="detail-content">
              <div className="detail-header">
                <h3 className="detail-name">{selectedItem.name}</h3>
                <span className="detail-price">{selectedItem.price}</span>
              </div>
              <p className="detail-desc">{selectedItem.desc}</p>
              <div className="detail-nutrition">
                <div className="nutrition-item"><span className="nutrition-val">{selectedItem.protein}</span><span className="nutrition-label">Protein</span></div>
                <div className="nutrition-item"><span className="nutrition-val">{selectedItem.calories}</span><span className="nutrition-label">Calories</span></div>
                <div className="nutrition-item"><span className="nutrition-val">{selectedItem.carbs}</span><span className="nutrition-label">Carbs</span></div>
              </div>
              <div className="detail-ingredients-section">
                <h4 className="detail-section-title">Ingredients</h4>
                <div className="detail-ingredients-list">
                  {selectedItem.ingredients.map((ing, i) => (<span key={i} className="ingredient-tag">{ing}</span>))}
                </div>
              </div>
              <button className="detail-order-btn" onClick={() => addToCart(selectedItem, true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Place Order <CartIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
