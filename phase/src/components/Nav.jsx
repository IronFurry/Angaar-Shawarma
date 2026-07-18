import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo.png";

const Nav = ({ activeView, onViewChange, cartCount, onStaffAccess }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tapCount   = useRef(0);
  const tapTimer   = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  // Lock body scroll when menu is open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (sectionId) => {
    setMenuOpen(false);
    if (sectionId === 'reviews-board') {
      onViewChange('reviews');
      return;
    }
    onViewChange('home');
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Secret tap handler — 7 taps within 4 seconds → staff mode
  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      onStaffAccess?.();
      return true;
    } else {
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 4000);
      return false;
    }
  };

  const navLinks = [
    { id: 'hero',         label: 'Home' },
    { id: 'reviews-board', label: 'Reviews' },
    { id: 'menu',         label: 'Menu' },
    { id: 'location',     label: 'Branches' },
  ];

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div
          className="nav-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const isStaffAccessTriggered = handleLogoTap();
            if (!isStaffAccessTriggered) handleNavClick('hero');
          }}
        >
          <img src={logo} alt="Angaar Shawarma Logo" />
          <span className="en">SHAWARMA</span>
        </div>

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`nav-link-btn ${activeView === 'home' && id === 'hero' ? 'active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className={`nav-order nav-order-desktop ${activeView === 'order' ? 'active' : ''}`}
          onClick={() => onViewChange('order')}
        >
          Order Now {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </button>

        {/* Mobile: hamburger + cart */}
        <div className="nav-mobile-actions">
          {cartCount > 0 && (
            <button
              className="nav-order nav-order-mobile"
              onClick={() => { setMenuOpen(false); onViewChange('order'); }}
            >
              🛒 <span className="nav-cart-badge">{cartCount}</span>
            </button>
          )}
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={`nav-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-drawer-brand">
          <img src={logo} alt="Angaar" className="nav-drawer-logo" />
          <span className="nav-drawer-name">ANGAAR<br /><small>SHAWARMA</small></span>
        </div>
        <ul className="nav-drawer-links">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <button
                className="nav-drawer-link"
                onClick={() => handleNavClick(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="nav-drawer-order"
          onClick={() => { setMenuOpen(false); onViewChange('order'); }}
        >
          Order Now {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </button>
      </div>
    </>
  );
};

export default Nav;
