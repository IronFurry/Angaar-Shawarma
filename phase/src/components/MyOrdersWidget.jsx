import React, { useState, useEffect, useCallback } from 'react';
import { getOrderById } from '../api/orderApi';
import logo from "../assets/logo.png";

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

const OrderTicket = ({ order, onTrackOrder }) => {
  const meta = STATUS_META[order.status] || STATUS_META['Pending'];
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="mo-ticket" onClick={() => onTrackOrder(order._id)} style={{ cursor: 'pointer' }}>
      <div className="mo-ticket-body">
        <div className="mo-ticket-header">
          <span className="mo-ticket-brand">ANGAAR</span>
          <span className="mo-ticket-hash">#{order.billNumber}</span>
        </div>

        <div className="mo-ticket-divider-dots" />

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

        <div className="mo-ticket-total-row">
          <span>{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
          <span className="mo-ticket-total-amt">₹{order.totalAmount}</span>
        </div>

        <div className="mo-ticket-meta">
          <span className={`mo-ticket-type ${order.orderType === 'Delivery' ? 'delivery' : 'takeaway'}`}>
            {order.orderType}
          </span>
          <span className="mo-ticket-time">{timeAgo(order.createdAt)}</span>
        </div>

        <div
          className="mo-stamp"
          style={{ '--stamp-color': meta.inkColor, '--stamp-bg': meta.bg }}
        >
          <span className="mo-stamp-text">{meta.label}</span>
        </div>
      </div>
      
      <div className="mo-ticket-actions" style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.08)', background: '#f8efdd' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onTrackOrder(order._id); }} 
          style={{ flex: 1, padding: '0.4rem', fontSize: '0.65rem', fontFamily: "'Courier New', monospace", fontWeight: 'bold', color: '#1d4ed8', border: 'none', borderRight: '1px solid rgba(0,0,0,0.08)', background: 'transparent', cursor: 'pointer' }}
        >
          Track Order
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); order.onViewReceipt(order); }}
          style={{ flex: 1, padding: '0.4rem', fontSize: '0.65rem', fontFamily: "'Courier New', monospace", fontWeight: 'bold', color: '#92400e', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          View Receipt
        </button>
      </div>

      <div className="mo-ticket-tear" />
    </div>
  );
};

const MyOrdersWidget = ({ onTrackOrder }) => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(true);
  const [receiptOrder, setReceiptOrder] = useState(null);

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

      const sorted  = recent.sort((a, b) => {
        const rank = { Pending: 0, Confirmed: 1, Preparing: 2, Ready: 3, Delivered: 4, Cancelled: 5 };
        return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
      });
      setOrders(sorted);
    } catch { }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchMyOrders(); }, [fetchMyOrders]);
  useEffect(() => {
    const id = setInterval(fetchMyOrders, 12000);
    return () => clearInterval(id);
  }, [fetchMyOrders]);

  const ids = JSON.parse(localStorage.getItem('angaar_my_orders') || '[]');
  if (!ids.length) return null; 

  return (
    <>
    <div className="mo-widget mo-floating-widget">
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
                <OrderTicket 
                  key={order._id} 
                  order={{...order, onViewReceipt: setReceiptOrder}} 
                  onTrackOrder={onTrackOrder} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>

    {receiptOrder && (
      <div className="compact-receipt-overlay" onClick={() => setReceiptOrder(null)} style={{ zIndex: 9999 }}>
        <div className="compact-receipt" onClick={(e) => e.stopPropagation()}>
          <button className="receipt-close-x" onClick={() => setReceiptOrder(null)}>×</button>
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
              <span className="cr-meta-val">{receiptOrder.billNumber}</span>
            </div>
            <div className="cr-meta-row">
              <span>Date/Time:</span>
              <span className="cr-meta-val">
                {new Date(receiptOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(receiptOrder.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="cr-divider-dashed" />

          <div className="cr-customer">
            <div className="cr-meta-row">
              <span>Customer:</span>
              <span className="cr-meta-val">{receiptOrder.customerName}</span>
            </div>
            <div className="cr-meta-row">
              <span>Phone:</span>
              <span className="cr-meta-val">{receiptOrder.phone}</span>
            </div>
            {receiptOrder.orderType === 'Delivery' && (
              <div className="cr-meta-row cr-address-row">
                <span>Address:</span>
                <span className="cr-address">{receiptOrder.address}</span>
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
            {receiptOrder.items.map((item, i) => (
              <div className="cr-item-row" key={i}>
                <span className="cr-item-name">{item.name}</span>
                <span className="cr-item-qty">x{item.quantity}</span>
                <span className="cr-item-amt">₹{item.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className="cr-divider-dashed" />

          <div className="cr-totals">
            <div className="cr-total-row">
              <span>Subtotal:</span>
              <span>₹{receiptOrder.subtotal}</span>
            </div>
            {receiptOrder.deliveryCharge > 0 && (
              <div className="cr-total-row">
                <span>Delivery Charge:</span>
                <span>₹{receiptOrder.deliveryCharge}</span>
              </div>
            )}
            <div className="cr-total-row cr-grand">
              <span>Grand Total:</span>
              <span>₹{receiptOrder.totalAmount}</span>
            </div>
          </div>

          <div className="cr-divider-solid" />

          <div className="cr-footer">
            <p className="cr-footer-brand">ANGAAR SHAWARMA</p>
            <p className="cr-footer-sub">Fire Grilled. Freshly Rolled.</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MyOrdersWidget;
