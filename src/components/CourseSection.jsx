import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LEARNING_PATH = [
  {
    id: '01',
    num: '01',
    levelEn: 'LEVEL 1',
    levelAr: 'المستوى ١',
    titleEn: 'Foundation Course',
    titleAr: 'الدورة التأسيسية',
    descEn: 'Build the visual language of drawing from the ground up.',
    descAr: 'بناء اللغة البصرية للرسم من الأساس.',
    curriculumEn: [
      'Core drawing principles & line work',
      'Pencil control & basic shapes',
      'Proportions, light and shadow',
      'Understanding values'
    ],
    curriculumAr: [
      'مبادئ الرسم الأساسية والخطوط',
      'التحكم بالقلم الرصاص والأشكال الأساسية',
      'النسب، الضوء والظل',
      'فهم القيم اللونية'
    ],
    accent: 'rgba(160,86,40,0.85)',
    isSoon: true
  },
  {
    id: '02',
    num: '02',
    levelEn: 'LEVEL 2',
    levelAr: 'المستوى ٢',
    titleEn: 'Beginner Course',
    titleAr: 'دورة المبتدئين',
    descEn: 'Expand your skills with detailed studies and practical techniques.',
    descAr: 'توسيع مهاراتك من خلال دراسات تفصيلية وتقنيات عملية.',
    curriculumEn: [
      'Detailed drawings & anatomy studies',
      'Perspective & fine details',
      'Practical charcoal techniques',
      'Pen and ink applications'
    ],
    curriculumAr: [
      'رسومات تفصيلية ودراسات التشريح',
      'المنظور والتفاصيل الدقيقة',
      'تقنيات الفحم العملية',
      'تطبيقات القلم والحبر'
    ],
    accent: 'rgba(160,86,40,0.85)',
    isSoon: true
  },
  {
    id: '03',
    num: '03',
    levelEn: 'LEVEL 3',
    levelAr: 'المستوى ٣',
    titleEn: 'Professional Course',
    titleAr: 'الدورة الاحترافية',
    descEn: 'Develop a personal artistic style and master advanced techniques.',
    descAr: 'تطوير أسلوب فني شخصي وإتقان التقنيات المتقدمة.',
    curriculumEn: [
      'Advanced lighting & composition',
      'Realism and fine details',
      'Developing a personal artistic style',
      'Artwork for exhibitions & portfolios'
    ],
    curriculumAr: [
      'الإضاءة المتقدمة والتكوين',
      'الواقعية والتفاصيل الدقيقة',
      'تطوير أسلوب فني شخصي',
      'أعمال فنية للمعارض وملفات الأعمال'
    ],
    accent: 'rgba(160,86,40,0.85)',
    isSoon: true
  }
];

export default function CourseSection({ onInquireCourse }) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const parallaxRef = useRef(null);

  // Parallax without re-rendering: write transform directly, rAF-throttled, desktop only
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (parallaxRef.current && sectionRef.current) {
          const offset = Math.max(0, (window.scrollY - sectionRef.current.offsetTop + 400) * 0.22);
          parallaxRef.current.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="courses"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0D0603',
        padding: '0',
      }}
    >
      {/* ── CINEMATIC HERO BACKGROUND WITH VINTAGE CLOCKS FOCUS ── */}
      <div
        style={{
          position: 'relative',
          height: '75vh',
          minHeight: '540px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          ref={parallaxRef}
          style={{
            position: 'absolute',
            inset: '-10% 0',
            backgroundImage: 'url(/images/studio_collection.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 58%',
            willChange: 'transform',
            filter: 'brightness(0.68) contrast(1.1)',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,6,3,0.35) 0%, rgba(13,6,3,0.05) 50%, rgba(13,6,3,1) 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero text content */}
        <div
          className="scroll-reveal"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: 'clamp(2rem, 4vw, 4.5rem)',
            width: '100%',
            maxWidth: '920px',
          }}
        >
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
            marginBottom: '1.5rem',
          }}>
            {t('course_subtitle')}
          </span>

          <h2 style={{
            fontFamily: isAr ? "'PalestineFont', 'Amiri', serif" : "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: isAr ? '0' : '-0.025em',
            marginBottom: '1.5rem',
            direction: isAr ? 'rtl' : 'ltr',
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
          }}>
            {t('course_title')}
          </h2>

          <p style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
            fontSize: '1.1rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '620px',
            lineHeight: 1.85,
            direction: isAr ? 'rtl' : 'ltr',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}>
            {t('course_desc')}
          </p>
        </div>
      </div>

      {/* ── PROGRESSIVE LEARNING PATH CARDS ── */}
      <div
        style={{
          backgroundColor: '#0D0603',
          padding: 'clamp(3rem, 6vw, 8rem) clamp(1.5rem, 4vw, 4rem)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {LEARNING_PATH.map((w, i) => {
            const soonText = isAr ? 'قريباً' : 'COMING SOON';
            return (
              <div
                key={w.id}
                className="workshop-card scroll-reveal"
                style={{
                  position: 'relative',
                  background: '#0D0603',
                  border: activeCard === w.id 
                    ? `1px solid rgba(160,86,40,0.3)` 
                    : '1px solid rgba(255,255,255,0.06)',
                  padding: '3rem 2.5rem',
                  overflow: 'hidden',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: activeCard === w.id ? 'translateY(-4px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transitionDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={() => setActiveCard(w.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Subtle top indicator line on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: w.accent,
                  transform: activeCard === w.id ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: isAr ? 'right' : 'left',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />

                {/* Oversized Number in Background */}
                <div style={{
                  position: 'absolute',
                  top: '-2rem',
                  right: isAr ? 'auto' : '-1rem',
                  left: isAr ? '-1rem' : 'auto',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(8rem, 20vw, 14rem)',
                  fontWeight: 300,
                  color: activeCard === w.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                  lineHeight: 1,
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: activeCard === w.id ? 'scale(1.05)' : 'scale(1)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}>
                  {w.num}
                </div>

                <div className="course-content-container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '2rem', flex: 1 }}>
                  
                  {/* Content Left (or Top) */}
                  <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                    {/* Top Level label */}
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: activeCard === w.id ? w.accent : 'rgba(255,255,255,0.5)',
                      marginBottom: '2rem',
                      transition: 'color 0.4s ease',
                      direction: isAr ? 'rtl' : 'ltr',
                    }}>
                      {isAr ? w.levelAr : w.levelEn}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                      fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      marginBottom: '1rem',
                      lineHeight: 1.15,
                      direction: isAr ? 'rtl' : 'ltr',
                    }}>
                      {isAr ? w.titleAr : w.titleEn}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                      direction: isAr ? 'rtl' : 'ltr',
                    }}>
                      {isAr ? w.descAr : w.descEn}
                    </p>

                    {w.isSoon && (
                      <div 
                        className="coming-soon-badge" 
                        data-text={soonText}
                        style={{
                          animationDelay: `${0.2 + (i * 0.1)}s`,
                          fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                          fontSize: isAr ? 'clamp(1.4rem, 2vw, 1.8rem)' : 'clamp(1.8rem, 2.5vw, 2.2rem)',
                          fontWeight: isAr ? 500 : 300,
                        }}
                      >
                        <div className="coming-soon-letters" style={{ direction: isAr ? 'rtl' : 'ltr', fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif" }}>
                          {isAr ? (
                            <span style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}>
                              {soonText}
                            </span>
                          ) : (
                            soonText.split('').map((char, charIdx) => (
                              <span 
                                key={charIdx} 
                                style={{ 
                                  animationDelay: `${0.2 + (i * 0.1) + (charIdx * 0.05)}s`,
                                  whiteSpace: 'pre'
                                }}
                              >
                                {char}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Right (or Bottom) - Curriculum & CTA */}
                  <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    {/* Curriculum List */}
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 3rem 0',
                      direction: isAr ? 'rtl' : 'ltr',
                    }}>
                      {(isAr ? w.curriculumAr : w.curriculumEn).map((item, idx) => (
                        <li key={idx} style={{
                          fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          lineHeight: 1.4,
                        }}>
                          <span style={{ 
                            color: activeCard === w.id ? w.accent : 'rgba(255,255,255,0.2)',
                            transition: 'color 0.4s ease',
                            fontSize: '0.7rem',
                            marginTop: '0.2rem'
                          }}>
                            ✦
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div style={{ marginTop: 'auto', direction: isAr ? 'rtl' : 'ltr' }}>
                      <button
                        onClick={w.isSoon ? undefined : () => onInquireCourse(isAr ? w.titleAr : w.titleEn)}
                        disabled={w.isSoon}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: 'none',
                          border: 'none',
                          color: activeCard === w.id ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                          padding: '0',
                          fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          cursor: w.isSoon ? 'default' : 'pointer',
                          transition: 'color 0.4s ease',
                          opacity: w.isSoon ? 0.3 : 1
                        }}
                      >
                        {isAr ? 'عرض الدورة' : 'View Course'}
                        <span style={{
                          transform: activeCard === w.id && !w.isSoon
                            ? (isAr ? 'translateX(-4px)' : 'translateX(4px)') 
                            : 'translateX(0)',
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}>
                          {isAr ? '←' : '→'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
