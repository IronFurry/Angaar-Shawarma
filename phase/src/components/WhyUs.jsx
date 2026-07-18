import React from 'react';

const BulbIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
  </svg>
);

const FlameIcon = ({ size = 28, color = "#ff4500" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const SaladIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70e000' }}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6" />
  </svg>
);

const DeliveryIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff7a1a' }}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const WhyUs = () => {
  return (
    <section id="why">
      <div className="why-header reveal">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <BulbIcon /> Why Us
        </div>
        <h2 className="section-title">Why Angaar<br />Hits Different</h2>
        <p className="section-sub">It's not just food. It's the craft behind every roll that makes the difference.</p>
      </div>

      <div className="why-grid">
        <div className="why-card reveal reveal-delay-1">
          <span className="why-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
            <FlameIcon />
          </span>
          <div className="why-title">Flame Grilled</div>
          <p className="why-desc">Every piece of chicken is grilled over open flame. No shortcuts. The char is intentional. The smoke is real.</p>
        </div>
        <div className="why-card reveal reveal-delay-2">
          <span className="why-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
            <SaladIcon />
          </span>
          <div className="why-title">Fresh Every Day</div>
          <p className="why-desc">We source fresh vegetables and marinate chicken daily. Nothing's pre-made, nothing's stale. You taste the difference.</p>
        </div>
        <div className="why-card reveal reveal-delay-3">
          <span className="why-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
            <DeliveryIcon />
          </span>
          <div className="why-title">Fast Delivery</div>
          <p className="why-desc">Hot, rolled, and at your door fast. Free delivery on orders above ₹500. Because cravings don't wait.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
