import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ARTWORKS_DATA = [
  {
    id: 'batman',
    title: "The Dark Knight (Batman)",
    titleAr: "فارس الظلام (باتمان)",
    category: "Pencil & Graphite",
    technique: "Graphite Pencil on Paper",
    dimensions: "A3",
    status: "Available",
    year: "2026",
    description: "An extraordinarily detailed graphite portrait of Batman, capturing the dark brooding atmosphere with masterclass pencil shading and contrast.",
    image: "/images/sketches/sketch_batman.jpg",
    extraImages: [],
    delay: 0
  },
  {
    id: 'abdel-halim',
    title: "Abdel Halim Hafez",
    titleAr: "عبد الحليم حافظ",
    category: "Pencil & Graphite",
    technique: "Graphite & Charcoal on Paper",
    dimensions: "A3",
    status: "Available",
    year: "2026",
    description: "A masterful graphite portrait of the Nightingale Abdel Halim Hafez singing with intense passion at the microphone.",
    image: "/images/sketches/sketch_abdel_halim.jpg",
    extraImages: [],
    delay: 0.1
  },
  {
    id: 'umm-kulthum',
    title: "Umm Kulthum",
    titleAr: "أم كلثوم",
    category: "Pencil & Graphite",
    technique: "Graphite Pencil on Paper",
    dimensions: "A3",
    status: "Available",
    year: "2026",
    description: "A breathtaking portrait of the legendary Egyptian icon Umm Kulthum, captured mid-song in pure musical ecstasy.",
    image: "/images/sketches/sketch_um_kulthum.jpg",
    extraImages: [],
    delay: 0.1
  },
  {
    id: 'cowboy',
    title: "The Cowboy & Horse",
    titleAr: "الراعي والجواد",
    category: "Pencil & Graphite",
    technique: "Graphite Pencil on Paper",
    dimensions: "A3",
    status: "Available",
    year: "2026",
    description: "A tender charcoal and pencil study capturing a cowboy under his hat next to his loyal horse.",
    image: "/images/sketches/sketch_cowboy.jpg",
    extraImages: [],
    delay: 0.2
  },
  {
    id: 'couple',
    title: "Eternal Embrace",
    titleAr: "العشاق",
    category: "Pencil & Graphite",
    technique: "Graphite Pencil on Paper",
    dimensions: "A3",
    status: "Available",
    year: "2026",
    description: "A vintage romantic pencil drawing capturing a classic moment of a man lifting his love into his arms.",
    image: "/images/sketches/sketch_couple.jpg",
    extraImages: [],
    delay: 0.2
  },
  {
    id: 'king-abdulaziz',
    title: "King Abdulaziz",
    titleAr: "الملك عبدالعزيز",
    category: "Pencil & Graphite",
    technique: "Graphite Pencil on Paper",
    dimensions: "A4",
    status: "Private Collection",
    year: "2024",
    description: "A masterful graphite portrait of King Abdulaziz bin Abdul Rahman Al Saud, founder of Saudi Arabia.",
    image: "/images/art_king_abdulaziz_1.jpg",
    extraImages: ["/images/art_king_abdulaziz_2.jpg"],
    delay: 0
  },
  {
    id: 'embrace',
    title: "The Embrace",
    titleAr: "العناق",
    category: "Charcoal",
    technique: "Charcoal & Acrylic on Paper",
    dimensions: "A4",
    status: "Available",
    year: "2024",
    description: "A powerful charcoal sketch of two figures embracing, disrupted by bold acrylic strokes.",
    image: "/images/art_embrace.jpg",
    extraImages: [],
    delay: 0.1
  }
];

const CoverflowCarousel = ({ artworks, onSelectArtwork, expandedArtwork, setExpandedArtwork }) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  
  const targetProgressRef = useRef(Math.floor(artworks.length / 2));
  const currentProgressRef = useRef(targetProgressRef.current);
  
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const dragDeltaRef = useRef(0);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, artworks.length);
    targetProgressRef.current = Math.floor(artworks.length / 2);
    currentProgressRef.current = targetProgressRef.current;
  }, [artworks]);

  useEffect(() => {
    let animationFrameId = null;
    let running = false;
    
    const render = () => {
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.12;
      const vw = window.innerWidth || 1000;
      const itemWidth = vw <= 768 ? Math.min(230, vw * 0.6) : 280;
      
      itemsRef.current.forEach((item, index) => {
        if (!item) return;
        const diff = index - currentProgressRef.current;
        const offset = Math.abs(diff);
        const dir = Math.sign(diff);

        item.style.zIndex = Math.round(artworks.length - offset);

        const rotateY = dir * -45 * Math.min(offset, 1);
        const translateZ = 50 - (200 * offset);
        const translateX = dir * (itemWidth * 0.65 * Math.min(offset, 1) + itemWidth * 0.2 * offset);

        item.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
        item.style.opacity = offset > 2.5 ? '0' : Math.max(0, 1 - (offset * 0.15));
        // Skip per-frame blur on phones: it forces constant repaints and causes lag
        item.style.filter = vw <= 768 ? 'none' : (offset < 0.1 ? 'none' : `blur(${Math.min(offset * 2.5, 6)}px)`);
        
        const shadowOpacity = Math.max(0, 0.35 - offset * 0.1);
        const shadowY = Math.max(8, 20 - offset * 12);
        const shadowBlur = Math.max(16, 40 - offset * 25);
        item.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px -12px rgba(0,0,0,${shadowOpacity})`;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Only run the animation loop while the carousel is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        animationFrameId = requestAnimationFrame(render);
      } else if (!entry.isIntersecting && running) {
        running = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    });
    if (containerRef.current) io.observe(containerRef.current);

    return () => {
      io.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [artworks.length]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startProgressRef.current = targetProgressRef.current;
    dragDeltaRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - startXRef.current;
    dragDeltaRef.current = Math.abs(deltaX);
    
    const sensitivity = 3; 
    let newTarget = startProgressRef.current - (deltaX / (window.innerWidth || 1000)) * sensitivity;
    
    if (newTarget < 0) {
      newTarget = newTarget * 0.5;
    } else if (newTarget > artworks.length - 1) {
      newTarget = (artworks.length - 1) + (newTarget - (artworks.length - 1)) * 0.5;
    }
    targetProgressRef.current = newTarget;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    targetProgressRef.current = Math.max(0, Math.min(artworks.length - 1, Math.round(targetProgressRef.current)));
  };

  const handlePointerCancel = (e) => {
    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    targetProgressRef.current = Math.round(currentProgressRef.current);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          perspective: '1200px',
          width: '100%',
          maxWidth: '100vw',
          height: isMobile ? '52vh' : '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          overflow: 'hidden',
          marginBottom: expandedArtwork ? '2rem' : '0'
        }}
      >
        <div 
          style={{
            position: 'relative',
            height: isMobile ? '44vh' : '50vh',
            maxHeight: isMobile ? '420px' : '600px',
            minHeight: isMobile ? '300px' : '400px',
            maxWidth: isMobile ? '78vw' : 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          {artworks.map((artwork, index) => (
            <div 
              key={artwork.id}
              ref={el => itemsRef.current[index] = el}
              onClick={() => {
                if (dragDeltaRef.current > 5) return;
                if (Math.round(targetProgressRef.current) !== index) {
                  targetProgressRef.current = index;
                } else {
                  if (expandedArtwork?.id === artwork.id) {
                    setExpandedArtwork(null);
                  } else {
                    setExpandedArtwork(artwork);
                  }
                }
              }}
              style={{
                position: 'absolute',
                height: '100%',
                width: 'auto',
                aspectRatio: '3/4',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: isDraggingRef.current ? 'grabbing' : 'pointer',
                backgroundColor: '#ffffff',
                userSelect: 'none',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                border: expandedArtwork?.id === artwork.id ? '2px solid var(--text-main)' : '2px solid transparent',
                transition: 'border 0.3s ease'
              }}
            >
              <img 
                src={artwork.image} 
                alt={artwork.title}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '2.5rem 1.5rem 1.5rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                color: 'white',
                pointerEvents: 'none',
                textAlign: 'center'
              }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.75rem', margin: '0 0 0.25rem 0', fontWeight: 400 }}>
                  {artwork.title}
                </h3>
                {artwork.titleAr && (
                  <span style={{ fontFamily: "'PalestineFont', 'Amiri', serif", fontSize: '1rem', color: '#FFF', opacity: 0.9, direction: 'rtl', display: 'block' }}>
                    {artwork.titleAr}
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectArtwork) onSelectArtwork(artwork);
                  }}
                  style={{ 
                    display: 'inline-block', 
                    marginTop: '0.75rem', 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.68rem', 
                    letterSpacing: '0.15em', 
                    textTransform: 'uppercase',
                    border: '1.5px solid rgba(255,255,255,0.7)',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    opacity: Math.round(targetProgressRef.current) === index ? 1 : 0,
                    transition: 'all 0.3s ease',
                    pointerEvents: Math.round(targetProgressRef.current) === index ? 'auto' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand)';
                    e.currentTarget.style.borderColor = 'var(--color-brand)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                  }}
                >
                  {isAr ? 'تفاصيل العمل' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {expandedArtwork && (
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          direction: isAr ? 'rtl' : 'ltr',
          textAlign: isAr ? 'right' : 'left',
          animation: 'fadeIn 0.4s ease-out forwards'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--text-main)',
                marginBottom: '0.5rem'
              }}>
                {expandedArtwork.title}
              </h3>
              {expandedArtwork.titleAr && (
                <span style={{ fontFamily: "'PalestineFont', 'Amiri', serif", fontSize: '1.25rem', color: 'var(--text-muted)', direction: 'rtl', display: 'block' }}>
                  {expandedArtwork.titleAr}
                </span>
              )}
            </div>
            <button
              onClick={() => setExpandedArtwork(null)}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Close ✕
            </button>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 300,
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            marginBottom: '3rem',
            maxWidth: '800px'
          }}>
            {expandedArtwork.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '2rem 0'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.5rem' }}>Dimensions</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-main)' }}>{expandedArtwork.dimensions}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.5rem' }}>Year</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-main)' }}>{expandedArtwork.year}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.5rem' }}>Category</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-main)' }}>{expandedArtwork.category}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.5rem' }}>Status</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 400, color: expandedArtwork.status === 'Available' ? 'var(--color-brand)' : 'var(--text-main)' }}>{expandedArtwork.status}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectArtwork(expandedArtwork)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {t('btn_inquire')}
          </button>
        </div>
      )}
    </div>
  );
};

export default function GallerySection({ onSelectArtwork }) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedArtwork, setExpandedArtwork] = useState(null);

  const categories = [
    { id: 'All', labelKey: 'filter_all', labelAr: 'الكل' },
    { id: 'Pencil & Graphite', labelKey: 'filter_pencil', labelAr: 'رصاص وجرافيت' },
    { id: 'Charcoal', labelKey: 'filter_charcoal', labelAr: 'فحم' },
    { id: 'Watercolor', labelKey: 'filter_watercolor', labelAr: 'ألوان مائية' },
    { id: 'Colored Pencil', labelKey: 'filter_colored_pencil', labelAr: 'أقلام ملونة' },
    { id: 'Ink Drawings', labelKey: 'filter_ink', labelAr: 'حبر' }
  ];

  const filteredArtworks = selectedCategory === 'All'
    ? ARTWORKS_DATA
    : ARTWORKS_DATA.filter(art => art.category === selectedCategory);

  useEffect(() => {
    setExpandedArtwork(null);
  }, [selectedCategory]);

  return (
    <section 
      id="gallery"
      className="mobile-spacious-section"
      style={{
        padding: 'clamp(72px, 10vw, 120px) 0',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #FAF8F5, #FFFFFF)'
      }}
    >
      <div 
        className="scroll-reveal"
        style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '0 2rem'
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
            display: 'block',
            marginBottom: '1rem'
          }}
        >
          {t('gallery_subtitle')}
        </span>

        <h2 
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            marginBottom: '3rem'
          }}
        >
          {t('gallery_title')}
        </h2>

        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            maxWidth: '900px',
            margin: '0 auto 4rem auto'
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{
                  fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'all 0.3s ease',
                  letterSpacing: isAr ? '0.03em' : '0.05em'
                }}>
                  {isAr ? cat.labelAr : t(cat.labelKey)}
                </span>
                <div 
                  className="indicator"
                  style={{
                    position: 'absolute',
                    bottom: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: '2px',
                    width: isActive ? '100%' : '0%',
                    background: 'var(--color-brand)',
                    opacity: isActive ? 1 : 0,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {filteredArtworks.length > 0 ? (
        <CoverflowCarousel 
          artworks={filteredArtworks} 
          onSelectArtwork={onSelectArtwork}
          expandedArtwork={expandedArtwork}
          setExpandedArtwork={setExpandedArtwork}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-sans)' }}>No artworks found in this category.</p>
        </div>
      )}
    </section>
  );
}
