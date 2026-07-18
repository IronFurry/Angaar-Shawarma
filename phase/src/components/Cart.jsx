import React, { useState } from 'react';
import logo from "../assets/logo.png";

const Cart = ({ cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Vasai Gaon Outlet (Main Branch)");
  const [orderType, setOrderType] = useState("Delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to parse price strings like "₹120" to numbers
  const getNumericPrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
  };

  const subtotal = cart.reduce((acc, item) => {
    return acc + (getNumericPrice(item.price) * item.quantity);
  }, 0);

  // Free delivery above ₹500, otherwise ₹30
  const deliveryCharge = (subtotal >= 500 || orderType === "Takeaway") ? 0 : 30;
  const grandTotal = subtotal + deliveryCharge;

  const mockBillNo = `AN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePlaceOrder = () => {
    if (orderType === "Delivery" && (!customerName || !customerAddress || !customerPhone)) {
      alert("Please fill in all customer details for delivery!");
      return;
    }
    if (orderType === "Takeaway" && (!customerName || !customerPhone)) {
      alert("Please fill in your Name and Phone!");
      return;
    }

    // Build WhatsApp message text
    let message = `*🔥 ANGAAR SHAWARMA ORDER * \n`;
    message += `*Bill No:* ${mockBillNo}\n`;
    message += `*Branch:* ${selectedBranch}\n`;
    message += `*Type:* ${orderType}\n`;
    message += `-----------------------------\n`;
    
    cart.forEach(item => {
      message += `• ${item.name} x ${item.quantity} - ₹${getNumericPrice(item.price) * item.quantity}\n`;
    });

    message += `-----------------------------\n`;
    message += `*Subtotal:* ₹${subtotal}\n`;
    if (orderType === "Delivery") {
      message += `*Delivery:* ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}\n`;
    }
    message += `*Grand Total:* ₹${grandTotal}\n\n`;
    
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    if (orderType === "Delivery") {
      message += `Address: ${customerAddress}\n`;
    }

    // WhatsApp URL API
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918766684117?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Floating Cart Button */}
      {!cartOpen && cartCount > 0 && (
        <button className="floating-cart-btn" onClick={() => setCartOpen(true)}>
          <span className="cart-badge-count">{cartCount}</span>
          <span className="cart-btn-icon">🛒</span> View Order
        </button>
      )}

      {/* Cart Slider Overlay */}
      <div className={`cart-drawer-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h3 className="drawer-title">Your Order</h3>
            <button className="drawer-close-btn" onClick={() => setCartOpen(false)}>×</button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-icon">🌯</span>
              <p className="empty-text">Your cart is empty!</p>
              <p className="empty-sub">Add some fire rolls from the menu to get started.</p>
              <button className="empty-browse-btn" onClick={() => setCartOpen(false)}>Browse Menu</button>
            </div>
          ) : (
            <>
              <div className="cart-drawer-items">
                {cart.map((item) => (
                  <div className="cart-drawer-item" key={item.id}>
                    <span className="cart-item-emoji">{item.emoji}</span>
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                    <div className="cart-quantity-controls">
                      <button 
                        className="qty-btn minus" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >-</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button 
                        className="qty-btn plus" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                ))}
              </div>

              <div className="cart-drawer-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {subtotal < 500 && orderType === "Delivery" && (
                  <div className="free-delivery-hint">
                    Add ₹{500 - subtotal} more for <b>FREE Delivery</b>!
                  </div>
                )}

                <div className="cart-summary-row total-row">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>

                <button 
                  className="cart-checkout-btn"
                  onClick={() => {
                    setCartOpen(false);
                    setShowInvoice(true);
                  }}
                >
                  Generate Bill & Checkout 🧾
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal" id="printable-receipt">
            <button className="invoice-close-btn" onClick={() => setShowInvoice(false)}>×</button>
            
            {/* Receipt Content */}
            <div className="receipt-container">
              <div className="receipt-header">
                <div className="receipt-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src={logo} alt="Angaar" style={{ height: '36px' }} />
                  <span className="en">SHAWARMA</span>
                </div>
                <p className="receipt-tagline">Fire Grilled. Freshly Rolled.</p>
                <div className="receipt-meta">
                  <div><b>Bill No:</b> {mockBillNo}</div>
                  <div><b>Date:</b> {currentDate} | <b>Time:</b> {currentTime}</div>
                </div>
              </div>

              {/* Order Settings Form */}
              <div className="receipt-form no-print">
                <h4 className="form-sub-title">Order Settings</h4>
                <div className="form-row-grid">
                  <div className="receipt-form-group">
                    <label>Select Outlet</label>
                    <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                      <option value="Vasai Gaon Outlet (Main Branch)">Vasai Gaon Outlet (Main Branch)</option>
                      <option value="Vasai West Outlet (Angaar Shawarma 2.0)">Vasai West Outlet (Angaar Shawarma 2.0)</option>
                      <option value="Nallasopara Outlet">Nallasopara Outlet</option>
                      <option value="Virar Outlet">Virar Outlet</option>
                    </select>
                  </div>
                  <div className="receipt-form-group">
                    <label>Order Type</label>
                    <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                      <option value="Delivery">Home Delivery</option>
                      <option value="Takeaway">Takeaway / Pick-up</option>
                    </select>
                  </div>
                </div>

                <h4 className="form-sub-title" style={{ marginTop: '1rem' }}>Customer Details</h4>
                <div className="form-row-grid">
                  <div className="receipt-form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="receipt-form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="Your Phone Number" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      required
                    />
                  </div>
                </div>
                
                {orderType === "Delivery" && (
                  <div className="receipt-form-group" style={{ marginTop: '0.5rem' }}>
                    <label>Delivery Address</label>
                    <textarea 
                      placeholder="Enter full delivery address..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={2}
                      required
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Printable Customer Info */}
              <div className="printable-customer-info print-only">
                <div><b>Branch:</b> {selectedBranch}</div>
                <div><b>Order Type:</b> {orderType}</div>
                <div><b>Customer:</b> {customerName} | <b>Phone:</b> {customerPhone}</div>
                {orderType === "Delivery" && <div><b>Address:</b> {customerAddress}</div>}
              </div>

              {/* Items Table */}
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="qty-col">Qty</th>
                    <th className="rate-col">Price</th>
                    <th className="total-col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>{item.emoji} {item.name}</td>
                      <td className="qty-col">{item.quantity}</td>
                      <td className="rate-col">{item.price}</td>
                      <td className="total-col">₹{getNumericPrice(item.price) * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pricing Totals */}
              <div className="receipt-totals">
                <div className="total-row-item">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {orderType === "Delivery" && (
                  <div className="total-row-item">
                    <span>Delivery Charges:</span>
                    <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                  </div>
                )}
                <div className="total-row-item grand-total-row">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for choosing Angaar Shawarma!</p>
                <p className="no-print">Orders are sent straight to our WhatsApp kitchen manager.</p>
              </div>
            </div>

            {/* Receipt Modal Footer Actions */}
            <div className="invoice-actions no-print">
              <button className="invoice-action-btn print" onClick={handlePrint}>
                Print Receipt 🖨️
              </button>
              <button className="invoice-action-btn order" onClick={handlePlaceOrder}>
                Send Order to WhatsApp 💬
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
