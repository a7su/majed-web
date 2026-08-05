import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section 
      style={{
        padding: 'clamp(64px, 9vw, 100px) clamp(1.25rem, 4vw, 2rem)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}
    >
      <div 
        className="scroll-reveal"
        style={{
          maxWidth: '620px',
          margin: '0 auto'
        }}
      >
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
          Newsletter / Lettre d'information
        </span>

        <h2 
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 300,
            color: 'var(--text-main)',
            lineHeight: '1.2',
            marginBottom: '1.25rem'
          }}
        >
          Stay Informed of My Latest Creations
        </h2>

        <p 
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: '1.7',
            marginBottom: '2.5rem'
          }}
        >
          Subscribe to receive exclusive insights into private artwork releases, studio updates, and upcoming exhibition invitations. ✨
        </p>

        {subscribed ? (
          <div 
            style={{
              padding: '1.25rem 2rem',
              backgroundColor: 'var(--color-brand-light)',
              border: '1px solid var(--color-brand-border)',
              borderRadius: '9999px',
              color: 'var(--color-brand)',
              fontFamily: "var(--font-display)",
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Thank you for subscribing! / شكراً لاشتراكك
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid var(--text-main)',
              paddingBottom: '8px',
              gap: '1rem'
            }}
          >
            <input 
              type="email" 
              placeholder="Your email address / عنوان بريدك الإلكتروني..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: 'var(--text-main)'
              }}
            />
            <button 
              type="submit"
              aria-label="Subscribe"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.4rem',
                color: 'var(--color-brand)',
                transition: 'transform 0.2s ease'
              }}
            >
              →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
