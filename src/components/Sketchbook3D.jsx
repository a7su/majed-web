import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sketchbook3D({ pages, onSelectArtwork, isOpen, onToggleOpen }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // 1. Build image array with rich metadata descriptions (Title, Year, Medium)
  const sketchData = [
    {
      title: 'The Dark Knight (Batman)',
      titleAr: 'فارس الظلام (باتمان)',
      info: 'Graphite & Charcoal on Paper · 2025',
      infoAr: 'رصاص وفحم على ورقة · 2025',
      src: '/images/sketches/sketch_batman.jpg',
    },
    {
      title: 'Abdel Halim Hafez',
      titleAr: 'عبد الحليم حافظ',
      info: 'Pencil Portrait Study · 2024',
      infoAr: 'بورتريه بالرصاص · 2024',
      src: '/images/sketches/sketch_abdel_halim.jpg',
    },
    {
      title: 'Umm Kulthum',
      titleAr: 'أم كلثوم',
      info: 'Charcoal & Fine Graphite · 2024',
      infoAr: 'فحم وجرافيت ناعم · 2024',
      src: '/images/sketches/sketch_um_kulthum.jpg',
    },
    {
      title: 'The Cowboy & Horse',
      titleAr: 'الراعي والجواد',
      info: 'Realism Charcoal Sketch · 2025',
      infoAr: 'رسمة واقعية بالفحم · 2025',
      src: '/images/sketches/sketch_cowboy.jpg',
    },
    {
      title: 'Eternal Embrace',
      titleAr: 'العشاق',
      info: 'Graphite Portrait Study · 2025',
      infoAr: 'دراسة بورتريه جرافيت · 2025',
      src: '/images/sketches/sketch_couple.jpg',
    },
    {
      title: 'Contemplative Profile',
      titleAr: 'نظرة تأملية (بورتريه)',
      info: 'Fine Pencil & Graphite Study · 2025',
      infoAr: 'دراسة ناعمة بالرصاص · 2025',
      src: '/images/sketches/sketch_profile_portrait.jpg',
    },
    {
      title: 'Eyes',
      titleAr: 'عيون',
      info: 'Multi-Perspective Eye Studies · 2025',
      infoAr: 'دراسات فحم متعددة للعيون · 2025',
      src: '/images/sketches/sketch_eye_studies.jpg',
    },
    {
      title: 'Artist Studio Wall',
      titleAr: 'جدارية المرسم الخاص',
      info: 'Original Charcoal & Graphite Archive · 2025',
      infoAr: 'أرشيف الأعمال بالمرسم · 2025',
      src: '/images/sketches/sketch_studio_wall.jpg',
    },
  ];

  // Group items into Leaf Pairs (Front Face & Back Face per leaf)
  const leafPairs = [
    [sketchData[0], sketchData[1]],
    [sketchData[2], sketchData[5]],
    [sketchData[6], sketchData[3]],
    [sketchData[4], sketchData[7]],
  ];
  const totalLeaves = leafPairs.length;

  const [flippedCount, setFlippedCount] = useState(0);

  // Declarative Click & Page Turn Handler
  const handleClick = (e) => {
    e.stopPropagation();

    // Opening book from closed cover
    if (flippedCount === 0 && !isOpen) {
      onToggleOpen();
    }

    if (flippedCount < totalLeaves) {
      setFlippedCount((prev) => prev + 1);
    } else {
      // End of collection: Reset back to close
      setFlippedCount(0);
      if (isOpen) onToggleOpen();
    }
  };

  const shadowStyle = isOpen
    ? '0px 35px 70px rgba(67, 40, 24, 0.24), 0px 14px 28px rgba(0, 0, 0, 0.12)'
    : '5px 20px 40px rgba(67, 40, 24, 0.18), 0px 8px 20px rgba(0, 0, 0, 0.08)';

  const bookWidth = isMobile ? 270 : (isTablet ? 310 : 340);
  const openScale = isMobile ? 0.52 : (isTablet ? 0.80 : 1);
  const closedScale = isMobile ? 0.85 : (isTablet ? 0.92 : 1);
  const centerShift = Math.round(bookWidth * openScale * 0.5);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: 2500,
        cursor: 'pointer',
        overflow: 'visible',
      }}
      onClick={handleClick}
    >
      <motion.div
        animate={{
          x: isOpen ? (isAr ? -centerShift : centerShift) : 0,
          scale: isOpen ? openScale : closedScale,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: `${bookWidth}px`,
          height: isMobile ? '370px' : (isTablet ? '420px' : '460px'),
          maxHeight: '60vh',
          position: 'relative',
          transformStyle: 'preserve-3d',
          boxShadow: shadowStyle,
          borderRadius: '12px',
          transition: 'box-shadow 0.6s ease',
        }}
      >
        {/* Render Leaf Pairs with Framer 3D Layering */}
        {leafPairs.map(([frontData, backData], index) => {
          const isFlipped = index < flippedCount;
          const isFlipping = index === flippedCount - 1;
          const zIndex = isFlipping ? 100 : isFlipped ? index : totalLeaves - index;
          const zOffset = (totalLeaves - index) * 0.4;

          return (
            <motion.div
              key={index}
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: isFlipped ? (isAr ? 180 : -180) : 0,
                opacity: isMobile && isFlipped && !isFlipping ? 0 : 1,
              }}
              transition={{
                duration: 0.75,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.35, delay: isMobile && isFlipped && !isFlipping ? 0.1 : 0 },
              }}
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: isAr ? 'right center' : 'left center',
                transformStyle: 'preserve-3d',
                zIndex: zIndex,
                transform: `translateZ(${zOffset}px)`,
                willChange: 'transform',
                pointerEvents: isMobile && isFlipped && !isFlipping ? 'none' : 'auto',
              }}
            >
              {/* FRONT FACE OF LEAF */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: '#FAF8F4',
                  overflow: 'hidden',
                  borderRadius: isAr ? '12px 0px 0px 12px' : '0px 12px 12px 0px',
                  border: '1px solid rgba(160,86,40,0.12)',
                }}
              >
                {frontData && (
                  <>
                    <img
                      src={frontData.src}
                      alt={frontData.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    
                    {/* Rich Artwork Caption Overlay (Title + Year + Medium) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2.2rem 1.4rem 1rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: isAr ? "'Noto Serif Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
                          fontSize: '1.25rem',
                          fontWeight: 500,
                          margin: 0,
                          color: '#FFFFFF',
                          lineHeight: 1.2,
                        }}
                      >
                        {isAr ? frontData.titleAr : frontData.title}
                      </h4>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.62rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-brand)',
                          opacity: 0.95,
                        }}
                      >
                        {isAr ? frontData.infoAr : frontData.info}
                      </span>
                    </div>
                  </>
                )}
                
                {/* Spine Shadow Gradient */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '12%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Flip Prompt Badge on Active Leaf */}
                {index === flippedCount && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      background: 'rgba(0,0,0,0.65)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '999px',
                      backdropFilter: 'blur(6px)',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    {isAr ? 'انقر لقلب الصفحة' : 'CLICK TO FLIP PAGE'}
                  </div>
                )}
              </div>

              {/* BACK FACE OF LEAF (Rotated 180deg) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: 'rotateY(180deg) translateZ(0.01px)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: '#FAF8F4',
                  overflow: 'hidden',
                  borderRadius: isAr ? '0px 12px 12px 0px' : '12px 0px 0px 12px',
                  border: '1px solid rgba(160,86,40,0.12)',
                }}
              >
                {backData && (
                  <>
                    <img
                      src={backData.src}
                      alt={backData.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    
                    {/* Rich Artwork Caption Overlay (Title + Year + Medium) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2.2rem 1.4rem 1rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: isAr ? "'Noto Serif Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
                          fontSize: '1.25rem',
                          fontWeight: 500,
                          margin: 0,
                          color: '#FFFFFF',
                          lineHeight: 1.2,
                        }}
                      >
                        {isAr ? backData.titleAr : backData.title}
                      </h4>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.62rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-brand)',
                          opacity: 0.95,
                        }}
                      >
                        {isAr ? backData.infoAr : backData.info}
                      </span>
                    </div>
                  </>
                )}
                
                {/* Reversed Spine Shadow Gradient */}
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '12%',
                    background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
