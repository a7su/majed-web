import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import BiographyModal from './BiographyModal';

export default function BiographySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="biography"
      style={{
        width: '100%',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 4vw, 2rem)',
        backgroundColor: '#050505',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column (Cols 1-5 Desktop / 12 Mobile): Studio Portrait */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
          className="biography-portrait-col"
        >
          <style>{`
            @media (min-width: 768px) {
              .biography-portrait-col {
                grid-column: span 5 !important;
              }
              .biography-text-col {
                grid-column: 7 / span 6 !important;
              }
            }
          `}</style>
          
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/4',
              overflow: 'hidden'
            }}
          >
            <img
              src="/images/mock_studio.jpg"
              alt="Majed Alnahdi in studio"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(60%) contrast(1.1)',
                transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1), filter 0.8s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.filter = 'grayscale(20%) contrast(1.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'grayscale(60%) contrast(1.1)';
              }}
            />
            
            {/* Subtle Vignette Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 50%)',
                pointerEvents: 'none'
              }}
            />
            
            <div
              className="font-micro"
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                color: '#EAEAEA',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                background: 'rgba(15, 15, 15, 0.7)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              MAJED ALNAHDI IN STUDIO • RIYADH
            </div>
          </div>
        </div>

        {/* Right Column (Cols 7-12 Desktop / 12 Mobile): Poetic Serif Copy & Action */}
        <div
          style={{
            gridColumn: 'span 12'
          }}
          className="biography-text-col"
        >
          <div
            className="font-micro"
            style={{
              color: '#8A8A8A',
              letterSpacing: '0.25em',
              marginBottom: '1.5rem',
              fontSize: '0.75rem'
            }}
          >
            02 // THE ARTIST & PHILOSOPHY
          </div>

          <blockquote
            className="font-serif"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
              color: '#EAEAEA',
              lineHeight: 1.25,
              fontWeight: 400,
              marginBottom: '2.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            "Translating emotion through the stark reality of black and white. Specializing in charcoal, pen, and pencil drawing, ensuring every shadow is deliberate and every stroke captures a fleeting truth."
          </blockquote>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="btn-secondary"
              style={{
                borderColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)',
                backgroundColor: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.76, 0, 0.24, 1)'
              }}
            >
              <span>READ FULL JOURNEY</span>
              <ArrowRight
                size={14}
                style={{
                  transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)'
                }}
              />
            </button>

            <span className="font-micro" style={{ color: '#8A8A8A', fontSize: '0.7rem' }}>
              INSTAGRAM: <a href="https://instagram.com/m.jn7" target="_blank" rel="noopener noreferrer" style={{ color: '#EAEAEA', textDecoration: 'none' }}>@M.JN7</a>
            </span>
          </div>
        </div>
      </div>

      {/* Biography Modal */}
      <BiographyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
