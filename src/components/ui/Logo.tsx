import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Main circle (representing planet/celestial body) */}
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        
        {/* Orbital ring */}
        <path
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        
        {/* Stars */}
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="18" cy="18" r="1" fill="currentColor" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
      <h1 className="text-2xl font-bold text-primary">
        CelestialMap
      </h1>
    </div>
  );
};

export default Logo;
