import React, { useState } from 'react';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselImages = [
    'https://m.media-amazon.com/images/I/51Spk4J18gL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51Spk4J18gL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51Spk4J18gL._AC_SL1500_.jpg'
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  };

  const styles = {
    carousel: {
      position: 'relative',
      width: '100%',
      height: '100vh', // Full viewport height
      overflow: 'hidden',
    },
    carouselInner: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      height: '100%',
    },
    carouselSlide: {
      minWidth: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    button: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      border: 'none',
      color: 'black',
      fontSize: '2rem',
      cursor: 'pointer',
      zIndex: 1,
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    prev: {
      left: '10px',
    },
    next: {
      right: '10px',
    },
    hover: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.1)',
    }
  };

  return (
    <div style={styles.carousel}>
      <div
        style={{
          ...styles.carouselInner,
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {carouselImages.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} style={styles.carouselSlide} />
        ))}
      </div>
      <button
        style={{ ...styles.button, ...styles.prev }}
        onClick={prevSlide}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.hover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        &#10094;
      </button>
      <button
        style={{ ...styles.button, ...styles.next }}
        onClick={nextSlide}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.hover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
