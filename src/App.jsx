import React, { useEffect, useState, useRef, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import AntigravitySection from './components/AntigravitySection';
import MarqueeDivider from './components/MarqueeDivider';
import CourseSection from './components/CourseSection';
import ArabPaintersSection from './components/ArabPaintersSection';
import NewsSection from './components/NewsSection';
import NewsletterSection from './components/NewsletterSection';
import ArtworkModal from './components/ArtworkModal';
import FullscreenMenu from './components/FullscreenMenu';
import FooterSection from './components/FooterSection';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [inquiryArtwork, setInquiryArtwork] = useState(null);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // IntersectionObserver for scroll-reveal animations
  useEffect(() => {
    if (loading) {
      document.body.classList.add('loading');
      return;
    }
    document.body.classList.remove('loading');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
    );

    const els = document.querySelectorAll('.scroll-reveal');
    els.forEach(el => observer.observe(el));

    return () => els.forEach(el => observer.unobserve(el));
  }, [loading]);

  // Scroll-fade effect: gently fade hero section as user scrolls away (desktop only — causes visual bugs + jank on phones)
  useEffect(() => {
    if (loading) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroEl = document.getElementById('hero');
          if (heroEl) {
            const progress = Math.min(scrollY / (window.innerHeight * 0.7), 1);
            heroEl.style.opacity = `${1 - progress * 0.35}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInquireArtwork = (artwork) => {
    setInquiryArtwork(artwork);
    setTimeout(() => handleNavigate('contact'), 100);
  };

  const handleInquireCourse = () => {
    setInquiryArtwork({ title: 'Art of Ink & Charcoal Drawing Masterclass' });
    setTimeout(() => handleNavigate('contact'), 100);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Preloader */}
      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Navigation */}
      <Navigation onOpenMenu={() => setIsMenuOpen(true)} />

      {/* Fullscreen Menu */}
      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Hero */}
      <HeroSection
        onExplore={() => handleNavigate('about')}
        onSelectArtwork={art => setSelectedArtwork(art)}
        onNavigate={handleNavigate}
      />

      {/* About */}
      <AboutSection onReadMore={() => handleNavigate('gallery')} />

      {/* Gallery */}
      <GallerySection onSelectArtwork={art => setSelectedArtwork(art)} />

      {/* Antigravity Floating Editorial Section */}
      <AntigravitySection />

      {/* Marquee divider */}
      <MarqueeDivider />

      {/* Arab Painters */}
      <ArabPaintersSection />

      {/* Workshops & Courses */}
      <CourseSection onInquireCourse={handleInquireCourse} />

      {/* News */}
      <NewsSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer + Contact Form */}
      <FooterSection
        inquiryArtwork={inquiryArtwork}
        onCloseInquiry={() => setInquiryArtwork(null)}
      />

      {/* Artwork modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onInquire={handleInquireArtwork}
        />
      )}
    </div>
  );
}
