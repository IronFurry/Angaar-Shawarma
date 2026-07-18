import React, { useState, useEffect } from 'react';
import { menuData } from '../utils/menuData';
import { getBestsellers } from '../api/orderApi';

// Flatten all menu items for easy lookup by name
const ALL_MENU_ITEMS = [
  ...menuData.shawarma,
  ...menuData.platter,
  ...menuData.salad,
  ...menuData.mocktail,
];

// Default fallback bestsellers (hardcoded top picks)
const FALLBACK_IDS = [
  { id: 1, category: 'shawarma', badge: 'Bestseller' },
  { id: 2, category: 'shawarma', badge: 'Hot Pick' },
  { id: 5, category: 'shawarma', badge: 'Fan Fave' },
  { id: 10, category: 'shawarma', badge: 'Signature' },
];

const BADGES = ['Bestseller', 'Hot Pick', 'Fan Fave', 'Signature'];

const StarIcon = ({ size = 16, color = '#ffd700' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color, display: 'inline-block', verticalAlign: 'middle' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChiliIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ef4444', display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2c-.55 0-1 .45-1 1s.45 1 1 1c1.65 0 3 1.35 3 3 0 .55.45 1 1 1s1-.45 1-1c0-2.76-2.24-5-5-5zm0 8c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);

const FoodIcon = ({ emoji, size = 48 }) => {
  switch (emoji) {
    case '🌯':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff7a1a' }}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case '🧀':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffb703' }}>
          <path d="M14 22V10a2 2 0 0 0-2-2H2" />
          <path d="M20 22V4a2 2 0 0 0-2-2H2" />
          <path d="M2 14h12" />
          <path d="M2 18h16" />
        </svg>
      );
    case '🔥':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ff4500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case '🍽️':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff5400' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
    case '🥗':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70e000' }}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const Bestsellers = ({ addToCart }) => {
  const [addedItems, setAddedItems] = useState({});
  const [bestsellerItems, setBestsellerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestsellers = async () => {
      try {
        const res = await getBestsellers();
        if (res?.success && res.data && res.data.length >= 2) {
          const dbItems = res.data
            .map((dbItem, idx) => {
              const found = ALL_MENU_ITEMS.find(
                m => m.name.toLowerCase() === dbItem.name.toLowerCase()
              );
              if (!found) return null;
              return {
                ...found,
                badge: BADGES[idx] || 'Popular',
                totalSold: dbItem.totalSold,
              };
            })
            .filter(Boolean)
            .slice(0, 4);

          if (dbItems.length >= 2) {
            setBestsellerItems(dbItems);
            setLoading(false);
            return;
          }
        }
        // If we reach here, we successfully connected but database has insufficient data.
        // Silently use the fallback without throwing a console.warn error.
        useStaticFallback();
      } catch (err) {
        console.warn('API Bestsellers fetch failed, falling back to static list:', err.message);
        useStaticFallback();
      }
    };

    const useStaticFallback = () => {
      try {
        const fallback = FALLBACK_IDS.map(({ id, category, badge }) => {
          const list = menuData[category];
          if (!list) return null;
          const found = list.find(item => Number(item.id) === Number(id));
          if (!found) return null;
          return {
            ...found,
            badge,
          };
        }).filter(Boolean);
        setBestsellerItems(fallback);
      } catch (fbErr) {
        console.error('Critical fallback error:', fbErr);
      }
      setLoading(false);
    };

    loadBestsellers();
  }, []);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItems({ ...addedItems, [item.id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const getBtnStyle = (id) => {
    return addedItems[id] ? { background: '#25D366' } : {};
  };

  return (
    <section id="bestsellers">
      <div className="bestsellers-header reveal">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <StarIcon size={14} /> Most Ordered
        </div>
        <h2 className="section-title">The Crowd<br />Favourites</h2>
        <p className="section-sub">From the classic to the legendary. These are the rolls that made Angaar famous.</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', maxWidth: 1100, margin: '0 auto' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: 'var(--card)', borderRadius: 16, height: 280, border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div className="products-grid">
          {bestsellerItems.map((item) => (
            <div className="product-card reveal" key={item.id}>
              <div className="product-badge">{item.badge}</div>
              <div className="product-img-wrap">
                <FoodIcon emoji={item.emoji} size={48} />
                {item.spicy && (
                  <span style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', alignItems: 'center' }}>
                    <ChiliIcon />
                  </span>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{item.name}</div>
                <div className="product-desc">{item.desc}</div>
                {item.totalSold && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    🔥 {item.totalSold} orders
                  </div>
                )}
                <div className="product-footer">
                  <div className="product-price"><span>₹</span>{String(item.price || '').replace('₹', '')}</div>
                  <button 
                    className="add-btn" 
                    style={getBtnStyle(item.id)} 
                    onClick={() => handleAdd(item)}
                  >
                    {addedItems[item.id] ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Bestsellers;
