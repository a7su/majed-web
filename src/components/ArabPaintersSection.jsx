import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ARAB_PAINTERS = [
  {
    id: 1,
    nameEn: "Mahmoud Saïd",
    nameAr: "محمود سعيد",
    era: "1897 – 1964",
    country: "Egypt · مصر",
    image: "/images/arab_painter_mahmoud.jpg",
    desc: "A pioneer of modern Egyptian art, known for his vibrant, voluptuous depictions of Egyptian life and identity.",
    descAr: "رائد الفن المصري الحديث، اشتهر بتصوير الحياة المصرية بألوان زاهية ومعبّرة."
  },
  {
    id: 2,
    nameEn: "Dia Azzawi",
    nameAr: "ضياء العزاوي",
    era: "1939 – Present",
    country: "Iraq · العراق",
    image: "/images/arab_painter_azzawi.jpg",
    desc: "A globally recognized pioneer of modern Arab art, fusing Mesopotamian heritage with contemporary expressionism.",
    descAr: "رائد عالمي في الفن العربي الحديث، يجمع بين الإرث الرافديني والتعبيرية المعاصرة."
  },
  {
    id: 3,
    nameEn: "Fayaq Hassan",
    nameAr: "فائق حسن",
    era: "1914 – 1992",
    country: "Iraq · العراق",
    image: "/images/arab_painter_fayaq.jpg",
    desc: "Often called the father of modern Iraqi art, celebrated for his masterful command of color, form, and everyday life.",
    descAr: "يُلقَّب بأبي الفن العراقي الحديث، واشتُهر بتصوير الحياة اليومية بألوان وأشكال بارعة."
  }
];

export default function ArabPaintersSection() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section
      id="arab-painters"
      style={{
        padding: '140px 2rem',
        background: 'linear-gradient(160deg, #1a0d07 0%, #2D1B10 40%, #432818 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw',
        height: '60vh',
        background: 'radial-gradient(ellipse, rgba(160,86,40,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div
          className="scroll-reveal"
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <span style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : "var(--font-display)",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: isAr ? '0.05em' : '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-brand)',
            display: 'block',
            marginBottom: '1.5rem'
          }}>
            {t('arab_subtitle')}
          </span>

          <h2 style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            letterSpacing: isAr ? '0' : '-0.02em',
            marginBottom: '2rem',
            lineHeight: 1.05
          }}>
            {t('arab_title')}
          </h2>

          <p style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
            fontSize: '1.1rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.9
          }}>
            {t('arab_desc')}
          </p>

          {/* Decorative line */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'var(--color-brand)',
            margin: '3rem auto 0'
          }} />
        </div>

        {/* Painters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '2rem',
        }}>
          {ARAB_PAINTERS.map((painter, idx) => {
            const isHovered = hoveredId === painter.id;
            return (
              <div
                key={painter.id}
                className="scroll-reveal arab-painter-card"
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: isHovered ? '1px solid rgba(160,86,40,0.6)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'border 0.5s ease, box-shadow 0.5s ease',
                  boxShadow: isHovered
                    ? '0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(160,86,40,0.15)'
                    : '0 20px 40px rgba(0,0,0,0.4)',
                  transitionDelay: `${idx * 0.08}s`
                }}
                onMouseEnter={() => setHoveredId(painter.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Background Image */}
                <div
                  className="painter-bg"
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${painter.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: isHovered ? 'grayscale(0%) brightness(0.85)' : 'grayscale(30%) brightness(0.7)',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s ease',
                    zIndex: 1
                  }}
                />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: isHovered
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(20,8,3,0.95) 65%)'
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(20,8,3,0.85) 70%)',
                  zIndex: 2,
                  transition: 'background 0.5s ease'
                }} />

                {/* Country / Era badge top-left */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  zIndex: 3,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(-8px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: 'rgba(160, 86, 40, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase'
                  }}>
                    {painter.country}
                  </span>
                </div>

                {/* Content at bottom */}
                <div
                  className="painter-content"
                  style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    padding: '2.5rem',
                    zIndex: 3,
                    transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--color-brand)',
                    display: 'block',
                    marginBottom: '0.6rem',
                    textTransform: 'uppercase'
                  }}>
                    {painter.era}
                  </span>

                  <h3 style={{
                    fontFamily: isAr ? "'Cairo', sans-serif" : "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(2rem, 3vw, 2.6rem)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                    lineHeight: 1.1
                  }}>
                    {isAr ? painter.nameAr : painter.nameEn}
                  </h3>

                  <p
                    className="painter-desc"
                    style={{
                      fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                      fontSize: '0.88rem',
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.7,
                      opacity: isHovered ? 1 : 0,
                      maxHeight: isHovered ? '120px' : '0',
                      overflow: 'hidden',
                      transition: 'opacity 0.5s ease 0.1s, max-height 0.5s ease'
                    }}
                  >
                    {isAr ? painter.descAr : painter.desc}
                  </p>
                </div>

                {/* Number indicator */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  zIndex: 3,
                  fontFamily: "var(--font-sans)",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
