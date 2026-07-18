import React, { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Bestsellers from './components/Bestsellers';
import Menu from './components/Menu';
import ReviewsBoard from './components/ReviewsBoard';
import DeliveryBanner from './components/DeliveryBanner';
import Location from './components/Location';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Loader from './components/Loader';
import OrderTab from './components/OrderTab';
import StaffTab from './components/StaffTab';
import MyOrdersWidget from './components/MyOrdersWidget';
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './admin/pages/LoginPage';
import { AuthProvider, useAuth } from './admin/context/AuthContext';

/**
 * AdminLoginGate — renders LoginPage if not authenticated,
 * otherwise renders AdminDashboard. Wrapped in AuthProvider at the App level.
 */
const AdminLoginGate = ({ onExit }) => {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    // Show nothing (or a minimal spinner) while reading localStorage
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f11', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#71717a', fontSize: '14px' }}>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => {/* state update inside AuthContext triggers re-render */}} />;
  }

  return <AdminDashboard onExit={onExit} />;
};

function App() {
  const [loading, setLoading]   = useState(true);
  const [fadeOut, setFadeOut]   = useState(false);
  // activeView: 'home' | 'order' | 'staff' | 'reviews' | 'admin'
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#staff')) return 'staff';
    if (hash === '#order') return 'order';
    if (hash === '#reviews') return 'reviews';
    if (hash === '#admin') return 'admin';
    return 'home';
  });
  
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);

  // ── Seed default coupons ──────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('angaar_coupons')) {
      const defaultCoupons = [
        { id: 'cp1', code: 'ANGAAR20', type: 'Percentage', discount: 20, minOrder: 200, maxUses: 500, used: 247, expiry: '2026-07-31', branch: 'All', active: true },
        { id: 'cp2', code: 'WELCOME50', type: 'Flat', discount: 50, minOrder: 149, maxUses: 1000, used: 823, expiry: '2026-12-31', branch: 'All', active: true },
        { id: 'cp3', code: 'VIRAR10', type: 'Percentage', discount: 10, minOrder: 0, maxUses: 200, used: 134, expiry: '2026-07-15', branch: 'Virar', active: true },
      ];
      localStorage.setItem('angaar_coupons', JSON.stringify(defaultCoupons));
    }
  }, []);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('angaar_cart') || '[]'); }
    catch { return []; }
  });

  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('angaar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!activeToast) return;
    const t = setTimeout(() => setActiveToast(null), 3000);
    return () => clearTimeout(t);
  }, [activeToast]);

  // Keep hash in sync when view changes
  useEffect(() => {
    if (activeView === 'staff') {
      if (!window.location.hash.startsWith('#staff')) {
        window.location.hash = '#staff-vasaigaon';
      }
    } else if (activeView === 'admin') {
      if (window.location.hash !== '#admin') {
        window.location.hash = '#admin';
      }
    } else if (activeView === 'home') {
      if (window.location.hash !== '') {
        // Remove hash without reloading
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      if (window.location.hash !== '#' + activeView) {
        window.location.hash = '#' + activeView;
      }
    }
  }, [activeView]);

  // Listen for browser back/forward and hash changes
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#staff')) {
        setActiveView('staff');
      } else if (hash === '#admin') {
        setActiveView('admin');
      } else if (hash === '#order') {
        if (cart.length === 0 && !activeTrackingOrderId) {
          window.location.hash = '';
          setActiveView('home');
        } else {
          setActiveView('order');
        }
      } else if (hash === '#reviews') {
        setActiveView('reviews');
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [cart.length, activeTrackingOrderId]);

  const addToCart = (item, shouldRedirect = false) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
    // Trigger toast
    setActiveToast(item.name);
    if (shouldRedirect) {
      switchView('order', true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const removeFromCart  = (id) => setCart((p) => p.filter((c) => c.id !== id));
  const updateQuantity  = (id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart((p) => p.map((c) => c.id === id ? { ...c, quantity: qty } : c));
  };
  const clearCart = () => setCart([]);

  const switchView = (view, bypassCartCheck = false) => {
    if (view === 'order' && !bypassCartCheck && cart.length === 0 && !activeTrackingOrderId) {
      if (window.location.hash === '#order') {
        window.location.hash = '';
      }
      setActiveView('home');
      setTimeout(() => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setActiveView(view);
    if (view === 'staff') {
      if (!window.location.hash.startsWith('#staff')) {
        window.location.hash = '#staff-vasaigaon';
      }
    } else if (view === 'admin') {
      if (window.location.hash !== '#admin') {
        window.location.hash = '#admin';
      }
    } else if (view === 'home') {
      if (window.location.hash !== '') {
        window.location.hash = '';
      }
    } else {
      if (window.location.hash !== '#' + view) {
        window.location.hash = '#' + view;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrder = (orderId) => {
    setActiveTrackingOrderId(orderId);
    switchView('order');
  };

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((el) => { if (el.isIntersecting) el.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, [activeView]);

  // ── Secret staff & admin shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + Alt + S = Staff Panel
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        window.location.hash = '#staff-vasaigaon';
        switchView('staff');
      }
      // Ctrl + Shift + Alt + A = Admin Dashboard
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.hash = '#admin';
        switchView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Loader ────────────────────────────────────────────────────────────────
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeOut(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (fadeOut) {
      const t = setTimeout(() => {
        setLoading(false);
        // Small extra tick so the DOM has settled before Hero starts animating
        setTimeout(() => setHeroReady(true), 60);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [fadeOut]);

  // ── Render ────────────────────────────────────────────────────────────────
  const isStaff = activeView === 'staff';
  const isAdmin = activeView === 'admin';

  if (isAdmin) {
    return (
      <AuthProvider>
        <AdminLoginGate onExit={() => switchView('home')} />
      </AuthProvider>
    );
  }

  return (
    <>
      {loading && <Loader fadeOut={fadeOut} />}

      {/* Hide normal nav when in staff mode */}
      {!isStaff && (
        <Nav
          activeView={activeView}
          onViewChange={switchView}
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
          onStaffAccess={() => {
            window.location.hash = '#staff-vasaigaon';
            switchView('staff');
          }}
        />
      )}

      {activeView === 'home' ? (
        <>
          <Hero openCart={() => switchView('order')} heroReady={heroReady} />
          <Bestsellers addToCart={addToCart} />
          <Menu addToCart={addToCart} />
          <ReviewsBoard onSeeAll={() => switchView('reviews')} />
          <DeliveryBanner />
          <Location />
          <FinalCta openCart={() => switchView('order')} />
        </>
      ) : activeView === 'order' ? (
        <OrderTab
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          goToMenu={() => switchView('home')}
          trackingOrderId={activeTrackingOrderId}
          clearTracking={() => setActiveTrackingOrderId(null)}
        />
      ) : activeView === 'reviews' ? (
        <ReviewsBoard isFullScreen={true} onBackToHome={() => switchView('home')} />
      ) : activeView === 'staff' ? (
        <StaffTab onExit={() => switchView('home')} />
      ) : null}

      {!isStaff && <Footer />}

      {/* Floating My Orders Widget */}
      {!isStaff && (
        <MyOrdersWidget onTrackOrder={handleTrackOrder} />
      )}

      {/* Toast Notification */}
      {activeToast && (
        <div className="toast-notification">
          <span className="toast-emoji">🌯</span>
          <span className="toast-text">Added <strong>{activeToast}</strong> to order</span>
        </div>
      )}
    </>
  );
}

export default App;
