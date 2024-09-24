import React from 'react';
import './SpecialOffers.css'; // Make sure to create the corresponding CSS file for styling

const offers = [
  {
    id: 1,
    title: 'Winter Sale',
    description: 'Up to 50% off on select items!',
    image: 'path_to_image1.jpg', // Update with the actual image path
    countdown: '2d 5h 30m'
  },
  // Add more offers as needed
];

const SpecialOffers = () => {
  return (
    <div className="special-offers-section">
      <h2>Special Offers</h2>
      <div className="offers-container">
        {offers.map(offer => (
          <div key={offer.id} className="offer-card">
            <img src={offer.image} alt={offer.title} className="offer-image" />
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <p className="countdown-timer">{offer.countdown}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
