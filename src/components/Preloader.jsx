import React, { useEffect, useState, useRef } from 'react';

const SKETCHES = [
  '/images/sketches/sketch_batman.jpg',
  '/images/sketches/sketch_abdel_halim.jpg',
  '/images/sketches/sketch_um_kulthum.jpg',
  '/images/sketches/sketch_cowboy.jpg',
  '/images/sketches/sketch_couple.jpg',
];

export default function Preloader({ onComplete }) {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activePage, setActivePage] = useState(0);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Progress counter smoothly reaching 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 35);

    // Flip pages sequentially
    const pageFlipInterval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % SKETCHES.length);
    }, 320);

    // Smooth exit after 1.2s max (prevents hanging white screen on mobile)
    const exitTimer = setTimeout(() => {
      setHidden(true);
      clearInterval(interval);
      clearInterval(pageFlipInterval);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(pageFlipInterval);
      clearTimeout(exitTimer);
    };
  }, []);

  const pageStyle = (index) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformOrigin: 'left center',
    backfaceVisibility: 'hidden',
    transition: `transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) ${index * 0.04}s`,
    transform: activePage > index ? 'rotateY(-180deg)' : 'rotateY(0deg)',
    backgroundColor: '#FAF8F5',
    borderRight: '1px solid rgba(160, 86, 40, 0.15)',
    borderRadius: '0 4px 4px 0',
    boxShadow: activePage > index
      ? '4px 0 12px rgba(0,0,0,0.08)'
      : '-4px 0 12px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '6px',
    zIndex: SKETCHES.length - index
  });

  return (
    <div
      id="preloader"
      className={hidden ? 'preloader-hidden' : ''}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FAFAF8',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.8s cubic-bezier(0.77, 0, 0.175, 1), visibility 0.8s',
        willChange: 'opacity, visibility'
      }}
    >
      {/* Book Flipping Animation with Real Sketches */}
      <div style={{
        perspective: '1400px',
        width: '210px',
        height: '280px',
        position: 'relative',
        marginBottom: '2.5rem'
      }}>
        {/* Book spine / back cover */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#EDE8E3',
          borderRadius: '4px',
          boxShadow: '0 25px 60px rgba(67, 40, 24, 0.16), 0 10px 24px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.4 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '0.9rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              Majed Alnahdi<br />Sketchbook
            </div>
          </div>
        </div>

        {/* Flipping pages showcasing actual sketch drawings */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}>
          {SKETCHES.map((src, i) => (
            <div key={i} style={pageStyle(i)}>
              <img
                src={src}
                alt={`Sketch Page ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Headline & Artist Name */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '2.5rem',
          fontWeight: 300,
          letterSpacing: '0.04em',
          color: 'var(--text-main)',
          lineHeight: 1.1,
          marginBottom: '0.4rem'
        }}>
          Majed Alnahdi
        </h1>
        <p style={{
          fontFamily: "'PalestineFont', serif",
          fontSize: '1.4rem',
          fontWeight: 400,
          color: 'var(--color-brand)',
          marginBottom: '0.4rem'
        }}>
          ماجد النهدي
        </p>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)'
        }}>
          Sketchbook & Fine Art
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '200px',
        height: '2px',
        backgroundColor: 'rgba(160, 86, 40, 0.15)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '0.6rem'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--color-brand)',
          transition: 'width 0.1s linear'
        }} />
      </div>

      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        color: 'var(--text-subtle)'
      }}>
        {progress}%
      </span>
    </div>
  );
}
