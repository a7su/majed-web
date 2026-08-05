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
          {/* Sleek, thin, elegant dark graphite pencil */}
          <svg width="24" height="100" viewBox="0 0 24 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '-12px', marginTop: '-96px' }}>
            {/* Main body (sleek dark grey/black) */}
            <path d="M8 8L8 76L16 76L16 8Z" fill="#222" />
            <path d="M6 8L6 76L8 76L8 8Z" fill="#111" />
            <path d="M16 8L16 76L18 76L18 8Z" fill="#333" />
            
            {/* Wooden cone (sharpened part) - subtle tone */}
            <path d="M6 76L12 94L18 76H6Z" fill="#D2B48C" />
            <path d="M12 76L12 94L18 76H12Z" fill="#C1A27A" />
            
            {/* Pencil Tip (Graphite/Charcoal) */}
            <path d="M10 88L12 96L14 88H10Z" fill={tipColor} style={{ transition: 'fill 0.3s ease' }} />
            
            {/* Elegant metal ferrule */}
            <rect x="5.5" y="10" width="13" height="4" fill="#888" />
            <rect x="5.5" y="15" width="13" height="1" fill="#666" />
            <rect x="5.5" y="17" width="13" height="5" fill="#999" />
            
            {/* Eraser (sleek dark red or black) */}
            <path d="M6 0H18V10H6V0Z" fill="#2C2C2C" />
            
            {/* Specular highlight for premium glossy finish */}
            <rect x="9" y="12" width="1.5" height="60" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>
    </>
  );
}
