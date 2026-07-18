import React from 'react';
import logo from "../assets/logo.png";

const FlameIcon = ({ size = 16, color = '#ff4500' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const InstIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

const Footer = () => {
  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="amazing-footer">
      <div className="footer-glow"></div>
      
      <div className="footer-grid">
        {/* Brand Block */}
        <div className="footer-col brand-col">
          <div className="footer-brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logo} alt="Angaar" style={{ height: '36px' }} />
            <span className="brand-en">SHAWARMA</span>
            <FlameIcon size={20} color="var(--primary)" />
          </div>
          <p className="footer-brand-desc">
            Serving Vasai-Virar's finest, juiciest flame-grilled shawarmas. Fresh ingredients, signature secret Toum sauce, and freshly rolled daily.
          </p>
          <div className="footer-instagram-grid">
            <span className="insta-grid-title">Follow our Outlets:</span>
            <div className="insta-handles-list">
              <a href="https://www.instagram.com/angaarshawarma.vasai/?hl=en" target="_blank" rel="noreferrer" className="insta-link-item" title="Vasai Gaon Instagram">
                <InstIcon /> <span>Vasai Gaon</span>
              </a>
              <a href="https://www.instagram.com/angaar_shawarma_2.0/" target="_blank" rel="noreferrer" className="insta-link-item" title="Vasai West Instagram">
                <InstIcon /> <span>Vasai West</span>
              </a>
              <a href="https://www.instagram.com/angaarshawarma_nallasopara/" target="_blank" rel="noreferrer" className="insta-link-item" title="Nallasopara Instagram">
                <InstIcon /> <span>Nallasopara</span>
              </a>
              <a href="https://www.instagram.com/angaarshawarma_virar/" target="_blank" rel="noreferrer" className="insta-link-item" title="Virar Instagram">
                <InstIcon /> <span>Virar West</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
            <li><button onClick={() => handleScrollTo('menu')}>Menu</button></li>
            <li><button onClick={() => handleScrollTo('location')}>Branches</button></li>
            <li><button onClick={() => handleScrollTo('reviews-board')}>Reviews</button></li>
          </ul>
        </div>

        {/* Outlets */}
        <div className="footer-col outlets-col">
          <h4 className="footer-col-title">Outlets</h4>
          <ul className="footer-outlets-list">
            <li>
              <span className="footer-outlet-name"><MapPinIcon /> Vasai Gaon</span>
              <span className="footer-outlet-detail">Main Outlet, Tamtalao</span>
            </li>
            <li>
              <span className="footer-outlet-name"><MapPinIcon /> Vasai West</span>
              <span className="footer-outlet-detail">Angaar 2.0, Ambadi Road</span>
            </li>
            <li>
              <span className="footer-outlet-name"><MapPinIcon /> Nallasopara East</span>
              <span className="footer-outlet-detail">Vrindavan Garden, Near D-Mart</span>
            </li>
            <li>
              <span className="footer-outlet-name"><MapPinIcon /> Virar West</span>
              <span className="footer-outlet-detail">Bolinj Road, Kalpataru Hospital</span>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div className="footer-col contact-col">
          <h4 className="footer-col-title">Hours &amp; Support</h4>
          <div className="footer-hours-block">
            <div className="hours-row">
              <span className="hours-label">Daily Outlets:</span>
              <span className="hours-val">5:00 PM – 10:00 PM</span>
            </div>
            <div className="hours-row">
              <span className="hours-label">Support Call:</span>
              <span className="hours-val"><a href="tel:8766684117">8766684117</a></span>
            </div>
          </div>
          <div className="footer-newsletter">
            <span className="newsletter-tag">Flame Grilled Daily</span>
            <p className="newsletter-desc">Drop by to experience the true smoke char char flavor.</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Angaar Shawarma. All rights reserved.
        </p>
        <p className="footer-craft" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          Crafted with <FlameIcon size={14} /> in Vasai, Maharashtra
        </p>
      </div>
    </footer>
  );
};

export default Footer;
