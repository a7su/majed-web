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
      id: 'eye-studies',
      title: 'Gaze & Iris Reflections',
      titleAr: 'إشراقة العينين والتعبير',
      info: 'Iris Reflection & Eye Expressions · 2025',
      infoAr: 'تأملات تعبيرية للعيون والقزحية · 2025',
      src: '/images/sketches/sketch_eye_studies.jpg',
      category: 'Pencil & Graphite',
      technique: 'Fine Charcoal & Pencil on Tonal Paper',
      dimensions: 'A3 Sketchbook Sheet',
      year: '2025',
      status: 'Available',
      description: 'An intimate exploration of human gaze and soul through the window of the eyes—capturing light reflections, iris depth, delicate lashes, and raw emotional presence.',
    {
      id: 'portraits-spread',
      title: 'Portraits & Expressions Spread',
      titleAr: 'صفحة البورتريه والتعبيرات',
      info: '5-Portrait Charcoal Sketchbook Spread · 2025',
      infoAr: 'صفحة رسم تضم ٥ بورتريهات · 2025',
      src: '/images/sketches/sketch_portraits_spread.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite & Charcoal on Tonal Paper',
      dimensions: 'Double-Page Spread',
      year: '2025',
      status: 'Available',
      description: 'A masterclass double-page sketchbook spread capturing five diverse facial portraits and natural lighting.',
    },
    {
      id: 'children-studies',
      title: 'Children Portraits',
      titleAr: 'وجوه الأطفال',
      info: 'Charcoal & Pencil Portrait Sheet · 2025',
      infoAr: 'رسم بورتريهات أطفال بالفحم · 2025',
      src: '/images/sketches/sketch_children_studies.jpg',
      category: 'Pencil & Graphite',
      technique: 'Charcoal Pencil & Graphite',
      dimensions: 'A3 Sketchbook Sheet',
      year: '2025',
      status: 'Available',
      description: 'An expressive artwork sheet capturing innocent childhood gaze, hair curls, and soft tonal shading.',
    },
    {
      id: 'baseball-grip',
      title: 'Baseball Grip',
      titleAr: 'قبضة الكرة (رسم واقعي)',
      info: 'Realism Hand & Texture Artwork · 2025',
      infoAr: 'رسم واقعي لليد والكرة · 2025',
      src: '/images/sketches/sketch_baseball_grip.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite & Charcoal Shading',
      dimensions: 'A4 Sketchbook Sheet',
      year: '2025',
      status: 'Available',
      description: 'A hyper-realistic hand drawing focusing on finger bone anatomy, skin seams, and baseball leather stitching.',
    },
    {
      id: 'man-cap',
      title: 'Man with Cap & Glasses',
      titleAr: 'رجل بالقبعة والنظارات',
      info: 'Realism Graphite Portrait · 2025',
      infoAr: 'بورتريه واقعي بالرصاص · 2025',
      src: '/images/sketches/sketch_man_cap.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite Pencil on Paper',
      dimensions: 'A4 Sketchbook Sheet',
      year: '2025',
      status: 'Available',
      description: 'A charismatic profile portrait of a man wearing a reversed cap and round glasses with subtle smile lines.',
    },
    {
      id: 'um-kulthum',
      title: 'Umm Kulthum',
      titleAr: 'أم كلثوم',
      info: 'Charcoal & Fine Graphite · 2024',
      infoAr: 'فحم وجرافيت ناعم · 2024',
      src: '/images/sketches/sketch_um_kulthum.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite & Charcoal on Paper',
      dimensions: 'A3 Fine Sheet',
      year: '2024',
      status: 'Available',
      description: 'A breathtaking portrait of the legendary Egyptian icon Umm Kulthum, captured mid-song in pure musical ecstasy.',
    },
    {
      id: 'abdel-halim',
      title: 'Abdel Halim Hafez',
      titleAr: 'عبد الحليم حافظ',
      info: 'Pencil Portrait Artwork · 2024',
      infoAr: 'بورتريه بالرصاص · 2024',
      src: '/images/sketches/sketch_abdel_halim.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite & Charcoal on Paper',
      dimensions: 'A3 Fine Sheet',
      year: '2024',
      status: 'Available',
      description: 'A masterful graphite portrait of the Nightingale Abdel Halim Hafez singing with intense passion at the microphone.',
    },
    {
      id: 'batman',
      title: 'The Dark Knight (Batman)',
      titleAr: 'فارس الظلام (باتمان)',
      info: 'Graphite & Charcoal on Paper · 2025',
      infoAr: 'رصاص وفحم على ورقة · 2025',
      src: '/images/sketches/sketch_batman.jpg',
      category: 'Pencil & Graphite',
      technique: 'Graphite Pencil on Paper',
      dimensions: 'A3 Fine Sheet',
      year: '2025',
      status: 'Available',
      description: 'An extraordinarily detailed graphite portrait of Batman, capturing the dark brooding atmosphere with masterclass pencil shading.',
    },
    {
      id: 'studio-wall',
      title: 'Artist Studio Wall Collection',
      titleAr: 'جدارية المرسم الخاص',
      info: 'Original Charcoal & Graphite Archive · 2025',
      infoAr: 'أرشيف الأعمال بالمرسم · 2025',
      src: '/images/sketches/sketch_studio_wall.jpg',
      category: 'Pencil & Graphite',
      technique: 'Studio Archive Collection',
      dimensions: 'Full Wall Archive',
      year: '2025',
      status: 'Private Collection',
      description: 'An authentic peek inside Majed Alnahdi\'s fine art studio wall showcasing original iconic portraits and realism masterworks.',
    },
    {
      id: 'blue-pen-eyes',
      title: 'Blue Ink Eye Expressions',
      titleAr: 'تأملات عيون بقلم الحبر الأزرق',
      info: 'Blue Ballpoint Pen on Paper · 2025',
      infoAr: 'قلم حبر أزرق جاف على ورق سميك · 2025',
      src: '/images/sketches/sketch_blue_pen_eyes.jpg',
      category: 'Ballpoint Pen',
      technique: 'Blue Ballpoint Pen Hatching & Shading',
      dimensions: 'A4 Sketchbook Sheet',
      year: '2025',
      status: 'Available',
      description: 'An intricate double eye artwork rendered entirely in blue ballpoint pen with fine cross-hatching, eyebrow texture, and iris depth.',
    },
    {
      id: 'blue-pen-trio',
      title: 'Expression Trio (Ballpoint Pen)',
      titleAr: 'ثلاثية تعابير العيون (حبر جاف)',
      info: 'Blue Ballpoint Pen Sketchbook Page · 2025',
      infoAr: 'صفحة كراسة بقلم الحبر الأزرق الجاف · 2025',
      src: '/images/sketches/sketch_blue_pen_trio.jpg',
      category: 'Ballpoint Pen',
      technique: 'Blue Ballpoint Pen & Cross-Hatching',
      dimensions: 'Vertical Sketchbook Leaf',
      year: '2025',
      status: 'Available',
      description: 'A stunning vertical sketchbook page showing three distinct eye expression drawings rendered with blue ballpoint pen ink.',
    },
    {
      id: 'golden-kettle-tea',
      title: 'Golden Teapot & Tea Ritual',
      titleAr: 'إبريق الشاي الذهبي وطقوس الهدوء',
      info: 'Colored Pencil & Natural Tea Wash · 2025',
      infoAr: 'ألوان خشبية وحبر الشاي · 2025',
      src: '/images/sketches/sketch_golden_kettle.jpg',
      category: 'Ink Drawings',
      technique: 'Colored Pencil, Fine Ink & Tea Stain Wash',
      dimensions: 'A4 Fine Sheet',
      year: '2025',
      status: 'Available',
      description: 'A warm still-life drawing of a traditional brass kettle alongside a freshly steeped glass of black tea, executed with fine colored pencil hatching and natural tea ink wash.',
    },
    {
      id: 'watercolor-heart',
      title: 'Anatomical Heart & Tea Wash',
      titleAr: 'القلب البشري بتدرجات المائية ورائحة الشاي',
      info: 'Watercolor & Organic Tea Wash · 2025',
      infoAr: 'ألوان مائية وحبر الشاي الطبيعي · 2025',
      src: '/images/sketches/sketch_watercolor_heart.jpg',
      category: 'Watercolor',
      technique: 'Watercolor, Ink & Organic Tea Stain Wash on Cotton Paper',
      dimensions: 'A4 Fine Art Sheet',
      year: '2025',
      status: 'Available',
      description: 'An intricate anatomical heart painted in vibrant crimson and earthy watercolors, accented with organic tea splatters and fine ink details.',
    },
  ];

  // Group items into Leaf Pairs (Front Face & Back Face per leaf)
  const leafPairs = [
    [sketchData[0], sketchData[1]], // Leaf 1: Front: Eyes, Back: Profile
    [sketchData[2], sketchData[3]], // Leaf 2: Front: Portraits Spread, Back: Children Studies
    [sketchData[4], sketchData[5]], // Leaf 3: Front: Baseball Grip, Back: Man with Cap
    [sketchData[6], sketchData[7]], // Leaf 4: Front: Umm Kulthum, Back: Abdel Halim
    [sketchData[8], sketchData[9]], // Leaf 5: Front: Batman, Back: Studio Wall
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
        {/* Real Metallic Twin-Loop Spiral Ring Binding Overlay on Spine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [isAr ? 'right' : 'left']: '-9px',
            width: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '16px 0',
            zIndex: 300,
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '16px',
                height: '7px',
                borderRadius: '3.5px',
                background: 'linear-gradient(to right, #444 0%, #CCC 50%, #222 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
                border: '1px solid rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>

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
              {index === 0 ? (
                /* AUTHENTIC ARTIST SKETCHBOOK COVER (CREAM FABRIANO PAPER PLATE) */
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: 'radial-gradient(ellipse at 50% 30%, #FAF6F0 0%, #EDE5D8 100%)',
                    overflow: 'hidden',
                    borderRadius: isAr ? '12px 0px 0px 12px' : '0px 12px 12px 0px',
                    border: '1px solid rgba(160,86,40,0.22)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.4rem 1.2rem 1.1rem',
                  }}
                >
                  {/* Fine Paper Texture Overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)' opacity='0.04'/%3E%3C/svg%3E")`,
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />

                  {/* Top Stamped Artist Branding Header */}
                  <div
                    style={{
                      zIndex: 2,
                      textAlign: 'center',
                      marginTop: '0.2rem',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '0.95rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                      }}
                    >
                      MAJED ALNAHDI
                    </div>
                    <div
                      style={{
                        fontFamily: isAr ? "'thmanyahsans-Bold', 'Cairo', sans-serif" : 'var(--font-sans)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--color-brand)',
                        marginTop: '0.2rem',
                        fontWeight: 600,
                      }}
                    >
                      {isAr ? 'كراسة الرسم بالفحم والرصاص' : 'ORIGINAL ARTIST SKETCHBOOK · VOL. I'}
                    </div>
                  </div>

                  {/* Mounted Fine Art Inset Window */}
                  <div
                    style={{
                      width: '88%',
                      height: '58%',
                      borderRadius: '4px',
                      border: '1px solid rgba(160,86,40,0.3)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12), inset 0 1px 3px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
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

                    {/* Fine inner border line */}
                    <div style={{ position: 'absolute', inset: '5px', border: '1px solid rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  </div>

                  {/* Footer Title & Openable Details Action Button */}
                  <div
                    style={{
                      zIndex: 2,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: isAr ? "'Noto Serif Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.15rem',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                      }}
                    >
                      {isAr ? frontData.titleAr : frontData.title}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectArtwork) onSelectArtwork(frontData);
                      }}
                      style={{
                        background: 'var(--text-main)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.55rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '0.35rem 0.95rem',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(67, 40, 24, 0.25)',
                      }}
                    >
                      {isAr ? 'استعراض التفاصيل ↗' : 'VIEW DETAILS ↗'}
                    </button>
                  </div>

                  {/* Flip Prompt Badge on Cover */}
                  {flippedCount === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        background: 'rgba(67, 40, 24, 0.85)',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '999px',
                        backdropFilter: 'blur(6px)',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        zIndex: 10,
                      }}
                    >
                      {isAr ? 'انقر لفتح الكراسة' : 'CLICK TO FLIP PAGE'}
                    </div>
                  )}
                </div>
              ) : (
                /* INNER PAGE FRONT FACE */
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
                      
                      {/* Rich Artwork Caption Overlay with Openable Details Button */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '2rem 1.2rem 0.9rem',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <h4
                            style={{
                              fontFamily: isAr ? "'Noto Serif Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
                              fontSize: '1.2rem',
                              fontWeight: 500,
                              margin: 0,
                              color: '#FFFFFF',
                              lineHeight: 1.2,
                            }}
                          >
                            {isAr ? frontData.titleAr : frontData.title}
                          </h4>
                          
                          {/* Openable Details Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectArtwork) onSelectArtwork(frontData);
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(4px)',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              color: '#FFFFFF',
                              fontSize: '0.55rem',
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '999px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {isAr ? 'التفاصيل' : 'Details ↗'}
                          </button>
                        </div>

                        <span
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
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
              )}

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
                    
                    {/* Rich Artwork Caption Overlay with Openable Details Button */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2rem 1.2rem 0.9rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <h4
                          style={{
                            fontFamily: isAr ? "'Noto Serif Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            margin: 0,
                            color: '#FFFFFF',
                            lineHeight: 1.2,
                          }}
                        >
                          {isAr ? backData.titleAr : backData.title}
                        </h4>

                        {/* Openable Details Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectArtwork) onSelectArtwork(backData);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            color: '#FFFFFF',
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isAr ? 'التفاصيل' : 'Details ↗'}
                        </button>
                      </div>

                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.6rem',
                          letterSpacing: '0.1em',
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
