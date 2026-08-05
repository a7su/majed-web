import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navigation({ onOpenMenu }) {
  const { language, toggleLanguage, t } = useLanguage();
  const isAr = language === 'ar';
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [langHover, setLangHover] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);

      if (currentScrollY > 100 && currentScrollY > lastScrollYRef.current + 6) {
        // Scrolling down -> hide nav
        setNavHidden(true);
      } else if (currentScrollY < lastScrollYRef.current - 6 || currentScrollY <= 60) {
        // Scrolling up -> show nav immediately
        setNavHidden(false);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`glassmorphic-nav ${navHidden ? 'nav-hidden' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: scrolled ? '64px' : '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 1rem' : '0 2.5rem',
        transition: 'all 0.4s var(--ease-smooth)',
        boxShadow: scrolled ? '0 8px 30px rgba(67,40,24,0.08)' : 'none',
      }}
    >
      {/* ──── LEFT: Language Toggle ──── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <button
          onClick={toggleLanguage}
          onMouseEnter={() => setLangHover(true)}
          onMouseLeave={() => setLangHover(false)}
          aria-label={isAr ? 'Switch to English' : 'التحويل للعربية'}
          title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          style={{
            background: langHover
              ? 'rgba(160,86,40,0.08)'
              : 'rgba(67,40,24,0.04)',
            border: `1px solid ${langHover ? 'rgba(160,86,40,0.25)' : 'rgba(67,40,24,0.10)'}`,
            borderRadius: '9999px',
            padding: '4px 5px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.35s var(--ease-smooth)',
            position: 'relative',
            overflow: 'hidden',
            width: '76px',
            height: '34px',
            direction: 'ltr',
            flexShrink: 0,
            boxShadow: langHover ? '0 4px 16px rgba(160,86,40,0.12)' : 'none',
          }}
        >
          {/* Sliding pill */}
          <div style={{
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            left: language === 'en' ? '3px' : 'calc(100% - 37px)',
            width: '34px',
            background: 'var(--text-main)',
            borderRadius: '9999px',
            transition: 'all 0.45s cubic-bezier(0.85, 0, 0.15, 1)',
          }} />

          {['EN', 'AR'].map(code => (
            <span
              key={code}
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: language === code.toLowerCase() ? '#FFFFFF' : 'var(--text-muted)',
                zIndex: 1,
                transition: 'color 0.4s ease',
                userSelect: 'none',
              }}
            >
              {code}
            </span>
          ))}
        </button>
      </div>

      {/* ──── CENTER: Artist Name ──── */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('hero');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          style={{
            textDecoration: 'none',
            color: 'var(--text-main)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <Logo height={isMobile ? 26 : 34} />
          <span style={{
            fontFamily: isAr ? "'Noto Naskh Arabic', serif" : "'Cormorant Garamond', Georgia, serif",
            fontSize: isMobile ? (isAr ? '1.15rem' : '1.3rem') : (isAr ? '1.6rem' : '1.9rem'),
            fontWeight: 300,
            letterSpacing: isAr ? '0' : '-0.01em',
            whiteSpace: 'nowrap',
            transition: 'font-size 0.4s ease',
          }}>
            {t('hero_title')}
          </span>
        </a>
      </div>

      {/* ──── RIGHT: Soon + Menu ──── */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Soon badge */}
        <div style={{
          background: 'var(--color-brand-light)',
          border: '1px solid var(--color-brand-border)',
          color: 'var(--color-brand)',
          fontSize: '0.55rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <span
            className="animate-pulse-dot"
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand)',
              display: 'inline-block',
            }}
          />
          {isAr ? 'قريباً' : 'Soon'}
        </div>

        {/* Menu button */}
        <button
          onClick={onOpenMenu}
          aria-label="Open Menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0',
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 400,
            color: 'var(--text-main)',
            letterSpacing: '0.05em',
          }}>
            {t('nav_menu')}
          </span>
          <div className="hamburger-btn">
            <span className="hamburger-line" style={{ backgroundColor: 'var(--color-brand)' }} />
            <span className="hamburger-line" style={{ backgroundColor: 'var(--color-brand)', width: '70%', marginLeft: '30%' }} />
          </div>
        </button>
      </div>
    </header>
  );
}
