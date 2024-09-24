import React from 'react';
import './CustomerTestimonials.css'; // Make sure to create the corresponding CSS file for styling

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    review: 'Amazing products! The quality is top-notch.',
    rating: 5,
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  {
    id: 2,
    name: 'Jane Smith',
    review: 'Great customer service and fast shipping!',
    rating: 4,
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  {
    id: 1,
    name: 'John Doe',
    review: 'Amazing products! The quality is top-notch.',
    rating: 5,
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  {
    id: 2,
    name: 'Jane Smith',
    review: 'Great customer service and fast shipping!',
    rating: 4,
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  
  // Add more testimonials as needed
];

const CustomerTestimonials = () => {
  return (
    <div className="testimonials-section">
      <h2>Customer Testimonials</h2>
      <div className="testimonials-container">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
            <h3>{testimonial.name}</h3>
            <p>{testimonial.review}</p>
            <p className="testimonial-rating">Rating: {testimonial.rating} stars</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
