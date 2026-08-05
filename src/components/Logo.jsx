import React from 'react';

export default function Logo({ height = 54, className = "", style = {} }) {
  return (
    <img 
      src="/logo.png"
      alt="Majed Alnahdi Logo"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: 'auto',
        maxHeight: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 8px rgba(160, 86, 40, 0.15))',
        transition: 'transform 0.3s var(--ease-smooth), filter 0.3s ease',
        ...style
      }}
      className={`brand-logo-img ${className}`}
    />
  );
}

