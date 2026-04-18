'use client';
import Navbar from '@/components/Navbar';
import HeroCanvas from '@/components/HeroCanvas';
import HeatMap from '@/components/HeatMap';
import LiveTranslator from '@/components/LiveTranslator';
import ChatBot from '@/components/ChatBot';
import NearbyMonuments from '@/components/NearbyMonuments';
import WeatherWidget from '@/components/WeatherWidget';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ImageWithLightbox from '@/components/ImageWithLightbox';
import { MapPin, Coffee, Utensils, ShoppingBag, Bike, CarTaxiFront, Car, Navigation } from 'lucide-react';


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
          <div className="hero-badge reveal glowing-slogan" style={{
            boxShadow: '0 0 15px rgba(255,255,255,0.4)',
            textShadow: '0 0 8px rgba(255,255,255,0.6)',
            background: 'rgba(255,255,255,0.1)'
          }}>✦ ATLAS — Your Travel Companion ✦</div>
          <h1 className="hero-title reveal">
            Discover<span>the world</span>
          </h1>
          <p className="hero-sub reveal">
            Your royal guide to Jaipur's legendary forts, living bazaars, hidden cafés & golden sunsets of Rajasthan
          </p>
          <div className="hero-cta reveal">
            <a href="#monuments" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Iconic Monuments</a>
            <a href="#explore" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Coffee size={16} /> Cafés & Bazaars</a>
            <a href="#ride" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Car size={16} /> Plan Your Ride</a>
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
      <section id="monuments" className="section-bg" style={{ background: 'var(--atlas-cream)' }}>
        <div className="container">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ margin: 0, color: 'var(--atlas-green)' }}>
              Sovereign <em style={{ color: 'var(--atlas-sage)' }}>Monuments</em>
            </h2>
            <a href="#" style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--atlas-sage)', textDecoration: 'none', fontWeight: 600 }}>VIEW ALL</a>
          </div>

          {/* Bento Grid */}
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '1.5rem', height: '500px' }}>
            {/* Main Feature */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.6)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'; }}
            >
              <ImageWithLightbox src="https://res.cloudinary.com/dbizje0oq/image/upload/v1776553271/Hawa-Mahal-2_zkkaws.jpg" alt="Hawa Mahal" className="monument-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,58,48,0.9) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#F6F8F7', opacity: 0.8, marginBottom: '0.2rem' }}>Iconic Landmark</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Hawa Mahal</div>
                <div style={{ fontSize: '0.9rem', color: '#c1dcd5', maxWidth: '400px' }}>The iconic Palace of Winds, featuring 953 intricate pink sandstone windows designed for royal ladies.</div>
              </div>
            </div>

            {/* Stacked Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                flex: 1,
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.6)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
              >
                <ImageWithLightbox src="/thumbnails/Amber Fort.png" alt="Amer Fort" className="monument-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,58,48,0.8) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>Amer Fort</div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c1dcd5' }}>Hilltop Citadel</div>
                </div>
              </div>

              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                flex: 1,
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.6)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
              >
                <ImageWithLightbox src="/thumbnails/City Palace.png" alt="City Palace" className="monument-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,58,48,0.8) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>City Palace</div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c1dcd5' }}>Royal Residence</div>
                </div>
              </div>

              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                flex: 1,
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.6)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
              >
                <ImageWithLightbox src="https://res.cloudinary.com/dbizje0oq/image/upload/v1776553171/Ptrika_Gate_fninvx.png" alt="Patrika Gate" className="monument-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,58,48,0.8) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>Patrika Gate</div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#c1dcd5' }}>Rainbow Memorial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE (EXPERIENCES) ── */}
      <section id="explore" className="section-bg" style={{ background: '#DAE1DE' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ color: 'var(--atlas-green)' }}>Curated <em style={{ color: 'var(--atlas-sage)' }}>Experiences</em></h2>
            <p className="section-desc" style={{ margin: '0 auto', color: 'var(--text-muted)' }}>Immerse yourself in handpicked cultural touchpoints designed for the discerning traveler.</p>
          </div>

          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Utensils size={24} color="var(--atlas-sage)" />, title: "Royal Dining", desc: "Exclusive culinary journeys recreating historical feasts of the Maharajas." },
              { icon: <Coffee size={24} color="var(--atlas-sage)" />, title: "Artisan Workshops", desc: "Private sessions with master craftsmen of block printing and blue pottery." },
              { icon: <MapPin size={24} color="var(--atlas-sage)" />, title: "Night Heritage Walks", desc: "Discover illuminated monuments and quiet courtyards after twilight." }
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--atlas-pure)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', transition: 'transform 0.4s ease', border: '1px solid rgba(21, 58, 48, 0.05)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ marginBottom: '1.5rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--atlas-green)', marginBottom: '0.8rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS (LOCAL DISCOVERIES) ── */}
      <section id="local-discoveries" className="section-bg" style={{ background: 'var(--atlas-pure)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ color: 'var(--atlas-green)' }}>Eat, Shop <em style={{ color: 'var(--atlas-sage)' }}>& Unwind</em></h2>
            <p className="section-desc" style={{ color: 'var(--text-muted)' }}>From centuries-old bazaars to specialty coffee roasters — the city rewards every wanderer.</p>
          </div>
          <div className="tabs reveal">
            <button className="tab active" onClick={() => switchTab('cafes')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Coffee size={16} /> Cafés</button>
            <button className="tab" onClick={() => switchTab('restaurants')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Utensils size={16} /> Restaurants</button>
            <button className="tab" onClick={() => switchTab('shops')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ShoppingBag size={16} /> Bazaars</button>
          </div>

          <div className="tab-panel active" id="tab-cafes">
            {[
              { img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', cat: <><Coffee size={12} /> Specialty Coffee</>, name: 'Anokhi Café', info: 'Breezy courtyard café with artisan coffee, fresh salads, and block-print interiors.', tags: ['Courtyard', 'Artisan'], q: 'Anokhi+Cafe+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', cat: <><Coffee size={12} /> Rooftop Café</>, name: 'Tapri Central', info: "Jaipur's most beloved chai café with rooftop views of the old city and artisanal blends.", tags: ['Rooftop', 'Chai'], q: 'Tapri+Central+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', cat: <><Coffee size={12} /> Heritage Café</>, name: 'Café Palladio', info: 'A jaw-dropping Indo-Italian space inside a 300-year-old haveli with hand-painted murals.', tags: ['Heritage', 'Design'], q: 'Cafe+Palladio+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <div className="place-img-container">
                  <ImageWithLightbox src={img} alt={name} className="place-img" />
                </div>
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: 'var(--atlas-green)', border: '1.5px solid var(--atlas-green)', background: 'transparent' }}>
                      <Navigation size={14} /> Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-panel" id="tab-restaurants">
            {[
              { img: 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?w=600&q=80', cat: <><Utensils size={12} /> Royal Dining</>, name: 'Suvarna Mahal', info: 'Dine like royalty inside the Rambagh Palace. Gold leaf ceilings and traditional royal thali.', tags: ['Fine Dining', 'Royal'], q: 'Suvarna+Mahal+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', cat: <><Utensils size={12} /> Street Food King</>, name: 'LMB Jaipur', info: 'Beloved sweets shop and restaurant since 1954. Pyaaz kachori and ghewar are mandatory.', tags: ['Legendary', 'Sweets'], q: 'LMB+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80', cat: <><Utensils size={12} /> Traditional</>, name: 'Handi Restaurant', info: 'Jaipur institution for authentic Rajasthani dal baati churma and clay oven specialties.', tags: ['Authentic', 'Folk music'], q: 'Handi+Restaurant+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <div className="place-img-container">
                  <ImageWithLightbox src={img} alt={name} className="place-img" />
                </div>
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: 'var(--atlas-green)', border: '1.5px solid var(--atlas-green)', background: 'transparent' }}>
                      <Navigation size={14} /> Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-panel" id="tab-shops">
            {[
              { img: 'https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=600&q=80', cat: <><ShoppingBag size={12} /> Jewellery</>, name: 'Johari Bazaar', info: "The heartbeat of Jaipur's gem trade. Rubies, emeralds, and kundan jewellery since the 16th century.", tags: ['Gems', 'Jewellery'], q: 'Johari+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cat: <><ShoppingBag size={12} /> Textiles</>, name: 'Bapu Bazaar', info: "Go-to for block-print fabrics, mojari shoes, and Rajasthani lac bangles. Bargaining welcomed.", tags: ['Prints', 'Shoes'], q: 'Bapu+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', cat: <><ShoppingBag size={12} /> Curated</>, name: 'Anokhi Store', info: 'Iconic brand for hand block-printed garments. Every piece is ethically made by local artisans.', tags: ['Ethical', 'Modern'], q: 'Anokhi+Store+Jaipur' },
            ].map(({ img, cat, name, info, tags, q }) => (
              <div className="place-card reveal" key={name}>
                <div className="place-img-container">
                  <ImageWithLightbox src={img} alt={name} className="place-img" />
                </div>
                <div className="place-body">
                  <div className="place-category">{cat}</div>
                  <div className="place-name">{name}</div>
                  <div className="place-info">{info}</div>
                  <div className="place-tags">{tags.map(t => <span className="place-tag" key={t}>{t}</span>)}</div>
                  <div className="place-actions">
                    <a href={`https://maps.google.com/?q=${q}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: 'var(--atlas-green)', border: '1.5px solid var(--atlas-green)', background: 'transparent' }}>
                      <Navigation size={14} /> Directions
                    </a>
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
              { icon: <Bike size={40} color="var(--gold)" />, name: 'Rapido', desc: "India's fastest bike taxi. Perfect for short hops through Jaipur's Old City lanes.", href: 'https://rapido.bike', cls: 'btn-primary', label: 'Open App' },
              { icon: <CarTaxiFront size={40} color="var(--atlas-sage)" />, name: 'OLA Cabs', desc: 'Book autos, minis, or SUVs. Strong coverage around Railway Stations and major tourist zones.', href: 'https://olacabs.com', cls: 'btn-primary', label: 'Open App' },
              { icon: <Car size={40} color="var(--atlas-sage)" />, name: 'Uber', desc: 'Reliable cab booking with fare transparency. Uber Auto and UberGo are popular choices.', href: 'https://uber.com', cls: 'btn-primary', label: 'Open App' },
            ].map(({ icon, name, desc, href, cls, label }) => (
              <div className="ride-card reveal" key={name} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--atlas-pure)', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div className="ride-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <div className="ride-name" style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--atlas-green)', fontWeight: 700, marginBottom: '0.5rem' }}>{name}</div>
                <div className="ride-desc" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{desc}</div>
                <a href={href} target="_blank" rel="noreferrer" className={`btn ${cls}`} style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>{label}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP & HEATMAP ── */}
      <section id="map-section" className="section-bg" style={{ background: 'var(--atlas-pure)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ color: 'var(--atlas-green)' }}>Jaipur <em style={{ color: 'var(--atlas-sage)' }}>Heatmap</em></h2>
            <p className="section-desc" style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)' }}>Watch in real-time as travellers explore the monuments of the Pink City.</p>
            <a href="https://www.google.com/maps/place/Jaipur,+Rajasthan/@26.9124,75.7873,12z" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Navigation size={14} /> View on Google Maps
            </a>
          </div>
          <div className="reveal">
            <HeatMap user={user} />
          </div>
        </div>
      </section>
      <LiveTranslator />
      <ChatBot />

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">ATLAS</div>
        <div className="footer-tagline">Curating the sovereign journey, one discovery at a time</div>
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
        <div className="footer-copy">© 2025 ATLAS · Made with ♥ for travellers in Rajasthan</div>
      </footer>

      <WeatherWidget />

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

        .glowing-slogan {
          animation: sloganGlow 3s infinite alternate;
        }

        @keyframes sloganGlow {
          from { box-shadow: 0 0 15px rgba(255,255,255,0.2); text-shadow: 0 0 5px rgba(255,255,255,0.4); }
          to { box-shadow: 0 0 25px rgba(255,255,255,0.6); text-shadow: 0 0 15px rgba(255,255,255,0.9); }
        }

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
        .tab-panel.active { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: stretch; }
        .place-card { display: flex; flex-direction: column; background: #ffffff; border: 1px solid rgba(21, 58, 48, 0.1); border-radius: 20px; overflow: hidden; transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .place-card:hover { transform: translateY(-8px); border-color: var(--atlas-sage); box-shadow: 0 20px 50px rgba(21, 58, 48, 0.12); }
        .place-img-container { width: 100%; height: 260px; overflow: hidden; background: #f0f0f0; }
        .place-body { padding: 1.8rem; flex: 1; display: flex; flex-direction: column; }
        .place-category { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--atlas-green); opacity: 0.7; margin-bottom: 0.6rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .place-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--atlas-green); font-weight: 700; margin-bottom: 0.8rem; }
        .place-info { font-size: 0.95rem; color: #4A5D57; lineHeight: 1.7; margin-bottom: 1.5rem; }
        .place-tags { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .place-tag { font-size: 0.65rem; padding: 0.3rem 0.8rem; border-radius: 6px; background: #F1F5F4; color: var(--atlas-green); border: 1px solid rgba(21, 58, 48, 0.1); letter-spacing: 0.5px; font-weight: 500; }
        .place-actions { margin-top: auto; }

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
