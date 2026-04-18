'use client';
import Navbar from '@/components/Navbar';
import HeroCanvas from '@/components/HeroCanvas';
import HeatMap from '@/components/HeatMap';
import LanguageTranslator from '@/components/LanguageTranslator';
import NearbyMonuments from '@/components/NearbyMonuments';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ImageWithLightbox from '@/components/ImageWithLightbox';

/* ── helpers ── */
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

function switchTab(name) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', ['cafes', 'restaurants', 'shops'][i] === name);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${name}`);
  });
}

export default function HomePage() {
  const [user, setUser] = useState(null);
  useReveal();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
  }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <div id="home" className="hero-animation-container">
        <HeroCanvas />
        <div className="hero-content">
          <div className="hero-badge reveal">✦ VibeGuide — Your Jaipur Travel Companion ✦</div>
          <h1 className="hero-title reveal">
            Discover<span>Jaipur</span>
          </h1>
          <p className="hero-sub reveal">
            Your royal guide to Jaipur's legendary forts, living bazaars, hidden cafés & golden sunsets of Rajasthan
          </p>
          <div className="hero-cta reveal">
            <a href="#monuments" className="btn btn-primary">⬡ Iconic Monuments</a>
            <a href="#explore" className="btn btn-gold">☕ Cafés & Bazaars</a>
            <a href="#ride" className="btn btn-ghost">🚖 Plan Your Ride</a>
          </div>
        </div>
      </div>

      {/* ── ABOUT MINI ── */}
      <section id="about" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(20,36,32,0.97)0%,rgba(13,22,20,0.93)100%)' }} />
        <div className="container">
          <div className="about-grid reveal">
            <div className="about-text" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <div className="section-label">✦ The Pink City</div>
              <h2 className="section-title">The Soul of <em>Rajput Royalty</em></h2>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Founded in <strong>1727</strong>, Jaipur is India's first planned city — a masterpiece of Vedic architecture. 
                Its rose-red sandstone walls and opulent palaces tell tales of a thousand years of desert glory.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <Link href="/about" className="btn btn-ghost btn-sm">Read Our Story →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROXIMITY DISCOVERY ── */}
      <section id="nearby" className="section-bg" style={{ padding: '4rem 2rem' }}>
        <div className="container reveal">
          <NearbyMonuments />
        </div>
      </section>

      {/* ── MONUMENTS ── */}
      <section id="monuments" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'rgba(13,22,20,0.88)' }} />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">✦ Heritage Landmarks</div>
            <h2 className="section-title">Jaipur&apos;s <em>Timeless Monuments</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Five centuries of Rajput glory carved in rose-red sandstone and sky-piercing minarets.</p>
          </div>
          <div className="ornament reveal">
            <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line rev" />
          </div>
          <div className="monuments-grid">
            {[
              { img: '/thumbnails/Hawa Mahal.png', tag: 'Iconic Landmark', name: 'Hawa Mahal', desc: 'The "Palace of Winds" — built in 1799 with 953 intricately carved windows allowing royal women to observe street festivals.', maps: 'Hawa+Mahal+Jaipur' },
              { img: '/thumbnails/Amber Fort.png', tag: 'UNESCO Heritage', name: 'Amber Fort', desc: 'A hilltop marvel of red sandstone & marble. Explore the Sheesh Mahal — a hall of mirrors that glitters like a thousand stars.', maps: 'Amer+Fort+Jaipur' },
              { img: '/thumbnails/City Palace.png', tag: 'Royal Residence', name: 'City Palace', desc: 'A royal complex still home to the Jaipur royal family. Houses a museum with armour, carpets, and silver vessels.', maps: 'City+Palace+Jaipur' },
              { img: '/thumbnails/Jantar Mantar.png', tag: 'UNESCO — Astronomy', name: 'Jantar Mantar', desc: "The world's largest stone sundial and a collection of 19 astronomical instruments. Accurate to within two seconds.", maps: 'Jantar+Mantar+Jaipur' },
              { img: '/thumbnails/Nahar Garh.png', tag: 'Sunset Fortress', name: 'Nahargarh Fort', desc: 'Perched on the Aravalli ridge, Nahargarh offers a panoramic canvas of the Pink City as it turns amber at dusk.', maps: 'Nahargarh+Fort+Jaipur' },
              { img: '/thumbnails/Jal Mahal.png', tag: 'Water Palace', name: 'Jal Mahal', desc: 'A five-storey palace that appears to float on Man Sagar Lake — four floors submerged beneath the water.', maps: 'Jal+Mahal+Jaipur' },
            ].map(({ img, tag, name, desc, maps }) => (
              <div className="monument-card reveal" key={name}>
                <ImageWithLightbox src={img} alt={name} className="monument-img" />
                <div className="monument-overlay">
                  <div className="monument-tag">✦ {tag}</div>
                  <div className="monument-name">{name}</div>
                  <div className="monument-desc">{desc}</div>
                  <div className="monument-action">
                    <a href={`https://maps.google.com/?q=${maps}`} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">📍 View on Map</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section id="explore" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(18,14,8,0.97)0%,rgba(13,22,20,0.93)100%)' }} />
        <div className="container">
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <div className="section-label">✦ Eat, Shop & Unwind</div>
            <h2 className="section-title">Explore <em>Jaipur&apos;s Flavours</em></h2>
            <p className="section-desc">From centuries-old bazaars to specialty coffee roasters — the city rewards every wanderer.</p>
          </div>
          <div className="tabs reveal">
            <button className="tab active" onClick={() => switchTab('cafes')}>☕ Cafés</button>
            <button className="tab" onClick={() => switchTab('restaurants')}>🍽 Restaurants</button>
            <button className="tab" onClick={() => switchTab('shops')}>🛍 Bazaars</button>
          </div>

          <div className="tab-panel active" id="tab-cafes">
            {[
              { img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', cat: '☕ Specialty Coffee', name: 'Anokhi Café', info: 'Breezy courtyard café with artisan coffee, fresh salads, and block-print interiors.', tags: ['Courtyard', 'Artisan'], q: 'Anokhi+Cafe+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', cat: '☕ Rooftop Café', name: 'Tapri Central', info: "Jaipur's most beloved chai café with rooftop views of the old city and artisanal blends.", tags: ['Rooftop', 'Chai'], q: 'Tapri+Central+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', cat: '☕ Heritage Café', name: 'Café Palladio', info: 'A jaw-dropping Indo-Italian space inside a 300-year-old haveli with hand-painted murals.', tags: ['Heritage', 'Design'], q: 'Cafe+Palladio+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <ImageWithLightbox src={img} alt={name} className="place-img" />
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-teal btn-sm">📍 Directions</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-panel" id="tab-restaurants">
            {[
              { img: 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?w=600&q=80', cat: '🍽 Royal Dining', name: 'Suvarna Mahal', info: 'Dine like royalty inside the Rambagh Palace. Gold leaf ceilings and traditional royal thali.', tags: ['Fine Dining', 'Royal'], q: 'Suvarna+Mahal+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', cat: '🍽 Street Food King', name: 'LMB Jaipur', info: 'Beloved sweets shop and restaurant since 1954. Pyaaz kachori and ghewar are mandatory.', tags: ['Legendary', 'Sweets'], q: 'LMB+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80', cat: '🍽 Traditional', name: 'Handi Restaurant', info: 'Jaipur institution for authentic Rajasthani dal baati churma and clay oven specialties.', tags: ['Authentic', 'Folk music'], q: 'Handi+Restaurant+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <ImageWithLightbox src={img} alt={name} className="place-img" />
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">📍 Directions</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-panel" id="tab-shops">
            {[
              { img: 'https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=600&q=80', cat: '🛍 Jewellery', name: 'Johari Bazaar', info: "The heartbeat of Jaipur's gem trade. Rubies, emeralds, and kundan jewellery since the 16th century.", tags: ['Gems', 'Jewellery'], q: 'Johari+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cat: '🛍 Textiles', name: 'Bapu Bazaar', info: "Go-to for block-print fabrics, mojari shoes, and Rajasthani lac bangles. Bargaining welcomed.", tags: ['Prints', 'Shoes'], q: 'Bapu+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', cat: '🛍 Curated', name: 'Anokhi Store', info: 'Iconic brand for hand block-printed garments. Every piece is ethically made by local artisans.', tags: ['Ethical', 'Modern'], q: 'Anokhi+Store+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <ImageWithLightbox src={img} alt={name} className="place-img" />
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📍 Directions</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIDE ── */}
      <section id="ride" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'rgba(13,22,20,0.92)' }} />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">✦ Get Around Jaipur</div>
            <h2 className="section-title">Book Your <em>Ride Now</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Whether you&apos;re chasing a sunset at Nahargarh or heading to Amber Fort — your ride is one tap away.</p>
          </div>
          <div className="ride-grid">
            {[
              { icon: '🏍️', name: 'Rapido', desc: "India's fastest bike taxi. Perfect for short hops through Jaipur's Old City lanes.", href: 'https://rapido.bike', cls: 'btn-gold', label: 'Open App' },
              { icon: '🚖', name: 'OLA Cabs', desc: 'Book autos, minis, or SUVs. Strong coverage around Railway Stations and major tourist zones.', href: 'https://olacabs.com', cls: 'btn-teal', label: 'Open App' },
              { icon: '🚗', name: 'Uber', desc: 'Reliable cab booking with fare transparency. Uber Auto and UberGo are popular choices.', href: 'https://uber.com', cls: 'btn-primary', label: 'Open App' },
            ].map(({ icon, name, desc, href, cls, label }) => (
              <div className="ride-card reveal" key={name}>
                <div className="ride-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <div className="ride-name">{name}</div>
                <div className="ride-desc">{desc}</div>
                <a href={href} target="_blank" rel="noreferrer" className={`btn ${cls}`} style={{ width: '100%', justifyContent: 'center' }}>{label}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP & HEATMAP ── */}
      <section id="map-section" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(20,36,32,0.97)0%,rgba(13,22,20,0.93)100%)' }} />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">✦ Live Interactions</div>
            <h2 className="section-title">Jaipur <em>Heatmap</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Watch in real-time as travellers explore the monuments of the Pink City.</p>
          </div>
          <div className="reveal">
            <HeatMap user={user} />
          </div>
        </div>
      </section>

      <LanguageTranslator />

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">VibeGuide</div>
        <div className="footer-tagline">Curating the soul of Jaipur, one discovery at a time</div>
        <div className="ornament" style={{ marginBottom: '2rem' }}>
          <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line rev" />
        </div>
        <div className="footer-links">
          <Link href="/about">About Jaipur</Link>
          <a href="#monuments">Monuments</a>
          <a href="#explore">Cafés & Bazaars</a>
          <a href="#ride">Get There</a>
          <Link href="/route">Route Planner</Link>
          <Link href="/login">Sign In</Link>
        </div>
        <div className="footer-copy">© 2025 VibeGuide · Made with ♥ for travellers in Rajasthan</div>
      </footer>

      <style jsx>{`
        .hero-animation-container {
          position: relative;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-deep);
        }
        .hero-content {
          position: relative;
          z-index: 20;
          text-align: center;
          padding-top: 25vh;
          pointer-events: none;
        }
        .hero-content > * {
          pointer-events: auto;
        }

        .hero-badge {
          display: inline-block;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-family: 'Dancing Script', cursive;
          font-size: 1.1rem;
          padding: 0.35rem 1.2rem;
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(3.5rem, 12vw, 8rem);
          font-weight: 700;
          line-height: 0.9;
          color: var(--text-main);
        }
        .hero-title span {
          display: block;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--terracotta-light) 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          font-weight: 300;
          color: var(--softwhite);
          margin: 1.2rem 0 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-cta { display: flex; gap: 1rem; justify-content: center; }

        /* Monuments */
        #monuments { background:var(--bg-deep); }
        .monuments-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem; }
        .monument-card { position:relative;overflow:hidden;border-radius:12px;cursor:pointer;border:1px solid rgba(59,167,143,0.12);transition:border-color 0.4s,box-shadow 0.4s; }
        .monument-card:hover { border-color:rgba(59,167,143,0.5);box-shadow:0 12px 40px rgba(59,167,143,0.12); }
        .monument-card:first-child { grid-column:span 2; }
        .monument-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(13,22,20,0.92)0%,rgba(13,22,20,0.25)55%,transparent 100%);backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);padding:1.5rem;display:flex;flex-direction:column;justify-content:flex-end;transition:backdrop-filter 0.4s,-webkit-backdrop-filter 0.4s; }
        .monument-card:hover .monument-overlay { backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px); }
        .monument-tag { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:0.4rem; }
        .monument-name { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;line-height:1.2;margin-bottom:0.4rem; }
        .monument-desc { font-family:'Cormorant Garamond',serif;font-size:0.95rem;color:var(--text-muted);line-height:1.5;max-height:0;overflow:hidden;transition:max-height 0.5s,opacity 0.4s;opacity:0; }
        .monument-card:hover .monument-desc { max-height:100px;opacity:1; }
        .monument-action { margin-top:0.8rem;opacity:0;transform:translateY(10px);transition:opacity 0.3s,transform 0.3s; }
        .monument-card:hover .monument-action { opacity:1;transform:translateY(0); }

        /* Explore */
        #explore { background:linear-gradient(160deg,#120e08 0%,#0D1614 100%); }
        .tabs { display:flex;gap:0.5rem;margin-bottom:2.5rem;border-bottom:1px solid rgba(59,167,143,0.15);padding-bottom:0; }
        .tab { padding:0.6rem 1.4rem;font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--text-muted);background:none;border:none;position:relative;transition:color 0.3s;font-family:'Outfit',sans-serif; }
        .tab::after { content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transition:transform 0.3s; }
        .tab.active { color:var(--gold); }
        .tab.active::after { transform:scaleX(1); }
        .tab-panel { display:none; }
        .tab-panel.active { display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem; }
        .place-card { background:rgba(20,36,32,0.45);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(59,167,143,0.15);border-radius:12px;overflow:hidden;transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; }
        .place-card:hover { transform:translateY(-6px);border-color:rgba(59,167,143,0.45);box-shadow:0 12px 40px rgba(59,167,143,0.12),0 0 0 1px rgba(59,167,143,0.1); }
        .place-body { padding:1.2rem; }
        .place-category { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--terracotta-light);margin-bottom:0.4rem; }
        .place-name { font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:0.4rem; }
        .place-info { font-size:0.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.8rem; }
        .place-tags { display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem; }
        .place-tag { font-size:0.65rem;padding:0.2rem 0.6rem;border-radius:2px;background:rgba(59,167,143,0.08);color:var(--gold);border:1px solid rgba(59,167,143,0.2);letter-spacing:1px; }

        /* Ride */
        #ride { background:var(--bg-deep); }
        .ride-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem; }
        .ride-card { background:rgba(25,50,43,0.35);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(59,167,143,0.18);border-radius:14px;padding:2rem;text-align:center;transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; }
        .ride-card:hover { transform:translateY(-5px);box-shadow:0 10px 40px rgba(59,167,143,0.15),0 0 0 1px rgba(59,167,143,0.12);border-color:rgba(59,167,143,0.4); }

        @media(max-width:900px){
          .monuments-grid{grid-template-columns:1fr 1fr}
          .monument-card:first-child{grid-column:span 2}
          .tab-panel.active{grid-template-columns:1fr 1fr}
          .ride-grid{grid-template-columns:1fr}
        }
        @media(max-width:600px){
          .monuments-grid,.tab-panel.active{grid-template-columns:1fr}
          .monument-card:first-child{grid-column:span 1}
        }
      `}</style>
    </>
  );
}
