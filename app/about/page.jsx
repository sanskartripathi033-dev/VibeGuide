'use client';
import Navbar from '@/components/Navbar';
import ImageWithLightbox from '@/components/ImageWithLightbox';
import Link from 'next/link';
import { useEffect } from 'react';

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function AboutPage() {
  useReveal();

  return (
    <>
      <Navbar />

      <section className="section-bg" style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center' }}>
        <img className="section-bg-img" src="/thumbnails/Nahar Garh.png" alt="" aria-hidden="true" />
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(16,12,7,0.97)0%,rgba(13,10,7,0.93)100%)' }} />
        
        <div className="container">
          <div className="about-grid reveal">
            <div className="about-image-stack">
              <ImageWithLightbox
                src="/thumbnails/City Palace.png"
                alt="City Palace"
                className="about-img about-img-main"
              />
              <ImageWithLightbox
                src="/thumbnails/Jal Mahal.png"
                alt="Jal Mahal"
                className="about-img about-img-secondary"
              />
              <div className="about-badge-float">
                <strong>3C</strong><span>Founded</span>
              </div>
            </div>
            
            <div className="about-text">
              <div className="section-label">✦ About Jaipur</div>
              <h2 className="section-title">The Soul of <em>Rajput Royalty</em></h2>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Founded in <strong style={{ color: 'var(--gold)' }}>1727</strong> by Maharaja Sawai Jai Singh II, Jaipur is India&apos;s first planned city — a masterpiece of Vedic architecture and urban design. Its distinctive pink-hued buildings earned it the name <em>&quot;Pink City&quot;</em>.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                A UNESCO World Heritage City since 2019, Jaipur sits at the heart of India&apos;s Golden Triangle — Delhi · Agra · Jaipur — drawing millions enchanted by its opulent forts, gem bazaars, block-print textiles, and legendary cuisine.
              </p>
              
              <div className="about-facts">
                {[
                  ['🌡️', 'Climate', 'Oct–Mar is ideal; summers reach 45°C'],
                  ['🗣️', 'Languages', 'Hindi, Rajasthani, English widely spoken'],
                  ['🍛', 'Must Eat', 'Dal Baati Churma, Ghewar, Pyaaz Kachori'],
                  ['🏆', 'Heritage', 'UNESCO World Heritage City — 2019'],
                  ['💎', 'Famous For', 'Gemstones, Johari Bazaar, Block Printing'],
                  ['🎪', 'Top Festival', 'Jaipur Literature Festival (Jan), Teej'],
                ].map(([icon, label, val]) => (
                  <div className="fact-card" key={label}>
                    <div className="fact-icon">{icon}</div>
                    <div className="fact-label">{label}</div>
                    <div className="fact-value">{val}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link href="/login" className="btn btn-gold">✦ Start Exploring Jaipur →</Link>
                <Link href="/" className="btn btn-ghost">← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-grid { display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center; }
        .about-image-stack { position:relative;height:500px; }
        .about-img { position:absolute;border-radius:4px;object-fit:cover;transition:transform 0.4s; }
        .about-img:hover { transform:scale(1.03);z-index:5; }
        .about-img-main { width:72%;height:80%;top:0;left:0;box-shadow:12px 12px 40px rgba(0,0,0,0.7);border:1px solid rgba(212,175,55,0.2); }
        .about-img-secondary { width:55%;height:55%;bottom:0;right:0;box-shadow:8px 8px 30px rgba(0,0,0,0.6);border:1px solid rgba(192,92,66,0.3); }
        .about-badge-float { position:absolute;top:50%;left:58%;transform:translate(-50%,-50%);background:linear-gradient(135deg,var(--maroon),var(--terracotta-dark));border-radius:50%;width:100px;height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(128,0,0,0.6);z-index:6;pointer-events:none; }
        .about-badge-float strong { font-size:1.8rem;font-family:'Playfair Display',serif;color:var(--gold);line-height:1; }
        .about-badge-float span { font-size:0.6rem;letter-spacing:2px;color:var(--sand);text-transform:uppercase; }
        .about-facts { display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin:2rem 0; }
        .fact-card { background:var(--bg-card2);border:1px solid rgba(212,175,55,0.12);border-radius:4px;padding:1.2rem;transition:border-color 0.3s,box-shadow 0.3s; }
        .fact-card:hover { border-color:rgba(212,175,55,0.4);box-shadow:0 4px 20px rgba(212,175,55,0.08); }
        .fact-icon { font-size:1.4rem;margin-bottom:0.4rem; }
        .fact-label { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold); }
        .fact-value { font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--text-main);margin-top:0.2rem; }

        @media(max-width:900px){
          .about-grid{grid-template-columns:1fr}
          .about-image-stack{height:380px}
        }
        @media(max-width:600px){
          .about-facts{grid-template-columns:1fr}
        }
      `}</style>
    </>
  );
}
