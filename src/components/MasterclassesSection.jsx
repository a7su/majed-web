import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, ArrowRight } from 'lucide-react';

export default function MasterclassesSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#8a8a8a', '#333333']
      });
    }, 600);
  };

  return (
    <section
      id="masterclasses"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(5rem, 10vw, 10rem) 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#050505'
      }}
    >
      {/* Background Image: Heavily Blurred Studio Workbench */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/images/mock_masterclass.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(28px) brightness(0.25) contrast(1.2)',
          transform: 'scale(1.1)',
          pointerEvents: 'none'
        }}
      />

      {/* Dark Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, #050505 90%)',
          pointerEvents: 'none'
        }}
      />

      {/* Centered Glassmorphic Card */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '640px',
          borderRadius: '1.5rem',
          padding: 'clamp(2rem, 6vw, 3rem) clamp(1.25rem, 5vw, 2.5rem)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(15, 15, 15, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Top Badge: Pill with Pulsing Red Dot */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '1.5rem'
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 10px #ef4444'
            }}
          />
          <span
            className="font-micro"
            style={{
              color: '#ef4444',
              fontSize: '0.65rem',
              letterSpacing: '0.12em'
            }}
          >
            WAITLIST OPEN
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#EAEAEA',
            marginBottom: '1rem',
            lineHeight: 1.15
          }}
        >
          The Art of Shadow: Masterclasses
        </h2>

        {/* Description */}
        <p
          style={{
            color: '#8A8A8A',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '500px',
            margin: '0 auto 2.5rem auto'
          }}
        >
          Learn advanced shading, hyper-realism, and structural drawing techniques in charcoal, pen, and pencil directly from Majed Alnahdi.
        </p>

        {/* Form UI */}
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxWidth: '460px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(5, 5, 5, 0.8)',
                borderRadius: '9999px',
                padding: '0.35rem 0.35rem 0.35rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#EAEAEA',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{isSubmitting ? 'JOINING...' : 'JOIN WAITLIST'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
            <span className="font-micro" style={{ fontSize: '0.6rem', color: '#8A8A8A' }}>
              EXCLUSIVE BATCH LIMITED TO 25 ARTISTS. NO SPAM.
            </span>
          </form>
        ) : (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#22c55e'
            }}
          >
            <Check size={18} />
            <span className="font-micro" style={{ fontSize: '0.75rem' }}>
              YOU ARE ON THE EXCLUSIVE WAITLIST. INVITATIONS WILL BE SENT SHORTLY.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
