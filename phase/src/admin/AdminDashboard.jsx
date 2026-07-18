import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Toast, { useToast } from './components/Toast';
import './adminTheme.css';

// Lazy loaded page sections
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import MenuPage from './pages/MenuPage';
import BranchesPage from './pages/BranchesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReviewsPage from './pages/ReviewsPage';
import CouponsPage from './pages/CouponsPage';
import StaffAccountsPage from './pages/StaffAccountsPage';

const AdminDashboard = ({ onExit }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState(() => localStorage.getItem('angaar_admin_theme') || 'dark');
  const { toasts, addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-admin-theme', theme);
    localStorage.setItem('angaar_admin_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (isMobile) setMobileSidebarOpen(false);
  };

  // Render correct page view
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':    return <DashboardPage onNavigate={setActiveSection} />;
      case 'orders':       return <OrdersPage toast={addToast} />;
      case 'customers':    return <CustomersPage toast={addToast} />;
      case 'menu':         return <MenuPage toast={addToast} />;
      case 'branches':     return <BranchesPage />;
      case 'analytics':    return <AnalyticsPage />;
      case 'reviews':      return <ReviewsPage toast={addToast} />;
      case 'coupons':      return <CouponsPage toast={addToast} />;
      case 'staffaccounts':return <StaffAccountsPage toast={addToast} />;
      default:             return <DashboardPage onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="admin-root">
      {/* Mobile backdrop */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={isMobile ? false : sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`admin-main ${!isMobile && sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Navbar */}
        <TopBar
          collapsed={isMobile ? false : sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          activeSection={activeSection}
          theme={theme}
          onToggleTheme={toggleTheme}
          onExit={onExit}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Render Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default AdminDashboard;
