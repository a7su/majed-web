import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [isTouch, setIsTouch] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const textEl = textRef.current;
    if (!cursor || !textEl) return;

    let rafId = null;
    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        textEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      });
    };
    
    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);

    // Interactive hover detection
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const floatingObj = target.closest('.floating-obj');
      if (floatingObj) {
        setIsHovering(true);
        setHoverType('drag');
        setCursorText(isAr ? 'اسحب' : 'DRAG');
        return;
      }

      const galleryItem = target.closest('.gallery-item') || target.closest('.coverflow-item');
      if (galleryItem) {
        setIsHovering(true);
        setHoverType('view');
        setCursorText(isAr ? 'عرض' : 'VIEW');
        return;
      }

      const interactive = target.tagName?.toLowerCase() === 'button' || 
                         target.tagName?.toLowerCase() === 'a' ||
                         target.closest('button') || 
                         target.closest('a') ||
                         target.closest('.link-hover-line') ||
                         target.closest('.hamburger-btn') ||
                         target.closest('.btn-primary') ||
                         target.closest('.btn-outline') ||
                         target.closest('.btn-brand');

      if (interactive) {
        setIsHovering(true);
        setHoverType('button');
        setCursorText('');
        return;
      }

      // If moving to a non-interactive element, clear hover state
      setIsHovering(false);
      setHoverType(null);
      setCursorText('');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isAr]);

  if (isTouch) return null;

  // Determine pencil rotation and state
  let pencilRotation = -145; // Default sleek angle
  let pencilScale = 1;
  let tipColor = '#111'; // Dark charcoal tip
  
  if (isDragging) {
    pencilRotation = -110; 
    pencilScale = 0.95;
    tipColor = 'var(--color-brand)';
  } else if (isHovering) {
    if (hoverType === 'button') {
      pencilRotation = -125; // tilts down 
      pencilScale = 1.05;
      tipColor = 'var(--color-brand)';
    } else if (hoverType === 'drag') {
      pencilRotation = -165; 
      pencilScale = 1.05;
    } else if (hoverType === 'view') {
      pencilRotation = -145;
      pencilScale = 1.05;
      tipColor = 'var(--color-brand)';
    }
  }

  return (
    <>
      {/* ─── Trailing Magnetic Circle & Text ─── */}
      <div
        ref={textRef}
        style={{
          position: 'fixed',
          top: -30,
          left: -30,
          width: 60,
          height: 60,
          border: isHovering && hoverType !== 'button' ? 'none' : 
                 hoverType === 'button' ? '1px solid var(--color-brand)' : '1px solid rgba(160,86,40,0.3)',
          backgroundColor: cursorText ? 'var(--color-brand)' : 
                          hoverType === 'button' ? 'rgba(160,86,40,0.05)' : 'transparent',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          willChange: 'transform, width, height, top, left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: cursorText ? 'blur(4px)' : 'none',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), top 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, transform 0.1s linear',
          
          ...(cursorText ? {
            width: 72,
            height: 72,
            top: -36,
            left: -36,
          } : hoverType === 'button' ? {
            width: 44,
            height: 44,
            top: -22,
            left: -22,
          } : {}),
          
          ...(isDragging && hoverType === 'drag' ? {
            transform: 'scale(0.85)',
            backgroundColor: 'var(--color-brand-dark)',
          } : {})
        }}
      >
        <span style={{
          fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: '#FFFFFF',
          opacity: cursorText ? 1 : 0,
          transition: 'opacity 0.2s ease',
          transform: `scale(${cursorText ? 1 : 0.5})`,
          transitionDuration: '0.3s',
        }}>
          {cursorText}
        </span>
      </div>

      {/* ─── The Interactive Pencil ─── */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999999,
          willChange: 'transform',
        }}
      >
        <div style={{
          transform: `rotate(${pencilRotation}deg) scale(${pencilScale})`,
          transformOrigin: '0px 0px', // Exact pivot around the tip at (0,0)
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
          filter: hoverType === 'button' ? 'drop-shadow(0 0 10px rgba(160,86,40,0.6))' : 
                  isDragging ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' :
                  'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
        }}>
          {/* Museum-Grade Fine Art Charcoal Pencil */}
          <svg width="28" height="110" viewBox="0 0 28 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '-14px', marginTop: '-106px' }}>
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2D1B10" />
                <stop offset="35%" stopColor="#432818" />
                <stop offset="70%" stopColor="#6E4021" />
                <stop offset="100%" stopColor="#1A0D07" />
              </linearGradient>
              <linearGradient id="goldFerrule" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#B38B46" />
                <stop offset="50%" stopColor="#E6C875" />
                <stop offset="100%" stopColor="#967232" />
              </linearGradient>
              <linearGradient id="woodTone" x1="0" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D8BC93" />
                <stop offset="50%" stopColor="#F0DCB8" />
                <stop offset="100%" stopColor="#C4A577" />
              </linearGradient>
            </defs>

            {/* Eraser Top (Terracotta Accent) */}
            <path d="M8 0C8 0 8 2 8 4C8 8 10 10 14 10C18 10 20 8 20 4C20 2 20 0 20 0H8Z" fill="#A05628" />

            {/* Gold Metallic Ferrule */}
            <rect x="7" y="10" width="14" height="12" rx="1" fill="url(#goldFerrule)" />
            <line x1="7" y1="14" x2="21" y2="14" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
            <line x1="7" y1="18" x2="21" y2="18" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />

            {/* Hexagonal Matte Dark Charcoal Body */}
            <rect x="7" y="22" width="14" height="60" fill="url(#bodyGrad)" />
            {/* Hexagonal facet bevel lines */}
            <line x1="11.5" y1="22" x2="11.5" y2="82" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="16.5" y1="22" x2="16.5" y2="82" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

            {/* Gold foil logo accent */}
            <rect x="12" y="35" width="4" height="25" fill="#E6C875" opacity="0.6" rx="0.5" />

            {/* Sharpened Natural Wood Cone */}
            <path d="M7 82L14 102L21 82H7Z" fill="url(#woodTone)" />

            {/* Sharp Graphite / Charcoal Point */}
            <path d="M11.5 95L14 106L16.5 95H11.5Z" fill={tipColor} style={{ transition: 'fill 0.3s ease' }} />
          </svg>
        </div>
      </div>
    </>
  );
}
