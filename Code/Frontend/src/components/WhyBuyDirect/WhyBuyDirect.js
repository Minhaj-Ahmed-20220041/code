import React from 'react';
import './WhyBuyDirect.css';

const WhyBuyDirect = () => {
  return (
    <div className="why-buy-direct">
      <div className="why-buy-item">
        <strong>WHY BUY DIRECT FROM US</strong>
      </div>
      <div className="why-buy-item">
        <i className="fas fa-shipping-fast"></i>
        <p>FREE shipping*</p>
      </div>
      <div className="why-buy-item">
        <i className="fas fa-calendar-alt"></i>
        <p>90-day risk-free trial*</p>
      </div>
      <div className="why-buy-item">
        <i className="fas fa-tags"></i>
        <p>Price match promise*</p>
      </div>
      <div className="why-buy-item">
        <a href="#" className="learn-more">*Learn more</a>
      </div>
    </div>
  );
};

export default WhyBuyDirect;
