import React from 'react';
import './HeroSection.css';
import hero from '../../images/hr.png'

const HeroSection = () => {
  return (
    <div className="hero-section">
      <img src='https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/homepage/images_3x1/aem_hp_panel_SLMPS_johnsummit_1920x640_x2.jpg/jcr:content/renditions/cq5dam.web.1920.1920.jpeg' alt="Explore the Future of Tech" className="hero-image" />
      <div className="hero-text">
        <h1>Run the Vibe</h1>
        <p>Introducing the new speaker that lets DJ and Producer John Summit bring the bass. <br/> SOUNDLINK MAX PORTABLE SPEAKER</p>
        <button className="hero-button">PRE-ORDER</button>
      </div>
      <div className="why-buy-section">
        <div className="why-buy-item">
          <strong>WHY BUY DIRECT FROM US</strong>
        </div>
        <div className="why-buy-item">
          <img src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/24/FFFFFF/external-shipping-logistics-tanah-basah-glyph-tanah-basah.png" alt="Free Shipping" />
          <p>FREE shipping*</p>
        </div>
        <div className="why-buy-item">
          <img src="https://img.icons8.com/ios-glyphs/24/FFFFFF/90-days.png" alt="90-day risk-free trial" />
          <p>90-day risk-free trial*</p>
        </div>
        <div className="why-buy-item">
          <img src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/24/FFFFFF/external-price-tag-ecommerce-tanah-basah-glyph-tanah-basah.png" alt="Price match promise" />
          <p>Price match promise*</p>
        </div>
        <div className="why-buy-item">
          <a href="#" className="learn-more">*Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
