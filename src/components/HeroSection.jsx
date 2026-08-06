import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import Sketchbook3D from './Sketchbook3D';

const SKETCH_PAGES = [
  {
    id: 'batman',
    title: 'The Dark Knight (Batman)',
    titleAr: 'فارس الظلام (باتمان)',
    src: '/images/sketches/sketch_batman.jpg',
  },
  {
    id: 'abdel-halim',
    title: 'Abdel Halim Hafez',
    titleAr: 'عبد الحليم حافظ',
    src: '/images/sketches/sketch_abdel_halim.jpg',
  },
  {
    id: 'umm-kulthum',
    title: 'Umm Kulthum',
    titleAr: 'أم كلثوم',
    src: '/images/sketches/sketch_um_kulthum.jpg',
  },
  {
    id: 'cowboy',
    title: 'The Cowboy & Horse',
    titleAr: 'الراعي والجواد',
    src: '/images/sketches/sketch_cowboy.jpg',
  },
  {
    id: 'couple',
    title: 'Eternal Embrace',
    titleAr: 'العشاق',
    src: '/images/sketches/sketch_couple.jpg',
  },
];

export default function HeroSection({ onSelectArtwork, onNavigate }) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [titleVisible] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
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

  const handleToggleBook = () => {
    setIsBookOpen((prev) => !prev);
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'clip',
        backgroundColor: '#FAFAF8',
        padding: isMobile ? '4.5rem 1rem 3.5rem' : '5rem 2.5rem',
      }}
    >
      {/* Subtle Grain Texture Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Main Parent Container wrapping text and book */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 80,
          damping: 20,
        }}
        style={{
          width: '100%',
          maxWidth: '1040px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          zIndex: 2,
        }}
      >
        {/* ─── 1. INTERACTIVE BOOK WRAPPER ─── */}
        <motion.div
          layout
          style={{
            order: 1,
            width: '100%',
            maxWidth: '100%',
            minHeight: isMobile ? (isBookOpen ? '260px' : '320px') : (isTablet ? (isBookOpen ? '360px' : '400px') : (isBookOpen ? '460px' : '520px')),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.6s cubic-bezier(0.85, 0, 0.15, 1)',
          }}
        >
          <Sketchbook3D
            pages={SKETCH_PAGES}
            onSelectArtwork={onSelectArtwork}
            isOpen={isBookOpen}
            onToggleOpen={handleToggleBook}
          />
        </motion.div>

        {/* ─── 2. HEADLINE TEXT CONTAINER ─── */}
        <motion.div
          layout
          style={{
            order: 2,
            width: '100%',
            maxWidth: '740px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Eyebrow Accent */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              marginBottom: '1.4rem',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(-15px)',
              transition: 'all 0.8s ease 0.1s',
            }}
          >
            <div style={{ width: '28px', height: '1px', background: 'var(--color-brand)' }} />
            <span
              style={{
                fontFamily: isAr ? "'thmanyahsans-Bold', 'ThmanyahSans-Bold', 'Thmanyah Sans', 'Cairo', sans-serif" : 'var(--font-sans)',
                fontSize: isAr ? '0.78rem' : '0.68rem',
                fontWeight: isAr ? 700 : 500,
                letterSpacing: isAr ? '0.04em' : '0.28em',
                textTransform: 'uppercase',
                color: 'var(--color-brand)',
              }}
            >
              {isAr ? 'فنان تشكيلي · رسام جرافيت وفحم' : 'Visual Artist · Graphite & Charcoal'}
            </span>
            <div style={{ width: '28px', height: '1px', background: 'var(--color-brand)' }} />
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: isAr
                ? "var(--font-arabic-display)"
                : "'Cormorant Garamond', Georgia, serif",
              fontSize: isBookOpen ? 'clamp(2rem, 4.2vw, 3.2rem)' : 'clamp(2.4rem, 4.8vw, 4.4rem)',
              fontWeight: 300,
              lineHeight: isAr ? 1.35 : 1.15,
              letterSpacing: isAr ? '0' : '-0.02em',
              color: 'var(--text-main)',
              marginBottom: '2rem',
              textAlign: 'center',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(-25px)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
            }}
          >
            {isAr ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}>
                {/* Line 1 with Warm Beige Highlight */}
                <span
                  style={{
                    backgroundColor: 'rgba(244, 239, 232, 0.85)',
                    padding: '0.15em 0.55em',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontWeight: 400,
                  }}
                >
                  امنح حياتك معنى،
                </span>

                {/* Line 2 with Warm Accent */}
                <span
                  style={{
                    backgroundColor: 'rgba(244, 239, 232, 0.55)',
                    padding: '0.15em 0.55em',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontFamily: "var(--font-arabic-display)",
                    fontWeight: 500,
                    color: '#A05628',
                  }}
                >
                  وامنح حواسك حياة.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}>
                {/* Line 1 with Warm Beige Highlight */}
                <span
                  style={{
                    backgroundColor: 'rgba(244, 239, 232, 0.85)',
                    padding: '0.15em 0.55em',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontWeight: 300,
                  }}
                >
                  Give your life meaning,
                </span>

                {/* Line 2 in Harmonious Italic Cormorant Garamond with Warm Accent */}
                <span
                  style={{
                    backgroundColor: 'rgba(244, 239, 232, 0.55)',
                    padding: '0.15em 0.55em',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '0.98em',
                    color: '#A05628',
                  }}
                >
                  and give your senses life.
                </span>
              </div>
            )}
          </h1>

          {/* CTA Buttons Grouped with Typography */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.9s ease 0.4s',
            }}
          >
            <button
              className="btn-primary"
              onClick={() => onNavigate && onNavigate('gallery')}
            >
              {t('btn_explore')}
            </button>
            <button
              className="btn-outline"
              onClick={() => onNavigate && onNavigate('contact')}
            >
              {t('btn_inquire')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
