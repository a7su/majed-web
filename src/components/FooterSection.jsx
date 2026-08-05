import React, { useState } from 'react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

export default function FooterSection({ inquiryArtwork, onCloseInquiry }) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      if (onCloseInquiry) onCloseInquiry();
    }, 4000);
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focusedField === field ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)'}`,
    padding: '0.85rem 0',
    color: '#FFFFFF',
    fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.35s ease',
    direction: isAr ? 'rtl' : 'ltr'
  });

  const labelStyle = {
    display: 'block',
    fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: 300,
    letterSpacing: isAr ? '0.05em' : '0.15em',
    textTransform: 'uppercase',
    color: '#888888',
    marginBottom: '0.5rem'
  };

  return (
    <footer
      id="contact"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Main Content Area */}
      <div style={{ backgroundColor: '#432818', color: '#FFFFFF', padding: 'clamp(72px, 10vw, 120px) clamp(1.25rem, 4vw, 2rem) 80px' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '5rem',
          direction: isAr ? 'rtl' : 'ltr'
        }}>

          {/* Left Column: Brand & Manifesto */}
          <div className="scroll-reveal">
            <span style={{
              fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 300,
              letterSpacing: isAr ? '0.05em' : '0.25em',
              textTransform: 'uppercase',
              color: '#888888',
              display: 'block',
              marginBottom: '1rem'
            }}>
              {t('contact_title')}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Logo height={50} />
              <h2 style={{
                fontFamily: isAr ? "'PalestineFont', serif" : 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 300,
                fontStyle: isAr ? 'normal' : 'italic',
                lineHeight: '1'
              }}>
                {isAr ? 'ماجد النهدي' : 'Majed Alnahdi'}
              </h2>
            </div>

            <p style={{
              fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: '1.8',
              color: '#AAAAAA',
              maxWidth: '420px',
              marginBottom: '2.5rem',
              direction: isAr ? 'rtl' : 'ltr'
            }}>
              {t('contact_desc')}
            </p>

            <div style={{ fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)', fontSize: '0.85rem', color: '#888888', direction: isAr ? 'rtl' : 'ltr' }}>
              <p style={{ marginBottom: '4px' }}>Majed Alnahdi Fine Art Studio</p>
              <p>@m.jn7 — contact@majed-art.com</p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="scroll-reveal delay-200">
            {inquiryArtwork && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                direction: isAr ? 'rtl' : 'ltr'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Inquiry regarding:
                  </span>
                  <p style={{ fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-serif)', fontSize: '1.2rem', fontStyle: isAr ? 'normal' : 'italic' }}>
                    {inquiryArtwork.title}
                  </p>
                </div>
                <button
                  onClick={onCloseInquiry}
                  style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ×
                </button>
              </div>
            )}

            {submitted ? (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2.5rem',
                borderRadius: '10px',
                textAlign: isAr ? 'right' : 'left',
                animation: 'fadeIn 0.5s ease forwards'
              }}>
                <h3 style={{
                  fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-serif)',
                  fontSize: '2rem',
                  fontStyle: isAr ? 'normal' : 'italic',
                  marginBottom: '1rem'
                }}>
                  {t('contact_thanks')}
                </h3>
                <p style={{ fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)', fontSize: '0.9rem', color: '#AAAAAA' }}>
                  {t('contact_thanks_sub')}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  direction: isAr ? 'rtl' : 'ltr'
                }}
              >
                <div>
                  <label style={labelStyle}>{t('contact_name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isAr ? 'الاسم الكامل' : 'John Doe'}
                    style={inputStyle('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t('contact_email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={isAr ? 'البريد الإلكتروني' : 'john@example.com'}
                    style={inputStyle('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t('contact_msg')}</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'أودّ الاستفسار عن...' : 'I would like to inquire about acquiring...'}
                    style={{ ...inputStyle('message'), resize: 'none' }}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    background: '#FFFFFF',
                    color: '#432818',
                    border: 'none',
                    padding: '1.1rem 2.5rem',
                    borderRadius: '9999px',
                    fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                    fontSize: isAr ? '0.88rem' : '0.75rem',
                    fontWeight: 600,
                    letterSpacing: isAr ? '0.02em' : '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    transition: 'all 0.35s ease',
                    alignSelf: isAr ? 'flex-start' : 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
                    e.currentTarget.style.background = 'var(--color-brand)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#432818';
                  }}
                >
                  {t('contact_send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar — darker shade */}
      <div style={{ backgroundColor: '#2D1B10', padding: '2rem' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          <span style={{
            fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
            fontSize: '0.75rem',
            color: '#888888'
          }}>
            © {new Date().getFullYear()} Majed Alnahdi (@m.jn7). {t('contact_rights')}
          </span>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('hero');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                color: '#888888',
                fontSize: '0.75rem',
                textDecoration: 'none',
                fontFamily: isAr ? "'Cairo', sans-serif" : 'var(--font-sans)',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888888'}
            >
              {t('contact_back')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
