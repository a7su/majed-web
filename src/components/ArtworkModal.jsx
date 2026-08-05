import React, { useState, useEffect } from 'react';

export default function ArtworkModal({ artwork, onClose, onInquire }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!artwork) return null;

  const isAvailable = artwork.status === 'Available' || artwork.status === 'Disponible';
  const artworkImage = artwork.image || artwork.image_url || artwork.src;
  const artworkDimensions = artwork.dimensions || artwork.size || 'Original Studio Piece';
  const artworkTechnique = artwork.technique || artwork.medium || artwork.category || 'Charcoal & Fine Art';

  // Antigravity Touch Floating Card Layout for Phones & iPads
  if (isMobile) {
    return (
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 3400,
          transition: 'opacity 0.4s ease'
        }}
      >
        <div 
          className="antigravity-info-card is-visible"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '14px',
              right: '16px',
              border: 'none',
              background: 'transparent',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#444444'
            }}
          >
            ✕
          </button>

          {/* Floating Image Preview */}
          <div style={{ width: '100%', height: '170px', overflow: 'hidden', borderRadius: '10px', marginBottom: '1.2rem', backgroundColor: '#F0ECE8' }}>
            <img 
              src={artworkImage} 
              alt={artwork.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Minimal Monochrome Info */}
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777777', marginBottom: '0.3rem' }}>
            {artwork.year || '2024'} · {artworkDimensions}
          </div>

          <h3 dir="auto" style={{ fontFamily: "var(--font-arabic-display)", fontSize: '1.5rem', fontWeight: 300, color: '#111111', lineHeight: 1.2, marginBottom: '0.4rem', textAlign: 'start' }}>
            {artwork.titleAr || artwork.title}
          </h3>

          <p style={{ fontSize: '0.78rem', color: '#555555', marginBottom: '1.4rem', lineHeight: 1.4 }}>
            {artworkTechnique}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isAvailable ? '#2e7d32' : '#888888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {isAvailable ? 'Available' : 'Private Collection'}
            </span>

            <button 
              onClick={() => {
                onClose();
                if (onInquire) onInquire(artwork);
              }}
              style={{
                background: '#111111',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.6rem 1.4rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Inquire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="modal-overlay active modal-animate-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        zIndex: 3000,
        display: 'block',
        overflowY: 'auto'
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed',
          top: '30px',
          right: '40px',
          fontSize: '13px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 3100,
          backgroundColor: '#FFFFFF',
          padding: '8px 18px',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          color: 'var(--text-main)',
          fontFamily: "var(--font-display)"
        }}
      >
        ✕ Close
      </button>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
          minHeight: '100vh'
        }}
      >
        {/* Left Column: Fiche Technique / Specs */}
        <div 
          style={{
            padding: '100px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid var(--border-subtle)'
          }}
        >
          <div 
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--color-brand)',
              marginBottom: '20px',
              fontWeight: 600,
              fontFamily: "var(--font-display)"
            }}
          >
            Technical Sheet / Fiche Technique
          </div>

          <h2 
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '42px',
              fontWeight: 400,
              marginBottom: '20px',
              color: 'var(--text-main)',
              lineHeight: 1.15
            }}
          >
            {artwork.title}
          </h2>

          {/* Details Table */}
          <table 
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '25px 0'
            }}
          >
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 0', fontSize: '14px', color: 'var(--text-muted)', width: '35%', fontFamily: 'var(--font-sans)' }}>Year</td>
                <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>{artwork.year || '2024'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 0', fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Dimensions</td>
                <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>{artworkDimensions}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 0', fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Technique / Medium</td>
                <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>{artworkTechnique}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 0', fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Status</td>
                <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: 600, color: isAvailable ? '#2e7d32' : '#c62828', fontFamily: 'var(--font-sans)' }}>
                  {isAvailable ? 'Available' : 'Sold (Private Collection)'}
                </td>
              </tr>
              {artwork.price && (
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px 0', fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Price</td>
                  <td style={{ padding: '14px 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-brand)', fontFamily: 'var(--font-sans)' }}>{artwork.price}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tonalite & Intentions Quote */}
          {artwork.tonalite && (
            <div 
              style={{
                marginTop: '25px',
                paddingTop: '25px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <h4 
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  fontFamily: "var(--font-display)"
                }}
              >
                Tonality & Artistic Intentions
              </h4>
              <p 
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '20px',
                  fontStyle: 'italic',
                  color: '#333333',
                  lineHeight: '1.6'
                }}
              >
                “{artwork.tonalite}”
              </p>
            </div>
          )}

          {/* Action Button */}
          <div style={{ marginTop: '35px', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                onClose();
                if (onInquire) onInquire(artwork);
              }}
              style={{
                background: 'var(--color-brand)',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '9999px',
                fontFamily: "var(--font-display)",
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease'
              }}
            >
              Acquisition Inquiry →
            </button>
            <span className="btn-arabic-badge" style={{ background: 'var(--color-brand-light)', border: '1px solid var(--color-brand-border)', color: 'var(--color-brand)', padding: '0.45rem 1rem', borderRadius: '9999px', fontWeight: 600 }}>
              طلب استفسار عن العمل
            </span>
          </div>
        </div>

        {/* Right Column: Artwork Display */}
        <div 
          style={{
            backgroundColor: '#FAF8F5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px'
          }}
        >
          <img 
            src={artworkImage} 
            alt={artwork.title}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
              borderRadius: '2px'
            }}
          />
        </div>
      </div>
    </div>
  );
}

