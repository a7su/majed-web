import React, { useState } from 'react';
import { ArrowUpRight, Instagram, Twitter, Mail } from 'lucide-react';
import CommissionModal from './CommissionModal';

export default function InquiriesFooter({ externalCommissionOpen = false, onCloseCommission }) {
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);

  const handleOpenCommission = () => {
    setIsCommissionOpen(true);
  };

  const handleCloseCommission = () => {
    setIsCommissionOpen(false);
    if (onCloseCommission) onCloseCommission();
  };

  const effectiveOpen = isCommissionOpen || externalCommissionOpen;

  return (
    <footer
      id="inquiries"
      style={{
        width: '100%',
        backgroundColor: '#050505',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10rem 2rem 4rem 2rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div className="font-micro" style={{ color: '#8A8A8A', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>
          04 // PRIVATE COMMISSIONS & INQUIRIES
        </div>

        {/* Monumental Text Trigger */}
        <button
          onClick={handleOpenCommission}
          className="font-serif"
          style={{
            fontSize: 'clamp(2.75rem, 8vw, 7.5rem)',
            color: '#EAEAEA',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '3rem',
            transition: 'all 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#EAEAEA';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>COMMISSION AN ORIGINAL</span>
          <ArrowUpRight size={48} style={{ opacity: 0.7 }} />
        </button>

        {/* Social Links Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            marginBottom: '6rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <a
            href="https://instagram.com/m.jn7"
            target="_blank"
            rel="noopener noreferrer"
            className="font-micro"
            style={{
              color: '#8A8A8A',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EAEAEA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')}
          >
            <Instagram size={14} />
            <span>INSTAGRAM (@M.JN7)</span>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-micro"
            style={{
              color: '#8A8A8A',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EAEAEA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')}
          >
            <Twitter size={14} />
            <span>TWITTER / X</span>
          </a>

          <a
            href="mailto:majed@alnahdi.studio"
            className="font-micro"
            style={{
              color: '#8A8A8A',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EAEAEA')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')}
          >
            <Mail size={14} />
            <span>STUDIO EMAIL</span>
          </a>
        </div>

        {/* Copyright & Credits */}
        <div
          style={{
            width: '100%',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            color: '#8A8A8A',
            fontSize: '0.7rem'
          }}
          className="font-micro"
        >
          <div>
            © 2026 MAJED ALNAHDI STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div>
            SWISS TYPOGRAPHIC ARCHITECTURE & WEBGL INTEGRATION
          </div>
        </div>
      </div>

      {/* Commission Modal */}
      <CommissionModal isOpen={effectiveOpen} onClose={handleCloseCommission} />
    </footer>
  );
}
