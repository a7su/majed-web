import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WORKSHOPS = [
  {
    id: 'youth',
    icon: '✏️',
    titleEn: 'Youth Workshops',
    titleAr: 'ورش الشباب',
    descEn: 'Hands-on sessions designed for young artists aged 12–25. From basic pencil control to expressive charcoal technique.',
    descAr: 'جلسات تطبيقية مصممة للفنانين الشباب من 12 إلى 25 عاماً. من التحكم الأساسي بالقلم إلى تقنية الفحم التعبيرية.',
    tag: 'Ages 12–25',
    tagAr: 'من 12 إلى 25',
    count: '8',
    countLabel: 'students max',
    countLabelAr: 'طالب كحد أقصى',
    accent: 'rgba(160,86,40,1)',
  },
  {
    id: 'corporate',
    icon: '🏢',
    titleEn: 'Corporate Workshops',
    titleAr: 'ورش الشركات',
    descEn: 'Creative team-building experiences through art. Tailored for companies seeking to unlock creative potential in their teams.',
    descAr: 'تجارب إبداعية لبناء الفرق من خلال الفن. مصممة للشركات التي تسعى إلى إطلاق الطاقة الإبداعية في فرقها.',
    tag: 'Teams of 10–50',
    tagAr: 'فرق من 10 إلى 50',
    count: '3h',
    countLabel: 'per session',
    countLabelAr: 'لكل جلسة',
    accent: 'rgba(110,64,33,1)',
  },
  {
    id: 'masterclass',
    icon: '🎨',
    titleEn: 'Masterclass',
    titleAr: 'الدورة الاحترافية',
    descEn: 'An intensive deep-dive for serious artists. Advanced shading, material mastery, and the secrets of capturing emotion on paper.',
    descAr: 'غوص مكثف للفنانين الجادين. تظليل متقدم، إتقان المواد، وأسرار التقاط المشاعر على الورق.',
    tag: 'SOON',
    tagAr: 'قريباً',
    count: '∞',
    countLabel: 'techniques',
    countLabelAr: 'تقنية',
    accent: 'rgba(45,27,16,1)',
    soon: true,
  },
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
      {/* ── CINEMATIC HERO BACKGROUND ── */}
      <div
        style={{
          position: 'relative',
          height: '70vh',
          minHeight: '500px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Parallax Background Image */}
        <div
          ref={parallaxRef}
          style={{
            position: 'absolute',
            inset: '-10% 0',
            backgroundImage: 'url(/images/workshop_hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
            filter: 'brightness(0.55)',
            zIndex: 0,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13,6,3,0.3) 0%, rgba(13,6,3,0.0) 40%, rgba(13,6,3,0.9) 100%)',
            zIndex: 1,
          }}
        />

        {/* Floating SOON badge */}
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '2.5rem',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(160,86,40,0.5)',
            backgroundColor: 'rgba(13,6,3,0.7)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand)',
              display: 'inline-block',
              boxShadow: '0 0 10px var(--color-brand)',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase',
          }}>
            SOON · قريباً
          </span>
        </div>

        {/* Hero text content */}
        <div
          className="scroll-reveal"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: 'clamp(2rem, 4vw, 4rem)',
            width: '100%',
            maxWidth: '900px',
          }}
        >
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 500,
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
          }}>
            {t('course_title')}
          </h2>

          <p style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
            fontSize: '1.1rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '600px',
            lineHeight: 1.85,
            direction: isAr ? 'rtl' : 'ltr',
          }}>
            {t('course_desc')}
          </p>
        </div>
      </div>

      {/* ── WORKSHOP CARDS ── */}
      <div
        style={{
          backgroundColor: '#0D0603',
          padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 4rem)',
        }}
      >
        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {WORKSHOPS.map((w, i) => (
            <div
              key={w.id}
              className="workshop-card scroll-reveal"
              style={{
                background: activeCard === w.id
                  ? 'linear-gradient(135deg, #1e0e06 0%, #2d1507 100%)'
                  : 'rgba(255,255,255,0.03)',
                border: activeCard === w.id
                  ? `1px solid ${w.accent}`
                  : '1px solid rgba(255,255,255,0.07)',
                padding: '2.5rem',
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={() => setActiveCard(w.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Icon + tag row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                direction: isAr ? 'rtl' : 'ltr',
              }}>
                <span style={{ fontSize: '2rem' }}>{w.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: w.soon ? 'var(--color-brand)' : 'rgba(255,255,255,0.4)',
                  border: w.soon
                    ? '1px solid rgba(160,86,40,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '9999px',
                }}>
                  {isAr ? w.tagAr : w.tag}
                </span>
              </div>

              {/* Big number accent */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 300,
                color: activeCard === w.id ? w.accent : 'rgba(255,255,255,0.06)',
                lineHeight: 1,
                marginBottom: '0.5rem',
                transition: 'color 0.5s var(--ease-smooth)',
              }}>
                {w.count}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '2rem',
              }}>
                {isAr ? w.countLabelAr : w.countLabel}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
                fontWeight: 400,
                color: '#FFFFFF',
                marginBottom: '1rem',
                lineHeight: 1.2,
                direction: isAr ? 'rtl' : 'ltr',
              }}>
                {isAr ? w.titleAr : w.titleEn}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
                marginBottom: '2.5rem',
                direction: isAr ? 'rtl' : 'ltr',
              }}>
                {isAr ? w.descAr : w.descEn}
              </p>

              {/* CTA */}
              <button
                onClick={w.soon ? undefined : onInquireCourse}
                disabled={w.soon}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: `1px solid ${activeCard === w.id ? w.accent : 'rgba(255,255,255,0.15)'}`,
                  color: activeCard === w.id ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                  borderRadius: '9999px',
                  padding: '0.7rem 1.5rem',
                  fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: w.soon ? 'default' : 'pointer',
                  transition: 'all 0.4s var(--ease-smooth)',
                  opacity: w.soon ? 0.5 : 1,
                }}
              >
                {w.soon
                  ? (isAr ? 'قريباً' : 'Coming Soon')
                  : (isAr ? 'سجّل الآن' : 'Register Now →')
                }
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="scroll-reveal"
          style={{
            textAlign: 'center',
            marginTop: '5rem',
            padding: '4rem 2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            marginBottom: '2.5rem',
            letterSpacing: '-0.01em',
            direction: isAr ? 'rtl' : 'ltr',
          }}>
            {isAr
              ? 'هل أنت مستعد لتبدأ رحلتك الفنية؟'
              : 'Ready to begin your artistic journey?'
            }
          </p>
          <button
            className="btn-brand"
            onClick={onInquireCourse}
          >
            {t('course_btn')}
          </button>
        </div>
      </div>
    </section>
  );
}
