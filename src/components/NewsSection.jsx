import React from 'react';

export default function NewsSection() {
  const newsItems = [
    {
      category: "Commission & Realization",
      title: "Alfred Sommier Prestige Portrait",
      location: "Hôtel de prestige Alfred Sommier, Paris",
      description: "Custom portrait commission exploring subtle ink textures and historical gravitas.",
      linkText: "View Commission →"
    },
    {
      category: "Seminar & Workshops",
      title: "Les Papillons Blancs Educational Session",
      location: "Le Collège de Corbeville, Saint-Martin-des-Champs",
      description: "Interactive artistic seminar exploring collective intelligence through drawing and pigment layering.",
      linkText: "Learn More →"
    },
    {
      category: "Publication & Fine Art",
      title: "Numerology Fine Art Card Deck",
      location: "Riyadh Studio & Private Publishing",
      description: "A limited-edition fine art card deck illustrated with original ink and charcoal paintings.",
      linkText: "Discover Publication →"
    }
  ];

  return (
    <section 
      id="news"
      style={{
        padding: 'clamp(64px, 9vw, 100px) clamp(1.25rem, 4vw, 2rem)',
        backgroundColor: '#FAF8F5',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div 
        style={{
          maxWidth: '1250px',
          margin: '0 auto'
        }}
      >
        <div className="scroll-reveal" style={{ marginBottom: '3.5rem' }}>
          <span 
            style={{
              fontFamily: "var(--font-display)",
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-brand)',
              display: 'block',
              marginBottom: '1rem'
            }}
          >
            Actualité / Latest News
          </span>

          <h2 
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em'
            }}
          >
            News & Exhibitions (Mon Actualité)
          </h2>
        </div>

        {/* 3-Column News Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '2.5rem'
          }}
        >
          {newsItems.map((item, index) => (
            <div 
              key={index}
              className="scroll-reveal glassmorphic-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '290px',
                transition: 'transform 0.35s var(--ease-smooth), box-shadow 0.35s var(--ease-smooth)',
                animationDelay: `${index * 0.15}s`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <span 
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand)',
                    display: 'block',
                    marginBottom: '0.75rem'
                  }}
                >
                  {item.category}
                </span>

                <h3 
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.75rem',
                    fontWeight: 400,
                    color: 'var(--text-main)',
                    lineHeight: '1.25',
                    marginBottom: '0.75rem'
                  }}
                >
                  {item.title}
                </h3>

                <p 
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}
                >
                  {item.description}
                </p>

                <p 
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--text-subtle)',
                    fontStyle: 'italic'
                  }}
                >
                  {item.location}
                </p>
              </div>

              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <span 
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-main)'
                  }}
                >
                  {item.linkText}
                </span>
                <span style={{ fontSize: '1.2rem', color: 'var(--color-brand)' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
