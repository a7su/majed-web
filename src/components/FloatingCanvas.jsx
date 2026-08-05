import React from 'react';

export default function FloatingCanvas({ children, delay = 0, className = '' }) {
  return (
    <div 
      className={`floating-canvas ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
