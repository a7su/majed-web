import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, CheckCircle, Tag, Send } from 'lucide-react';

export default function ArtworkLightboxModal({ artwork, onClose, onInquire }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!artwork) return null;

  const isAvailable = artwork.status === 'Available';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 5, 5, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          backgroundColor: '#0F0F0F',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 10,
            background: 'rgba(5, 5, 5, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#EAEAEA',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Image Container (Left 7 Cols Desktop / 12 Mobile) */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            backgroundColor: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: '350px',
            padding: '2rem'
          }}
          className="lightbox-img-col"
        >
          <style>{`
            @media (min-width: 768px) {
              .lightbox-img-col {
                grid-column: span 7 !important;
                min-height: 550px !important;
              }
              .lightbox-info-col {
                grid-column: span 5 !important;
              }
            }
          `}</style>

          <img
            src={artwork.image_url}
            alt={artwork.title}
            style={{
              maxWidth: '100%',
              maxHeight: isZoomed ? '90vh' : '480px',
              objectFit: 'contain',
              transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              borderRadius: '0.25rem'
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              background: 'rgba(15, 15, 15, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#8A8A8A',
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
            className="font-micro"
          >
            {isZoomed ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
            {isZoomed ? 'ZOOM OUT' : 'CLICK TO ZOOM'}
          </button>
        </div>

        {/* Info Column (Right 5 Cols Desktop / 12 Mobile) */}
        <div
          style={{
            gridColumn: 'span 12',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
          }}
          className="lightbox-info-col"
        >
          <div>
            {/* Status Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isAvailable ? '#22c55e' : '#ef4444',
                  boxShadow: isAvailable ? '0 0 10px #22c55e' : '0 0 10px #ef4444'
                }}
              />
              <span className="font-micro" style={{ color: isAvailable ? '#22c55e' : '#ef4444' }}>
                {artwork.status.toUpperCase()} {isAvailable ? '• ORIGINAL AVAILABLE' : '• PRIVATE COLLECTION'}
              </span>
            </div>

            <h2 className="font-serif" style={{ fontSize: '2.25rem', color: '#EAEAEA', marginBottom: '0.5rem' }}>
              {artwork.title}
            </h2>

            <div className="font-micro" style={{ color: '#8A8A8A', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
              {artwork.medium} • {artwork.size} ({artwork.year})
            </div>

            <p style={{ color: '#8A8A8A', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {artwork.description}
            </p>

            {artwork.price && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-micro" style={{ color: '#8A8A8A', fontSize: '0.65rem', display: 'block' }}>INVESTMENT VALUATION</span>
                <span className="font-serif" style={{ fontSize: '1.5rem', color: '#EAEAEA' }}>{artwork.price}</span>
              </div>
            )}
          </div>

          <div>
            {isAvailable ? (
              <button
                onClick={() => {
                  onClose();
                  onInquire(artwork);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Send size={14} />
                <span>INQUIRE ABOUT THIS PIECE</span>
              </button>
            ) : (
              <div className="font-micro" style={{ color: '#8A8A8A', textAlign: 'center', fontSize: '0.7rem' }}>
                THIS ORIGINAL WORKS HAS BEEN ACQUIRED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
