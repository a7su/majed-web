import React from 'react';
import { X, Award, ShieldCheck } from 'lucide-react';

export default function BiographyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          backgroundColor: '#0F0F0F',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'relative',
          color: '#EAEAEA'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.75rem',
            right: '1.75rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#EAEAEA',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          <X size={18} />
        </button>

        <div className="font-micro" style={{ color: '#8A8A8A', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          BIOGRAPHY & PHILOSOPHY
        </div>
        
        <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)', marginBottom: '1.5rem', color: '#EAEAEA' }}>
          Majed Alnahdi (@m.jn7)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', fontSize: '0.95rem', color: '#8A8A8A', lineHeight: 1.7 }}>
          <p>
            Majed Alnahdi is a master draughtsman based in Saudi Arabia whose artistic practice centers on the profound interplay between shadow and light. Eliminating the distraction of color, Majed works exclusively in monochrome mediums—compressed charcoal, willow sticks, fine graphite pencils, and archival pen & ink.
          </p>

          <p>
            His philosophy is rooted in classical draughtsmanship combined with contemporary photorealism. Each piece requires tens to hundreds of hours of painstaking layering, stump blending, and precision crosshatching. To Majed, black is not the absence of light, but a physical depth containing infinite emotional nuances.
          </p>
        </div>

        {/* Pillars / Specs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="font-micro" style={{ color: '#EAEAEA', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: '#8A8A8A' }} />
              MEDIUM MASTERY
            </div>
            <div style={{ fontSize: '0.85rem', color: '#8A8A8A' }}>
              Willow & Compressed Charcoal, 9B Graphite, Archival Ink Nibs on Cotton Rag.
            </div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="font-micro" style={{ color: '#EAEAEA', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={14} style={{ color: '#8A8A8A' }} />
              EXHIBITIONS
            </div>
            <div style={{ fontSize: '0.85rem', color: '#8A8A8A' }}>
              Featured in international galleries across Riyadh, Dubai, London, and Paris.
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary">
            CLOSE JOURNEY
          </button>
        </div>
      </div>
    </div>
  );
}
