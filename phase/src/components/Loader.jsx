import React from 'react';
import logo from "../assets/logo.png";

const Loader = ({ fadeOut }) => {
  const text = "FRESH • FLAME GRILLED • FRESH • FLAME GRILLED • ";
  const characters = text.split("");
  const degreeStep = 360 / characters.length;

  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-container">
        {/* Circular text spinner */}
        <div className="spinner-wrapper">
          <div className="text-ring">
            {characters.map((char, index) => (
              <span
                key={index}
                className="char"
                style={{
                  transform: `rotate(${index * degreeStep}deg) translate(0, -110px)`
                }}
              >
                {char}
              </span>
            ))}
          </div>
          
          {/* Flame Icon in the center */}
          <div className="center-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="url(#flameGradient)">
              <defs>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="60%" stopColor="var(--fire)" />
                  <stop offset="100%" stopColor="var(--gold)" />
                </linearGradient>
              </defs>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
        </div>
        
        {/* Brand name */}
        <div className="loader-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="Angaar" style={{ height: '36px' }} />
          <span className="en">SHAWARMA</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
