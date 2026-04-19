'use client';
import { useEffect, useRef } from 'react';

const FRAME_COUNT = 240;

const currentFrame = (index) => {
  const subIndex = index % 80;
  if (index < 80)
    return `/hero/Animation_of_world_202604041313_${String(subIndex).padStart(3, '0')}.jpg`;
  if (index < 160)
    return `/hero/Create_animation_with_202604041313_${String(subIndex).padStart(3, '0')}.jpg`;
  return `/hero/Delete_same_video_202604041313_${String(subIndex).padStart(3, '0')}.jpg`;
};

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const images = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const drawToCanvas = (img) => {
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;
      let dw, dh, ox, oy;
      if (canvasAspect > imgAspect) {
        dw = canvas.width; dh = canvas.width / imgAspect;
        ox = 0; oy = (canvas.height - dh) / 2;
      } else {
        dh = canvas.height; dw = canvas.height * imgAspect;
        ox = (canvas.width - dw) / 2; oy = 0;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, ox, oy, dw, dh);
    };

    const render = () => {
      const img = images.current[frameRef.current];
      if (img?.complete && img.naturalWidth) {
        drawToCanvas(img);
      } else if (images.current[0]?.complete) {
        drawToCanvas(images.current[0]);
      }
    };

    // Preload frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => { if (i === 0) { resize(); } };
      img.onerror = () => console.warn(`Frame ${i} failed: ${img.src}`);
      img.src = currentFrame(i);
      images.current[i] = img;
    }

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrollTop = window.pageYOffset;
      const containerTop = container.offsetTop;
      const containerHeight = container.scrollHeight;
      let progress = (scrollTop - containerTop) / (containerHeight - window.innerHeight);
      progress = Math.max(0, Math.min(1, progress));
      const fi = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      if (fi !== frameRef.current) {
        frameRef.current = fi;
        requestAnimationFrame(render);
      }
    };

    resize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: '300vh', position: 'relative', background: 'var(--bg-deep)' }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            minWidth: '100%', minHeight: '100%', objectFit: 'cover',
            filter: 'brightness(0.4) saturate(1.1)',
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', padding: '0 1.5rem', pointerEvents: 'none' }}>
          <div style={{
            display: 'inline-block', border: '1px solid var(--gold)', color: 'var(--gold)',
            fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', letterSpacing: '2px',
            padding: '0.35rem 1.2rem', borderRadius: '2px', marginBottom: '1.5rem',
            animation: 'fadeDown 1s ease 0.2s both',
          }}>✦ ATLAS — Your Global Travel Companion ✦</div>

          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(3.5rem, 12vw, 9rem)', fontWeight: 700,
            lineHeight: 0.9, letterSpacing: '-2px',
            animation: 'fadeDown 1s ease 0.4s both',
            color: 'white'
          }}>
            Discover <p style={{ color: 'var(--gold)' }}>The World</p>  <span style={{
              background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--terracotta-light) 60%, var(--maroon-light) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic',
            }}>The World</span>
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 300, fontStyle: 'italic',
            color: 'var(--sand)', margin: '1.2rem 0 2.5rem', opacity: 0.85,
            animation: 'fadeDown 1s ease 0.6s both',
          }}>
            Your AI-powered passport to legendary wonders, vibrant cultures, hidden cafés, &amp; bespoke itineraries
          </p>

          <form action="/route" method="GET" style={{
            display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeDown 1s ease 0.8s both', pointerEvents: 'all', maxWidth: '500px', margin: '0 auto'
          }}>
            <input
              type="text"
              name="dest"
              placeholder="e.g. Paris, Tokyo, New York..."
              style={{
                flex: 1, minWidth: '200px', padding: '1rem 1.5rem', borderRadius: '4px',
                border: '1px solid rgba(59,167,143,0.3)', background: 'rgba(13,22,20,0.5)',
                color: '#fff', fontSize: '1.1rem', outline: 'none', backdropFilter: 'blur(5px)'
              }}
              required
            />
            <button type="submit" className="btn btn-gold" style={{ padding: '1rem 2rem', border: 'none', cursor: 'pointer' }}>
              ✦ Generate AI Trip
            </button>
          </form>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '3px', color: 'var(--gold)', textTransform: 'uppercase' }}>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="#3BA78F" strokeWidth="1.5" />
            <circle cx="8" cy="7" r="2" fill="#3BA78F">
              <animate attributeName="cy" values="7;15;7" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
