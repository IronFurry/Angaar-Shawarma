import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ icon, label, value, prefix = '', suffix = '', trend, trendValue, color = 'var(--admin-primary)', colorSoft, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numVal = parseFloat(String(value).replace(/,/g, ''));
    if (isNaN(numVal)) { setDisplayValue(value); return; }
    let start = 0;
    const duration = 1200;
    const steps = 60;
    const increment = numVal / steps;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += increment;
        if (start >= numVal) { setDisplayValue(numVal); clearInterval(interval); }
        else setDisplayValue(start);
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 120);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatVal = (v) => {
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
    if (isNaN(n)) return v;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    if (String(value).includes('.')) return n.toFixed(1);
    return Math.round(n).toLocaleString('en-IN');
  };

  return (
    <motion.div
      className="admin-kpi-card"
      style={{ '--kpi-color': color, '--kpi-color-soft': colorSoft || `${color}20` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
    >
      <div className="admin-kpi-header">
        <div className="admin-kpi-icon">{icon}</div>
        {trend !== undefined && (
          <div className={`admin-kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trendValue || trend)}%
          </div>
        )}
      </div>
      <div className="admin-kpi-value">{prefix}{formatVal(displayValue)}{suffix}</div>
      <div className="admin-kpi-label">{label}</div>
    </motion.div>
  );
};

export default KPICard;
