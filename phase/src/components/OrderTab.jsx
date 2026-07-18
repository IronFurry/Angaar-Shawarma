import React, { useState, useEffect, useMemo } from 'react';
import { createOrder,getOrderById } from '../api/orderApi';
import logo from "../assets/logo.png";

// ── Constants ─────────────────────────────────────────────────────────────────
const BRANCH_PHONES = {
  "Vasai Gaon Outlet (Main Branch)": "+91 87666 84117",
  "Vasai West Outlet (Angaar Shawarma 2.0)": "+91 87666 84117",
  "Nallasopara Outlet": "+91 87666 84117",
  "Virar Outlet": "+91 87666 84117",
};

const BRANCH_ADDRESSES = {
  "Vasai Gaon Outlet (Main Branch)":
    "Johny Cross Lane, Small Carpentry, Garwadi, Tamtalao, Vasai West, Maharashtra 401207",
  "Vasai West Outlet (Angaar Shawarma 2.0)":
    "Shop No. 3, Gulmohar Apartment, Ambadi Road, Opposite Akshaya Bar and Restaurant, Panchavati, Vasai West, Maharashtra 401202",
  "Nallasopara Outlet":
    "Shop No. 07, Vrindavan Garden, Near D-Mart, Below One Rep Max Gym, Nallasopara East, Maharashtra 401209",
  "Virar Outlet":
    "Shop No. 8, Ashoka Building CHSL, Jakat Naka, Bolinj Road, Below Kalpataru Hospital, Virar West, Maharashtra 401303",
};

// SVG components to replace emojis
const CartIcon = ({ size = 20, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', ...style }}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ClockIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FlameIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const BellIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const PinIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const SuccessIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const FoodIcon = ({ emoji, size = 18 }) => {
  switch (emoji) {
    case '🌯':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff7a1a', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case '🧀':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffb703', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M14 22V10a2 2 0 0 0-2-2H2" />
          <path d="M20 22V4a2 2 0 0 0-2-2H2" />
          <path d="M2 14h12" />
          <path d="M2 18h16" />
        </svg>
      );
    case '🍽️':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff5400', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
    case '🥗':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70e000', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6" />
        </svg>
      );
    case '🥤':
    case '🍹':
    case '🍉':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#06d6a0', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <path d="M18 22H6L4 6h16l-2 16z" />
          <path d="M12 6V1M12 1h4" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const STATUS_PIPELINE = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];
const STATUS_META = {
  Pending: { icon: <ClockIcon color="#f59e0b" />, label: 'Order Received', color: '#f59e0b', desc: 'Your order has been placed and is waiting for kitchen confirmation.' },
  Confirmed: { icon: <CheckIcon color="#3b82f6" />, label: 'Confirmed', color: '#3b82f6', desc: 'Great! The kitchen has confirmed your order.' },
  Preparing: { icon: <FlameIcon color="#ff7a1a" />, label: 'Being Prepared', color: '#ff7a1a', desc: 'Our chefs are flame-grilling your food right now!' },
  Ready: { icon: <BellIcon color="#10b981" />, label: 'Ready', color: '#10b981', desc: 'Your order is ready! Out for delivery / ready for pick-up.' },
  Delivered: { icon: <CheckIcon color="#6b7280" />, label: 'Delivered', color: '#6b7280', desc: 'Enjoy your meal! Thank you for choosing Angaar Shawarma.' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getNumericPrice = (priceStr) =>
  parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;

const generateBillNo = () =>
  `AN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

const saveOrder = (order) => {
  try {
    const existing = JSON.parse(localStorage.getItem('angaar_orders') || '[]');
    localStorage.setItem('angaar_orders', JSON.stringify([order, ...existing]));
  } catch (e) {
    console.warn('Could not save order', e);
  }
};

// ── Order Tracker component ───────────────────────────────────────────────────
const OrderTracker = ({ orderId, billNo, onNewOrder }) => {
  const [order, setOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [downloading, setDownloading] = useState(false);

  useEffect(()=>{
    const fetchOrder = async()=>{
      try{
        const result = await getOrderById(orderId)

        if(result.success){
          setOrder(result.data)
        }
      }
      catch(error){
        console.error(error)
      }
    }
    fetchOrder();
    const interval = setInterval(fetchOrder,60000);
    return ()=> clearInterval(interval)
  },[orderId])
  // // Poll localStorage every 5 s for status updates from staff
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setOrder(getOrderById(orderId));
  //   }, 5000);
  //   return () => clearInterval(id);
  // }, [orderId]);

  const handleDownloadImage = () => {
    if (downloading) return;
    setDownloading(true);

    const captureReceipt = () => {
      const element = document.getElementById('printable-receipt');
      if (!element) {
        setDownloading(false);
        return;
      }

      const closeBtn = element.querySelector('.receipt-close-x');
      const actions = element.querySelector('.cr-actions');
      if (closeBtn) closeBtn.style.visibility = 'hidden';
      if (actions) actions.style.visibility = 'hidden';

      window.html2canvas(element, {
        backgroundColor: '#faf8f4',
        scale: 2.5,
        useCORS: true
      }).then(canvas => {
        if (closeBtn) closeBtn.style.visibility = 'visible';
        if (actions) actions.style.visibility = 'visible';

        const link = document.createElement('a');
        link.download = `receipt-${billNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      }).catch(err => {
        console.error(err);
        setDownloading(false);
      });
    };

    if (window.html2canvas) {
      captureReceipt();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = captureReceipt;
      script.onerror = () => {
        alert('Failed to load receipt generator. Try taking a screenshot instead!');
        setDownloading(false);
      };
      document.body.appendChild(script);
    }
  };

  if (!order) return null;

  const currentIdx = STATUS_PIPELINE.indexOf(order.status);

  return (
    <div className="ot-tracker-wrap">
      {/* Confirmation banner */}
      <div className="ot-confirm-banner">
        <div className="ot-confirm-icon" style={{ display: 'flex', justifyContent: 'center' }}>
          <SuccessIcon />
        </div>
        <h2 className="ot-confirm-title" style={{ marginTop: '0.75rem' }}>Order Placed!</h2>
        <p className="ot-confirm-sub">
          Your order <strong>#{billNo}</strong> has been received by <strong>{order.branch}</strong>.
          <br />We'll update the status below in real time.
        </p>
      </div>

      {/* Live status stepper */}
      <div className="ot-stepper">
        {STATUS_PIPELINE.map((s, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          const meta = STATUS_META[s];
          return (
            <div
              key={s}
              className={`ot-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}
            >
              <div
                className="ot-step-icon"
                style={current || done ? { borderColor: meta.color, background: done ? meta.color : 'transparent' } : {}}
              >
                {done ? <CheckIcon color="#fff" /> : meta.icon}
              </div>
              {i < STATUS_PIPELINE.length - 1 && (
                <div className={`ot-step-line ${done ? 'done' : ''}`} />
              )}
              <div className="ot-step-label" style={current ? { color: meta.color } : {}}>
                {meta.label}
              </div>
              {current && (
                <div className="ot-step-desc">{meta.desc}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order summary card */}
      <div className="ot-summary-card">
        <div className="ot-summary-header">
          <span className="ot-summary-bill">#{billNo}</span>
          <span
            className="ot-summary-badge"
            style={{ background: `${STATUS_META[order.status]?.color}1a`, color: STATUS_META[order.status]?.color, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {STATUS_META[order.status]?.icon} {STATUS_META[order.status]?.label}
          </span>
        </div>
        <div className="ot-summary-divider" />
        <div className="ot-summary-items">
          {order.items.map((item, i) => (
            <div className="ot-summary-row" key={i}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FoodIcon emoji={item.emoji} />
                {item.name}
                <span className="ot-qty" style={{ marginLeft: '4px' }}>×{item.quantity}</span>
              </span>
              <span className="ot-price">₹{item.lineTotal}</span>
            </div>
          ))}
        </div>
        <div className="ot-summary-divider dashed" />
        {order.deliveryCharge > 0 && (
          <div className="ot-summary-row muted">
            <span>Delivery</span><span>₹{order.deliveryCharge}</span>
          </div>
        )}
        <div className="ot-summary-row total">
          <span>Total</span><span>₹{order.totalAmount}</span>
        </div>
        <div className="ot-summary-divider" />
        <div className="ot-summary-branch">
          <div className="ot-branch-name" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <PinIcon size={14} color="var(--primary)" /> {order.branch}
          </div>
          <div className="ot-branch-addr">{BRANCH_ADDRESSES[order.branch]}</div>
          <div className="ot-branch-phone" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <PhoneIcon size={14} /> {BRANCH_PHONES[order.branch]}
          </div>
        </div>
      </div>

      <p className="ot-poll-note">Status updates automatically every 5 seconds</p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button className="ot-new-order-btn" style={{ margin: 0 }} onClick={onNewOrder}>
          + Place Another Order
        </button>
        <button
          className="ot-new-order-btn"
          style={{ margin: 0, background: 'var(--primary)', color: '#fff', border: 'none' }}
          onClick={() => setShowReceipt(true)}
        >
          View Receipt 🧾
        </button>
      </div>

      {/* Exciting thermal receipt overlay */}
      {showReceipt && (
        <div className="compact-receipt-overlay" onClick={() => setShowReceipt(false)}>
          <div className="compact-receipt" id="printable-receipt" onClick={(e) => e.stopPropagation()}>
            <button className="receipt-close-x" onClick={() => setShowReceipt(false)}>×</button>
            <div className="cr-header">
              <div className="cr-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <img src={logo} alt="Angaar" style={{ height: '30px' }} />
                <span className="cr-logo-en">SHAWARMA</span>
              </div>
              <p className="cr-tagline">Fire Grilled. Freshly Rolled.</p>
            </div>

            <div className="cr-divider-dots">••••••••••••••••••••••••••••••••</div>

            <div className="cr-meta">
              <div className="cr-meta-row">
                <span>Bill No:</span>
                <span className="cr-meta-val">{order.billNumber}</span>
              </div>
              <div className="cr-meta-row">
                <span>Date/Time:</span>
                <span className="cr-meta-val">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="cr-divider-dashed" />

            <div className="cr-customer">
              <div className="cr-meta-row">
                <span>Customer:</span>
                <span className="cr-meta-val">{order.customerName}</span>
              </div>
              <div className="cr-meta-row">
                <span>Phone:</span>
                <span className="cr-meta-val">{order.phone}</span>
              </div>
              {order.orderType === 'Delivery' && (
                <div className="cr-meta-row cr-address-row">
                  <span>Address:</span>
                  <span className="cr-address">{order.address}</span>
                </div>
              )}
            </div>

            <div className="cr-divider-solid" />

            <div className="cr-items-header">
              <span>Item</span>
              <span>Qty</span>
              <span>Amount</span>
            </div>

            <div className="cr-items">
              {order.items.map((item, i) => (
                <div className="cr-item-row" key={i}>
                  <span className="cr-item-name" style={{ display: 'flex', alignItems: 'center' }}>
                    <FoodIcon emoji={item.emoji} /> {item.name}
                  </span>
                  <span className="cr-item-qty">x{item.quantity}</span>
                  <span className="cr-item-amt">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>

            <div className="cr-divider-dashed" />

            <div className="cr-totals">
              <div className="cr-total-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.deliveryCharge > 0 && (
                <div className="cr-total-row">
                  <span>Delivery Charge:</span>
                  <span>₹{order.deliveryCharge}</span>
                </div>
              )}
              <div className="cr-total-row cr-grand">
                <span>Grand Total:</span>
                <span>₹{order.grandTotal}</span>
              </div>
            </div>

            <div className="cr-divider-solid" />

            <div className="cr-branch">
              <div className="cr-branch-name">{order.branch}</div>
              <div className="cr-branch-address">{BRANCH_ADDRESSES[order.branch]}</div>
              <div className="cr-branch-phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIcon size={14} /> {BRANCH_PHONES[order.branch]}
              </div>
            </div>

            <div className="cr-divider-dots">••••••••••••••••••••••••••••••••</div>

            <div className="cr-footer">
              <p className="cr-footer-brand">ANGAAR SHAWARMA</p>
              <p className="cr-footer-sub">Fire Grilled. Freshly Rolled.</p>
            </div>

            <div className="cr-actions no-print">
              <button
                className="cr-btn-print"
                style={{ width: '100%', gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                onClick={handleDownloadImage}
                disabled={downloading}
              >
                {downloading ? 'Generating...' : 'Download Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main OrderTab ─────────────────────────────────────────────────────────────
const OrderTab = ({ cart, removeFromCart, updateQuantity, clearCart, goToMenu, trackingOrderId, clearTracking }) => {
  const [selectedBranch, setSelectedBranch] = useState(() => localStorage.getItem('checkout_selectedBranch') || "Vasai Gaon Outlet (Main Branch)");
  const [orderType, setOrderType] = useState(() => localStorage.getItem('checkout_orderType') || "Delivery");
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('checkout_customerName') || "");
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('checkout_customerPhone') || "");
  const [customerAddress, setCustomerAddress] = useState(() => localStorage.getItem('checkout_customerAddress') || "");
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [placedBillNo, setPlacedBillNo] = useState(null);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    localStorage.setItem('checkout_selectedBranch', selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    localStorage.setItem('checkout_orderType', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('checkout_customerName', customerName);
  }, [customerName]);

  useEffect(() => {
    localStorage.setItem('checkout_customerPhone', customerPhone);
  }, [customerPhone]);

  useEffect(() => {
    localStorage.setItem('checkout_customerAddress', customerAddress);
  }, [customerAddress]);

  const billNo = useMemo(generateBillNo, []);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + getNumericPrice(item.price) * item.quantity, 0);
  const deliveryCharge = (subtotal >= 500 || orderType === 'Takeaway') ? 0 : 30;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'Percentage') {
      return Math.round((subtotal * parseFloat(appliedCoupon.discount)) / 100);
    } else {
      return parseFloat(appliedCoupon.discount);
    }
  }, [appliedCoupon, subtotal]);

  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    let coupons = [];
    try {
      const saved = localStorage.getItem('angaar_coupons');
      if (saved) {
        coupons = JSON.parse(saved);
      } else {
        coupons = [
          { code: 'ANGAAR20', type: 'Percentage', discount: 20, minOrder: 200, active: true },
          { code: 'WELCOME50', type: 'Flat', discount: 50, minOrder: 149, active: true },
          { code: 'VIRAR10', type: 'Percentage', discount: 10, minOrder: 0, branch: 'Virar', active: true }
        ];
      }
    } catch (e) {
      console.error(e);
    }

    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code!');
      setAppliedCoupon(null);
      return;
    }
    if (!found.active) {
      setCouponError('This coupon is inactive.');
      setAppliedCoupon(null);
      return;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setCouponError(`Minimum order of ₹${found.minOrder} required.`);
      setAppliedCoupon(null);
      return;
    }
    if (found.branch && found.branch !== 'All') {
      const shortBranch = selectedBranch.split(' ')[0]; 
      const couponBranch = found.branch.split(' ')[0];
      if (!shortBranch.toLowerCase().includes(couponBranch.toLowerCase()) && !couponBranch.toLowerCase().includes(shortBranch.toLowerCase())) {
        setCouponError(`Valid only for ${found.branch} branch.`);
        setAppliedCoupon(null);
        return;
      }
    }

    setAppliedCoupon(found);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (orderType === 'Delivery' && (!customerName || !customerAddress || !customerPhone)) {
      alert('Please fill in all delivery details!');
      return;
    }
    if (orderType === 'Takeaway' && (!customerName || !customerPhone)) {
      alert('Please fill in your Name and Phone!');
      return;
    }

    const items = cart.map((item) => ({
      name: item.name,
      emoji: item.emoji || '',
      quantity: item.quantity,
      price: getNumericPrice(item.price),
      lineTotal: getNumericPrice(item.price) * item.quantity,
    }));

    const newOrder = {
      billNumber: billNo,
      customerName,
      phone: customerPhone,
      branch: selectedBranch,
      orderType,
      address: orderType === "Delivery" ? customerAddress : "",
      items,
      subtotal,
      deliveryCharge,
      totalAmount: grandTotal,
      status: "Pending",
    };

    const result = await createOrder(newOrder);

    if (result.success) {
      // Persist this order's _id for the "My Orders" widget in Menu
      try {
        const prev = JSON.parse(localStorage.getItem('angaar_my_orders') || '[]');
        const next = [result.data._id, ...prev.filter(id => id !== result.data._id)].slice(0, 5);
        localStorage.setItem('angaar_my_orders', JSON.stringify(next));
      } catch { /* storage unavailable */ }

      // Clear form from localStorage
      localStorage.removeItem('checkout_customerName');
      localStorage.removeItem('checkout_customerPhone');
      localStorage.removeItem('checkout_customerAddress');
      localStorage.removeItem('checkout_selectedBranch');
      localStorage.removeItem('checkout_orderType');

      // Clear local form state
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");

      setPlacedOrderId(result.data._id);
      setPlacedBillNo(result.data.billNumber);

      clearCart();
    }
      // Order creation failed — show the API's message if available
      setOrderError(result?.message || "Failed to place order. Please try again.");
  };

  // ── If order was placed, show tracker ──────────────────────────────────────
  const activeOrderToTrack = trackingOrderId || placedOrderId;
  
  if (activeOrderToTrack) {
    return (
      <section id="order-dashboard" className="reveal visible">
        <OrderTracker
          orderId={activeOrderToTrack}
          billNo={placedBillNo} // note: this might be null if opened from widget, but tracker fetches the order anyway
          onNewOrder={() => { setPlacedOrderId(null); if(clearTracking) clearTracking(); goToMenu(); }}
        />
      </section>
    );
  }

  // ── Normal checkout flow ───────────────────────────────────────────────────
  return (
    <section id="order-dashboard" className="reveal visible">
      <div className="dashboard-header">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CartIcon /> Cart &amp; Checkout
        </div>
        <h2 className="section-title">Your Order Panel</h2>
        <p className="section-sub">
          Select your branch, fill in your details, and place your order directly into our kitchen.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-graphic" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <FoodIcon emoji="🌯" size={48} />
          </div>
          <h3>Your cart is empty!</h3>
          <p>Add some juicy flame-grilled shawarmas or platters to fire up your order.</p>
          <button className="empty-return-btn" onClick={goToMenu}>
            Browse Our Menu
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* ── Left: Cart Items ── */}
          <div className="dashboard-cart-card">
            <div className="card-header-row">
              <h3>Selected Items ({cart.reduce((acc, i) => acc + i.quantity, 0)})</h3>
              <button className="clear-all-btn" onClick={clearCart}>Clear All</button>
            </div>

            <div className="dashboard-cart-items">
              {cart.map((item) => (
                <div className="dashboard-cart-item" key={item.id}>
                  <div className="item-left" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="item-emoji" style={{ display: 'flex', alignSelf: 'center', marginRight: '6px' }}>
                      <FoodIcon emoji={item.emoji} size={22} />
                    </span>
                    <div>
                      <h4 className="item-name">{item.name}</h4>
                      <span className="item-price">{item.price}</span>
                    </div>
                  </div>
                  <div className="item-right">
                    <div className="item-qty-selector">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="item-total-price">₹{getNumericPrice(item.price) * item.quantity}</span>
                    <button className="item-delete-btn" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-cart-summary">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {orderType === 'Delivery' && (
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
              )}
              {subtotal < 500 && orderType === 'Delivery' && (
                <div className="delivery-upsell-banner">
                  Add <b>₹{500 - subtotal}</b> more to unlock <b>FREE Delivery</b>!
                </div>
              )}

              {/* Coupon input */}
              <div className="summary-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'stretch', padding: '10px 0', borderTop: '1px dashed var(--border)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    style={{
                      flex: 1,
                      textTransform: 'uppercase',
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text)',
                      fontSize: '13px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#ef4444', fontSize: '12px', margin: '2px 0 0' }}>{couponError}</p>}
                {appliedCoupon && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(16,185,129,0.12)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#10b981',
                    fontWeight: '500',
                    marginTop: '4px'
                  }}>
                    <span>🎟️ Applied: <b>{appliedCoupon.code}</b> (-₹{discountAmount})</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        padding: '0 4px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {appliedCoupon && (
                <div className="summary-row" style={{ color: '#10b981' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="summary-row grand-total">
                <span>Grand Total</span><span>₹{grandTotal}</span>
              </div>
            </div>

            <button className="add-more-items-btn" onClick={goToMenu}>← Add More Items</button>
          </div>

          {/* ── Right: Checkout Form ── */}
          <div className="dashboard-checkout-card">
            <h3>Checkout Details</h3>
            <form onSubmit={handlePlaceOrder} className="checkout-form">

              <div className="form-row-grid">
                <div className="form-group-custom">
                  <label>Branch Outlet</label>
                  <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                    <option value="Vasai Gaon Outlet (Main Branch)">Vasai Gaon (Main)</option>
                    <option value="Vasai West Outlet (Angaar Shawarma 2.0)">Vasai West 2.0</option>
                    <option value="Nallasopara Outlet">Nallasopara</option>
                    <option value="Virar Outlet">Virar</option>
                  </select>
                </div>

                <div className="form-group-custom">
                  <label>Order Type</label>
                  <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                    <option value="Delivery">Home Delivery</option>
                    <option value="Takeaway">Takeaway</option>
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group-custom">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-custom">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {orderType === 'Delivery' && (
                <div className="form-group-custom full-width">
                  <label>Delivery Address</label>
                  <textarea
                    placeholder="Building, flat no., street, landmarks..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              )}

              {/* Info box */}
              <div className="checkout-agreement">
                <p>
                  Your order goes directly into our kitchen queue. You'll be able to track the status
                  live after placing -- no app needed.
                </p>
              </div>

              {/* THE main CTA */}
              <button type="submit" className="place-order-fire-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                Place Order <FlameIcon />
              </button>

              <div className="checkout-order-meta">
                <span>Order #{billNo}</span>
                <span>{currentDate} · {currentTime}</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderTab;
