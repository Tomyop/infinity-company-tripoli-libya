import { useState, useEffect } from 'react';

const AdBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    '/1-install.png',
    '/2-install.png',
    '/3-install.png',
    '/4-install.png',
    '/5-install.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        width: '100%',
        height: '150px',
        overflow: 'hidden',
        borderRadius: '16px',
        position: 'relative',
        background: '#2a0d4d'
      }}
    >
      {images.map((image, index) => {
        const isFullWidthImage = image === '/4-install.png' || image === '/5-install.png';
        return (
          <img
            key={index}
            src={image}
            alt={`Advertisement ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: isFullWidthImage ? 'cover' : 'contain',
              objectPosition: isFullWidthImage ? 'center' : 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              padding: isFullWidthImage ? '0' : '0'
            }}
          />
        );
      })}
      
      {/* Dots indicator */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px'
      }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: currentSlide === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
      
          </div>
  );
};

export default AdBanner;
