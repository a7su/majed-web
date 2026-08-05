import React, { useState } from 'react';
import { ARTWORKS_DATA } from '../data/artworks';
import ArtworkLightboxModal from './ArtworkLightboxModal';

export default function ExhibitionSection({ onInquireArtwork }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeArtwork, setActiveArtwork] = useState(null);

  const filterCategories = ['All', 'Charcoal', 'Pencil & Graphite', 'Pen & Ink'];

  const filteredArtworks = selectedFilter === 'All'
    ? ARTWORKS_DATA
    : ARTWORKS_DATA.filter((art) => art.category === selectedFilter);

  return (
    <section
      id="exhibition"
      style={{
        width: '100%',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 4vw, 2rem)',
        backgroundColor: '#050505',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header & Filters */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="font-micro" style={{ color: '#8A8A8A', letterSpacing: '0.25em', marginBottom: '0.75rem' }}>
                01 // CURATED ARCHIVE
              </div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#EAEAEA', textTransform: 'uppercase' }}>
                The Exhibition
              </h2>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                background: 'rgba(15, 15, 15, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '0.35rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {filterCategories.map((cat) => {
                const isActive = selectedFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className="font-micro"
                    style={{
                      background: isActive ? '#EAEAEA' : 'transparent',
                      color: isActive ? '#050505' : '#8A8A8A',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      transition: 'all 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
                      fontWeight: isActive ? '600' : '500'
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Masonry Layout Grid */}
        <div
          style={{
            columnCount: 1,
            columnGap: '2rem'
          }}
          className="masonry-grid"
        >
          <style>{`
            @media (min-width: 640px) {
              .masonry-grid {
                column-count: 2 !important;
              }
            }
            @media (min-width: 1024px) {
              .masonry-grid {
                column-count: 3 !important;
              }
            }
          `}</style>

          {filteredArtworks.map((artwork) => {
            const isAvailable = artwork.status === 'Available';

            return (
              <div
                key={artwork.id}
                onClick={() => setActiveArtwork(artwork)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  backgroundColor: '#0F0F0F'
                }}
                className="exhibition-card"
              >
                {/* Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)'
                    }}
                    className="card-image"
                  />

                  {/* Complex Hover Gradient Overlay & Data Reveal */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.6) 50%, transparent 100%)',
                      opacity: 0,
                      transform: 'translateY(15px)',
                      transition: 'all 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1.75rem'
                    }}
                    className="card-overlay"
                  >
                    {/* Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isAvailable ? '#22c55e' : '#ef4444',
                          boxShadow: isAvailable ? '0 0 8px #22c55e' : '0 0 8px #ef4444'
                        }}
                      />
                      <span
                        className="font-micro"
                        style={{
                          color: isAvailable ? '#22c55e' : '#ef4444',
                          fontSize: '0.65rem'
                        }}
                      >
                        {artwork.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Artwork Title */}
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: '1.5rem',
                        color: '#EAEAEA',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {artwork.title}
                    </h3>

                    {/* Artwork Specs */}
                    <p
                      className="font-micro"
                      style={{
                        color: '#8A8A8A',
                        fontSize: '0.7rem'
                      }}
                    >
                      {artwork.size} • {artwork.medium}
                    </p>
                  </div>
                </div>

                <style>{`
                  .exhibition-card:hover .card-image {
                    transform: scale(1.05);
                  }
                  .exhibition-card:hover .card-overlay {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <ArtworkLightboxModal
        artwork={activeArtwork}
        onClose={() => setActiveArtwork(null)}
        onInquire={onInquireArtwork}
      />
    </section>
  );
}
