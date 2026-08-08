import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function MasterPortraitSpotlight({ onSelectArtwork }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [isZoomed, setIsZoomed] = useState(false);

  const faceSketch = {
    id: 'master-face-spotlight',
    title: 'Contemplative Profile Study',
    titleAr: 'نظرة تأملية (بورتريه واقعي)',
    subtitle: 'Masterpiece Charcoal & Pencil Portrait',
    subtitleAr: 'بورتريه فحم ورصاص دقيق',
    category: 'Pencil & Graphite',
    technique: 'Fine Graphite, Charcoal Pencil & Tortillon Blending on Fabriano Tonal Paper',
    dimensions: '30 × 42 cm (A3 Sheet)',
    year: '2025',
    status: 'Private Studio Collection',
    image: '/images/sketches/sketch_profile_portrait.jpg',
    description: 'An intimate, high-contrast portrait study exploring subtle skin transitions, reflective iris highlights, and layered natural hair textures. Rendered with extreme precision using soft charcoal and graphite stumps.',
    descriptionAr: 'دراسة واقعية مفرطة للبورتريه والملامح، تركز على الانتقالات الظلية الناعمة للانعكاسات على القزحية وتفاصيل الشعر. تم تنفيذها بدقة متناهية باستخدام الفحم والدمج الناعم على ورق فابريانو الحرفي.',
  };

  return (
    <section
      id="portrait-spotlight"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        backgroundColor: '#0F0E0D',
        color: '#FAF8F5',
        overflow: 'hidden',
        borderTop: '1px solid rgba(197, 160, 89, 0.25)',
        borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
      }}
    >
      {/* Background Studio Light Vignette */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, rgba(15, 14, 13, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C5A059',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            {isAr ? 'عَرْض البورتريه الخاص' : 'Featured Portrait Spotlight'}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 300,
              color: '#FAF8F5',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'بورتريه الملامح الحرفي' : 'The Monochromatic Face Study'}
          </h2>
          <div
            style={{
              width: '60px',
              height: '1.5px',
              backgroundColor: '#C5A059',
              margin: '1.5rem auto 0',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Unique Non-Carousel Asymmetrical Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left: Distinct Exhibition Framed Artwork Card (Passe-Partout + Gilded Inset) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              justifySelf: 'center',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            {/* Museum Solid Oak Frame */}
            <div
              style={{
                position: 'relative',
                padding: '24px',
                backgroundColor: '#FAF8F5',
                borderRadius: '4px',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.65), 0 10px 30px rgba(0,0,0,0.4)',
                border: '12px solid #1A1816',
                outline: '1px solid rgba(197, 160, 89, 0.4)',
              }}
            >
              {/* Inner Gilded Inset Line */}
              <div
                style={{
                  position: 'relative',
                  padding: '16px',
                  border: '1.5px solid #C5A059',
                  backgroundColor: '#FAF8F4',
                }}
              >
                {/* Artwork Canvas */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    borderRadius: '2px',
                    boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsZoomed(true)}
                >
                  <img
                    src={faceSketch.image}
                    alt={faceSketch.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.05) brightness(0.98)',
                      transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Hover Inspect Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(15, 14, 13, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#C5A059',
                      border: '1px solid #C5A059',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      pointerEvents: 'none',
                    }}
                  >
                    <span>🔍</span> {isAr ? 'تكبير التفاصيل' : 'Zoom Detail'}
                  </div>
                </div>

                {/* Artist Brass Nameplate */}
                <div
                  style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#1E1A16',
                    border: '1px solid #C5A059',
                    borderRadius: '2px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.9rem',
                      color: '#C5A059',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                    }}
                  >
                    MAJED ALNAHDI · MAJED-WEB
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#A0988E', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    FINE ARTIST STUDIO ARCHIVE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Editorial Story & Specifications Sheet */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              direction: isAr ? 'rtl' : 'ltr',
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '999px',
                color: '#C5A059',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              {isAr ? faceSketch.subtitleAr : faceSketch.subtitle}
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 300,
                color: '#FAF8F5',
                lineHeight: 1.15,
                margin: '0 0 1.25rem 0',
              }}
            >
              {isAr ? faceSketch.titleAr : faceSketch.title}
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                color: '#C8C2B8',
                lineHeight: 1.75,
                marginBottom: '2rem',
                fontWeight: 300,
              }}
            >
              {isAr ? faceSketch.descriptionAr : faceSketch.description}
            </p>

            {/* Spec Sheet Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1.75rem',
                marginBottom: '2.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', color: '#90887E', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  {isAr ? 'التقنية والمواد' : 'Medium & Technique'}
                </span>
                <span style={{ fontSize: '0.88rem', color: '#FAF8F5', fontWeight: 400 }}>
                  {faceSketch.technique}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#90887E', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  {isAr ? 'الأبعاد والأصل' : 'Dimensions & Year'}
                </span>
                <span style={{ fontSize: '0.88rem', color: '#FAF8F5', fontWeight: 400 }}>
                  {faceSketch.dimensions} ({faceSketch.year})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsZoomed(true)}
                style={{
                  padding: '0.85rem 1.8rem',
                  backgroundColor: '#C5A059',
                  color: '#0F0E0D',
                  border: 'none',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5C079')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C5A059')}
              >
                {isAr ? 'تكبير ملامح البورتريه 🔍' : 'Inspect Portrait Fine Detail 🔍'}
              </button>

              <button
                onClick={() => onSelectArtwork && onSelectArtwork(faceSketch)}
                style={{
                  padding: '0.85rem 1.8rem',
                  backgroundColor: 'transparent',
                  color: '#FAF8F5',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C5A059';
                  e.currentTarget.style.color = '#C5A059';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = '#FAF8F5';
                }}
              >
                {isAr ? 'تفاصيل الاقتناء' : 'Acquisition Info'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* High-Res Fullscreen Zoom Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(10, 9, 8, 0.95)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={faceSketch.image}
                alt={faceSketch.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(197, 160, 89, 0.5)',
                }}
              />
              <button
                onClick={() => setIsZoomed(false)}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: 0,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FAF8F5',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
