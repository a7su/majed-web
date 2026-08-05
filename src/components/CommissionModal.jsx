import React, { useState } from 'react';
import { X, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommissionModal({ isOpen, onClose, selectedArtwork = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    medium: selectedArtwork ? selectedArtwork.category : 'Charcoal',
    size: selectedArtwork ? selectedArtwork.size : '50x70cm',
    details: selectedArtwork ? `Inquiry regarding original piece: "${selectedArtwork.title}"` : ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 5, 5, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
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
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#EAEAEA',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div className="font-micro" style={{ color: '#8A8A8A', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          STUDIO COMMISSIONS
        </div>
        
        <h2 className="font-serif" style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: '#EAEAEA' }}>
          {selectedArtwork ? `Inquire: ${selectedArtwork.title}` : 'Commission an Original'}
        </h2>

        <p style={{ color: '#8A8A8A', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Majed Alnahdi accepts a limited number of bespoke fine art commissions per quarter. Specify your envisioned piece below.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="font-micro" style={{ display: 'block', color: '#8A8A8A', marginBottom: '0.4rem', fontSize: '0.65rem' }}>YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alexander Wright"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(5, 5, 5, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#EAEAEA',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label className="font-micro" style={{ display: 'block', color: '#8A8A8A', marginBottom: '0.4rem', fontSize: '0.65rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(5, 5, 5, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#EAEAEA',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="font-micro" style={{ display: 'block', color: '#8A8A8A', marginBottom: '0.4rem', fontSize: '0.65rem' }}>PREFERRED MEDIUM</label>
                <select
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(5, 5, 5, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#EAEAEA',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Charcoal">Charcoal on Paper</option>
                  <option value="Pencil & Graphite">Graphite / Lead Pencil</option>
                  <option value="Pen & Ink">Fine Pen & Nib Ink</option>
                  <option value="Mixed Monochrome">Mixed Monochrome</option>
                </select>
              </div>

              <div>
                <label className="font-micro" style={{ display: 'block', color: '#8A8A8A', marginBottom: '0.4rem', fontSize: '0.65rem' }}>CANVAS SIZE</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 50x70cm, A3, 100x140cm"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(5, 5, 5, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#EAEAEA',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="font-micro" style={{ display: 'block', color: '#8A8A8A', marginBottom: '0.4rem', fontSize: '0.65rem' }}>VISION & DETAILS</label>
              <textarea
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Describe your concept, portrait subject, or architectural vision..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(5, 5, 5, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#EAEAEA',
                  outline: 'none',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Send size={14} />
              <span>SUBMIT INQUIRY TO MAJED ALNAHDI</span>
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Check size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Inquiry Received</h3>
            <p style={{ color: '#8A8A8A', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Thank you, {formData.name}. Majed Alnahdi's studio manager will review your commission request and reply to {formData.email} within 48 hours.
            </p>
            <button onClick={onClose} className="btn-secondary">
              RETURN TO PORTFOLIO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
