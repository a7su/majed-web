import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function MasterPortraitSpotlight({ onSelectArtwork }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [isZoomed, setIsZoomed] = useState(false);

  const faceSketch = {
    id: 'master-face-spotlight',
    title: 'Contemplative Profile',
    titleAr: 'نظرة تأملية (بورتريه واقعي)',
    subtitle: 'Masterpiece Charcoal & Pencil Portrait',
    subtitleAr: 'بورتريه فحم ورصاص دقيق',
    category: 'Pencil & Graphite',
    technique: 'Fine Graphite, Charcoal Pencil & Stump Blending on Fabriano Tonal Paper',
    techniqueAr: 'فحم ناعم، رصاص وجرافيت دقيق على ورق فابريانو الحرفي',
    dimensions: '30 × 42 cm (A3 Fine Sheet)',
    dimensionsAr: '٣٠ × ٤٢ سم (ورق فابريانو أصل · ٢٠٢٥)',
    year: '2025',
    status: 'Private Studio Collection',
    image: '/images/sketches/sketch_profile_portrait.jpg',
    description: 'An intimate, high-contrast portrait exploring subtle skin transitions, reflective iris highlights, and layered natural hair textures. Rendered with extreme precision using soft charcoal and graphite stumps.',
    descriptionAr: 'بورتريه واقعي مفرط للملامح، يركز على الانتقالات الظلية الناعمة للانعكاسات على القزحية وتفاصيل الشعر. تم تنفيذه بدقة متناهية باستخدام الفحم والدمج الناعم على ورق فابريانو الحرفي.',
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
      {/* Background Studio Warm Light Vignette */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          height: '85vw',
          maxWidth: '850px',
          maxHeight: '850px',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.09) 0%, rgba(15, 14, 13, 0) 70%)',
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
            {isAr ? 'بورتريه الملامح الحرفي' : 'The Monochromatic Face Artwork'}
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

        {/* Asymmetrical Grid: Left Frame, Right Editorial Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Exhibition Framed Portrait */}
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
            {/* Museum Solid Dark Oak Frame */}
            <div
              style={{
                position: 'relative',
                padding: '24px',
                backgroundColor: '#FAF8F5',
                borderRadius: '4px',
                boxShadow: '0 35px 90px rgba(0, 0, 0, 0.75), 0 12px 35px rgba(0,0,0,0.5)',
                border: '14px solid #1A1816',
                outline: '1px solid rgba(197, 160, 89, 0.5)',
              }}
            >
              {/* Inner Gilded Gold Bevel Line */}
              <div
                style={{
                  position: 'relative',
                  padding: '16px',
                  border: '1.5px solid #C5A059',
                  backgroundColor: '#FAF8F4',
                }}
              >
                {/* Canvas Box */}
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
                      backgroundColor: 'rgba(15, 14, 13, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#C5A059',
                      border: '1px solid #C5A059',
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      pointerEvents: 'none',
                    }}
                  >
                    <span>🔍</span> {isAr ? 'تكبير ملامح البورتريه' : 'Zoom Portrait Detail'}
                  </div>
                </div>

                {/* Engraved Metallic Brass Nameplate */}
                <div
                  style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA7C11 100%)',
                    border: '1px solid #8C6211',
                    borderRadius: '3px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.6)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1rem',
                      color: '#1A1408',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    MAJED ALNAHDI
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#3D2A04',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    {isAr ? 'بورتريه واقعي · تشكيلة المرسم الخاص' : 'FINE ARTIST ORIGINAL PORTRAIT'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Specifications Sheet */}
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
                padding: '0.4rem 0.95rem',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '999px',
                color: '#C5A059',
                fontSize: '0.72rem',
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
                fontFamily: "var(--font-serif)",
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
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
                fontSize: '1.02rem',
                color: '#D4CEB8',
                lineHeight: 1.8,
                marginBottom: '2.25rem',
                fontWeight: 300,
              }}
            >
              {isAr ? faceSketch.descriptionAr : faceSketch.description}
            </p>

            {/* Spec Sheet Grid (Clean RTL/LTR Support) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                borderTop: '1px solid rgba(197, 160, 89, 0.2)',
                paddingTop: '1.75rem',
                marginBottom: '2.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#C5A059',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: 500,
                  }}
                >
                  {isAr ? 'التقنية والخامات' : 'Medium & Materials'}
                </span>
                <span style={{ fontSize: '0.92rem', color: '#FAF8F5', fontWeight: 400, lineHeight: 1.5, display: 'block' }}>
                  {isAr ? faceSketch.techniqueAr : faceSketch.technique}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#C5A059',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontWeight: 500,
                  }}
                >
                  {isAr ? 'المقاس وتاريخ الإنجاز' : 'Dimensions & Year'}
                </span>
                <span style={{ fontSize: '0.92rem', color: '#FAF8F5', fontWeight: 400, lineHeight: 1.5, display: 'block' }}>
                  {isAr ? faceSketch.dimensionsAr : `${faceSketch.dimensions} (${faceSketch.year})`}
                </span>
              </div>
            </div>

            {/* Interactive Action CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsZoomed(true)}
                style={{
                  padding: '0.9rem 2rem',
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
                  boxShadow: '0 10px 25px rgba(197, 160, 89, 0.25)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5C079';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C5A059';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isAr ? 'عاين دقة ملامح البورتريه 🔍' : 'Inspect Portrait Fine Detail 🔍'}
              </button>

              <button
                onClick={() => onSelectArtwork && onSelectArtwork(faceSketch)}
                style={{
                  padding: '0.9rem 2rem',
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
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = '#FAF8F5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isAr ? 'تفاصيل الاقتناء' : 'Acquisition Info'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* High-Res Lightbox Modal */}
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
                  boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
                  border: '1.5px solid #C5A059',
                }}
              />
              <button
                onClick={() => setIsZoomed(false)}
                style={{
                  position: 'absolute',
                  top: '-45px',
                  right: 0,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FAF8F5',
                  fontSize: '1.8rem',
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
