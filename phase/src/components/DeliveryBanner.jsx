import React from 'react';

const DeliveryBanner = () => {
  return (
    <div id="delivery-banner">
      <div className="banner-strip">
        <div className="banner-text">
          <div className="banner-headline">Free Delivery Above ₹500 🚀</div>
          <div className="banner-sub">Order more, pay less. Simple.</div>
        </div>
        <button 
          className="banner-btn" 
          onClick={() => document.getElementById('final-cta')?.scrollIntoView({behavior: 'smooth'})}
        >
          Order Now →
        </button>
      </div>
    </div>
  );
};

export default DeliveryBanner;
