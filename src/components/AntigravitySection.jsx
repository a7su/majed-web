import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function AntigravitySection() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="antigravity"
      style={{
        position: 'relative',
        minHeight: '90vh',
        width: '100%',
        backgroundColor: '#FAF9F6',
        color: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '8rem 2rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. Subtle SVG Grain Texture Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />



      {/* 3. Main Uncluttered Editorial Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Header (Minimal Magazine Typography) */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#888888',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            {isAr ? 'جماليات سابحة · منظور أحادي' : 'Floating Visual Aesthetics · Monochromatic'}
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#111111',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {isAr ? 'توازن السكون والانعدام' : 'Weightless Form & Stillness'}
          </h2>
        </div>

        {/* 4. Floating Glassmorphism Cards Grid (No Physics Engines) */}
        <div
          style={{
            position: 'relative',
            minHeight: '480px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* FLOATING CARD 1: Top Left Offset */}
          <motion.div
            animate={isMobile ? undefined : {
              y: [0, -14, 0],
              rotate: [0, -1.2, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.65)',
              backdropFilter: isMobile ? 'none' : 'blur(24px)',
              WebkitBackdropFilter: isMobile ? 'none' : 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '20px',
              padding: '2.2rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999999', display: 'block', marginBottom: '0.8rem' }}>
                01 / GRAPHITE REALISM
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#111111', margin: 0, lineHeight: 1.25 }}>
                {isAr ? 'دقة الرصاص الظلية' : 'Precision in Pure Shadow'}
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#666666', lineHeight: 1.6, margin: '1.5rem 0 0' }}>
              {isAr
                ? 'تكوين ينعدم فيه الثقل، يطفو في مساحة متوازنة.'
                : 'A static spatial equilibrium where graphite lines suspend without tension.'}
            </p>
          </motion.div>

          {/* FLOATING CARD 2: Elevated Center Card (Monochrome Focal Point) */}
          <motion.div
            animate={isMobile ? undefined : {
              y: [0, 16, 0],
              rotate: [0, 1.5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            style={{
              backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: isMobile ? 'none' : 'blur(30px)',
              WebkitBackdropFilter: isMobile ? 'none' : 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '2.6rem',
              boxShadow: '0 45px 90px rgba(0, 0, 0, 0.08), 0 14px 28px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '300px',
              transform: isMobile ? 'none' : 'translateY(-20px)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#111111', fontWeight: 600, display: 'block', marginBottom: '0.8rem' }}>
                02 / MONOCHROME EDITION
              </span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 400, color: '#111111', margin: 0, lineHeight: 1.2 }}>
                {isAr ? 'العمق والأحادي' : 'Monochromatic Depth'}
              </h3>
            </div>

            <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777777' }}>
                STUDIO ARCHIVE © 2026
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111111' }}>
                FLOAT 02
              </span>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: Bottom Right Offset */}
          <motion.div
            animate={isMobile ? undefined : {
              y: [0, -12, 0],
              rotate: [0, -1, 0],
            }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            style={{
              backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.65)',
              backdropFilter: isMobile ? 'none' : 'blur(24px)',
              WebkitBackdropFilter: isMobile ? 'none' : 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '20px',
              padding: '2.2rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999999', display: 'block', marginBottom: '0.8rem' }}>
                03 / TACTILE CHARCOAL
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#111111', margin: 0, lineHeight: 1.25 }}>
                {isAr ? 'سكون الفحم الخام' : 'Raw Charcoal Texture'}
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#666666', lineHeight: 1.6, margin: '1.5rem 0 0' }}>
              {isAr
                ? 'مساحات بيضاء واسعة تعكس الهدوء والبساطة.'
                : 'Expansive negative space creating quiet editorial gravity.'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
