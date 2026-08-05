import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

export default function FullscreenMenu({ isOpen, onClose, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { num: '01.', label: t('nav_menu_gallery'), id: 'gallery', img: '/images/ecoute_coeur.jpg' },
    { num: '02.', label: t('nav_menu_youth'), id: 'courses', img: '/images/workshop_hero.jpg' },
    { num: '03.', label: t('nav_menu_corporate'), id: 'courses', img: '/images/mock_studio.jpg' },
    { num: '04.', label: t('nav_menu_about'), id: 'about', img: '/images/majed_portrait.jpg' },
    { num: '05.', label: t('nav_menu_courses'), id: 'courses', img: '/images/mock_masterclass.jpg', soon: true }
  ];

  const handleLinkClick = (id) => {
    onClose();
    if (onNavigate) {
      setTimeout(() => onNavigate(id), 300);
    }
  };

  const handleHover = (idx) => {
    if (idx === activeIndex) return;
    setImageVisible(false);
    setTimeout(() => {
      setActiveIndex(idx);
      setImageVisible(true);
    }, 220);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`menu-overlay modal-animate-in ${isOpen ? 'is-open' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#FFFFFF',
        color: '#111111',
        zIndex: 2000,
        display: 'flex',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: isAr ? 'auto' : '40px',
          left: isAr ? '40px' : 'auto',
          fontSize: '13px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 2100,
          fontFamily: "var(--font-display)",
          color: '#111111',
          background: 'none',
          border: 'none',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        aria-label="Close menu"
      >
        ✕ {isAr ? 'إغلاق' : 'Close'}
      </button>

      {/* Left Column: Numbered Navigation Links */}
      <div
        style={{
          flex: 1.2,
          padding: isMobile ? '90px 1.5rem 40px' : '90px 80px 60px 80px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: isAr ? 'none' : '1px solid var(--border-subtle)',
          borderLeft: isAr ? '1px solid var(--border-subtle)' : 'none',
          direction: isAr ? 'rtl' : 'ltr'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
            <Logo height={40} />
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              MAJED AL NAHDI
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.num}
                  onClick={() => handleLinkClick(item.id)}
                  onMouseEnter={() => handleHover(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                    paddingBottom: '1.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  {/* Accent bar */}
                  {!isMobile && <div style={{
                    position: 'absolute',
                    left: isAr ? 'auto' : '-80px',
                    right: isAr ? '-80px' : 'auto',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: isActive ? '60px' : '0px',
                    height: '1px',
                    background: 'var(--color-brand)',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />}

                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    color: isActive ? 'var(--color-brand)' : 'rgba(0,0,0,0.35)',
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                    minWidth: '30px'
                  }}>
                    {item.num}
                  </span>

                  <span style={{
                    fontFamily: isAr ? "'Cairo', sans-serif" : "var(--font-serif)",
                    fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)',
                    color: isActive ? 'var(--text-main)' : 'rgba(0,0,0,0.55)',
                    fontWeight: 300,
                    transition: 'color 0.3s ease',
                    lineHeight: 1.1,
                    flex: 1
                  }}>
                    {item.label}
                  </span>

                  {item.soon && (
                    <span style={{
                      background: 'var(--text-main)',
                      color: '#FFFFFF',
                      fontSize: '0.58rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {isAr ? 'قريباً' : 'Soon'}
                    </span>
                  )}

                  <span style={{
                    fontSize: '1.1rem',
                    opacity: isActive ? 0.6 : 0,
                    transition: 'opacity 0.35s ease',
                    color: 'var(--color-brand)'
                  }}>
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social & Contact links */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
          marginTop: '2rem',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: 'var(--text-muted)',
            marginBottom: '12px'
          }}>
            {isAr ? 'تواصل وتواجد' : 'Contact & Social'}
          </h4>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)', flexWrap: 'wrap' }}>
            <a
              href="mailto:contact@majedalnahdi.com"
              className="link-hover-line"
              style={{ color: 'var(--text-main)', textDecoration: 'none' }}
            >
              {isAr ? 'راسلني' : 'Write to me'}
            </a>
            <a
              href="https://instagram.com/m.jn7"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover-line"
              style={{ color: 'var(--text-main)', textDecoration: 'none' }}
            >
              Instagram (@m.jn7)
            </a>
            <a
              href="#contact"
              onClick={() => handleLinkClick('contact')}
              className="link-hover-line"
              style={{ color: 'var(--text-main)', textDecoration: 'none' }}
            >
              {isAr ? 'اقتناء' : 'Acquisitions'}
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Smooth Crossfade Image Preview */}
      {!isMobile && (
      <div
        style={{
          flex: 0.8,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#F5F2EE',
        }}
      >
        {navItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${item.img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: activeIndex === idx && imageVisible ? 1 : 0,
              transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: activeIndex === idx ? 'scale(1.03)' : 'scale(1)',
              transitionProperty: 'opacity, transform'
            }}
          />
        ))}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
          zIndex: 2
        }} />
        {/* Decorative label */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          zIndex: 3,
          opacity: 0.6
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#FFFFFF'
          }}>
            {navItems[activeIndex]?.label}
          </span>
        </div>
      </div>
      )}
    </div>
  );
}
