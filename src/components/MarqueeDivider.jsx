import React from 'react';

export default function MarqueeDivider() {
  const marqueeText = "✦ EXPLORE THE SHADOWS ✦ CHARCOAL, PEN & PENCIL ✦ MASTER THE LIGHT ✦ DRAUGHTSMANSHIP MASTERY ";

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#050505',
        padding: '1.25rem 0',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="animate-marquee">
        <span
          className="font-micro"
          style={{
            fontSize: '0.85rem',
            color: '#8A8A8A',
            letterSpacing: '0.25em',
            whiteSpace: 'nowrap',
            paddingRight: '2rem'
          }}
        >
          {marqueeText.repeat(4)}
        </span>
        <span
          className="font-micro"
          style={{
            fontSize: '0.85rem',
            color: '#8A8A8A',
            letterSpacing: '0.25em',
            whiteSpace: 'nowrap',
            paddingRight: '2rem'
          }}
        >
          {marqueeText.repeat(4)}
        </span>
      </div>
    </div>
  );
}
