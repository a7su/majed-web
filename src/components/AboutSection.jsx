import React from 'react';
import FloatingCanvas from './FloatingCanvas';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutSection({ onReadMore }) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section 
      id="about"
      style={{
        padding: 'clamp(64px, 9vw, 100px) clamp(1.25rem, 4vw, 2rem)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '4rem',
          alignItems: 'center',
          direction: isAr ? 'rtl' : 'ltr'
        }}
      >
        {/* Left Column: Text & Typography */}
        <div className="scroll-reveal">
          <span 
            style={{
              fontFamily: isAr ? "'Cairo', sans-serif" : "var(--font-display)",
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: isAr ? '0.05em' : '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-brand)',
              display: 'block',
              marginBottom: '1.25rem'
            }}
          >
            {t('about_title')}
          </span>

          <h2 
            style={{
              fontFamily: isAr ? "'PalestineFont', serif" : "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: '1.1',
              color: 'var(--text-main)',
              letterSpacing: isAr ? '0' : '-0.03em',
              marginBottom: '2rem'
            }}
          >
            {isAr ? 'ماجد النهدي' : 'majed alnahdi'}
          </h2>

          <p 
            style={{
              fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              fontWeight: 300,
              lineHeight: '1.8',
              color: 'var(--text-muted)',
              marginBottom: '1.75rem',
              maxWidth: '560px'
            }}
          >
            {t('about_text1')}
          </p>

          <p 
            style={{
              fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
              fontWeight: 300,
              lineHeight: '1.8',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              maxWidth: '560px'
            }}
          >
            {t('about_text2')}
          </p>

          {/* Arabic Button Badge Container */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <span className="btn-arabic-badge" style={{ background: 'var(--color-brand-light)', border: '1px solid var(--color-brand-border)', color: 'var(--color-brand)', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
              رسّام درجة اولى
            </span>
            <span className="btn-arabic-badge" style={{ background: 'var(--color-brand-light)', border: '1px solid var(--color-brand-border)', color: 'var(--color-brand)', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
              الرسم بالحبر
            </span>
            <span className="btn-arabic-badge" style={{ background: 'var(--color-brand-light)', border: '1px solid var(--color-brand-border)', color: 'var(--color-brand)', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
              رسامين العرب
            </span>
          </div>

          <div>
            <button 
              onClick={onReadMore}
              className="link-hover-line"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: isAr ? "'Cairo', sans-serif" : "var(--font-display)",
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: isAr ? '0.02em' : '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
                padding: '0 0 6px 0'
              }}
            >
              {t('about_readmore')} {isAr ? '←' : '→'}
            </button>
          </div>
        </div>

        {/* Right Column: Floating Canvas Artist Studio Portrait */}
        <div className="scroll-reveal delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
          <FloatingCanvas delay={0.8}>
            <div 
              className="shadow-expansive"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                aspectRatio: '3/4',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <img 
                src="/images/majed_portrait.jpg" 
                alt="Majed Alnahdi — Artist Portrait"
                className="monochrome-reveal"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {/* Glassmorphic floating caption */}
              <div 
                className="glassmorphic-pill"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px'
                }}
              >
                <span 
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-main)'
                  }}
                >
                  Riyadh Studio — @m.jn7
                </span>
              </div>
            </div>
          </FloatingCanvas>
        </div>
      </div>
    </section>
  );
}
