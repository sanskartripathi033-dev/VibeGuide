'use client';
import { useState } from 'react';

export default function ImageWithLightbox({ src, alt, className = '', style = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, cursor: 'pointer' }}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 7, 5, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            flexDirection: 'column',
          }}
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,167,143,0.2)',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click on image closing the lightbox immediately if we wanted, but let's let any click close it.
          />
          <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Click anywhere to close
          </div>
        </div>
      )}
    </>
  );
}
