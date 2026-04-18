'use client';
import Navbar from '@/components/Navbar';
import HeroCanvas from '@/components/HeroCanvas';
import HeatMap from '@/components/HeatMap';
import LanguageTranslator from '@/components/LanguageTranslator';
import { useState, useEffect, useRef } from 'react';
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
      <div id="home">
        <HeroCanvas />
      </div>

      {/* ── LOCATION STRIP ── */}
      <div className="location-strip">
        <div className="location-strip-inner">
          {[
            ['Hawa Mahal', 'Palace of Winds · 1799'],
            ['Amber Fort', 'UNESCO Heritage · 1592'],
            ['City Palace', 'Royal Residence · 1729'],
            ['Jantar Mantar', 'UNESCO · Observatory · 1734'],
            ['Nahar Garh', 'Sunset Fortress · Aravalli'],
            ['Jal Mahal', 'Water Palace · Man Sagar Lake'],
          ].map(([name, sub], i) => (
            <div className="strip-item" key={i}>
              <ImageWithLightbox src={`/thumbnails/${name}.png`} alt={name} />
              <div className="strip-item-label">{name}<div className="strip-item-sub">{sub}</div></div>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            ['Hawa Mahal', 'Palace of Winds · 1799'],
            ['Amber Fort', 'UNESCO Heritage · 1592'],
            ['City Palace', 'Royal Residence · 1729'],
            ['Jantar Mantar', 'UNESCO · Observatory · 1734'],
            ['Nahar Garh', 'Sunset Fortress · Aravalli'],
            ['Jal Mahal', 'Water Palace · Man Sagar Lake'],
          ].map(([name, sub], i) => (
            <div className="strip-item" key={`d${i}`}>
              <ImageWithLightbox src={`/thumbnails/${name}.png`} alt={name} />
              <div className="strip-item-label">{name}<div className="strip-item-sub">{sub}</div></div>
            </div>
          ))}
        </div>
      </div>



      {/* ── MONUMENTS ── */}
      <section id="monuments" className="section-bg">
        <div className="section-bg-gradient" style={{ background: 'rgba(13,10,7,0.88)' }} />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">✦ Heritage Landmarks</div>
            <h2 className="section-title">Jaipur&apos;s <em>Timeless Monuments</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Five centuries of Rajput glory carved in rose-red sandstone, mirrored palaces, and sky-piercing minarets.</p>
          </div>
          <div className="ornament reveal">
            <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line rev" />
          </div>
          <div className="monuments-grid">
            {[
              { img: 'Hawa Mahal', tag: 'Iconic Landmark', name: 'Hawa Mahal', desc: 'The "Palace of Winds" — built in 1799 with 953 intricately carved windows (jharokhas). A masterpiece of Rajput-Mughal fusion.', maps: 'Hawa+Mahal+Jaipur' },
              { img: 'Amber Fort', tag: 'UNESCO Heritage', name: 'Amber Fort', desc: 'A hilltop marvel of red sandstone & marble. The Sheesh Mahal — a hall of mirrors that glitters like a thousand stars with a single flame.', maps: 'Amer+Fort+Jaipur' },
              { img: 'City Palace', tag: 'Royal Residence', name: 'City Palace', desc: "A royal complex still home to the Jaipur royal family. Houses a museum with armour, carpets, and the world's largest sterling silver vessels.", maps: 'City+Palace+Jaipur' },
              { img: 'Jantar Mantar', tag: 'UNESCO — Astronomy', name: 'Jantar Mantar', desc: "The world's largest stone sundial and 19 astronomical instruments. Still accurate enough to predict eclipses to within two seconds.", maps: 'Jantar+Mantar+Jaipur' },
              { img: 'Nahar Garh', tag: 'Sunset Fortress', name: 'Nahargarh Fort', desc: 'Perched on the Aravalli ridge, offering a panoramic canvas of the city at dusk — where the Pink City turns amber and the sky turns violet.', maps: 'Nahargarh+Fort+Jaipur' },
              { img: 'Jal Mahal', tag: 'Water Palace', name: 'Jal Mahal', desc: 'A five-storey palace that appears to float on Man Sagar Lake — four floors submerged beneath the water, the rooftop garden blooming above.', maps: 'Jal+Mahal+Jaipur' },
            ].map(({ img, tag, name, desc, maps }, i) => (
              <div className="monument-card reveal" key={name}>
                <ImageWithLightbox src={`/thumbnails/${img}.png`} alt={name} className="monument-img" />
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
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(18,14,8,0.97)0%,rgba(13,10,7,0.93)100%)' }} />
        <div className="container">
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <div className="section-label">✦ Eat, Shop &amp; Unwind</div>
            <h2 className="section-title">Explore <em>Jaipur&apos;s Flavours</em></h2>
            <p className="section-desc">From centuries-old bazaars to specialty coffee roasters — the city rewards every kind of wanderer.</p>
          </div>
          <div className="tabs reveal">
            <button className="tab active" onClick={() => switchTab('cafes')}>☕ Cafés</button>
            <button className="tab" onClick={() => switchTab('restaurants')}>🍽 Restaurants</button>
            <button className="tab" onClick={() => switchTab('shops')}>🛍 Bazaars</button>
          </div>

          {/* CAFES */}
          <div className="tab-panel active" id="tab-cafes">
            {[
              { img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', cat: '☕ Specialty Coffee', name: 'Anokhi Café', info: 'Breezy courtyard café with artisan coffee, fresh salads, wood-fire bread and block-print interiors.', tags: ['Courtyard', 'Vegan Options'], q: 'Anokhi+Cafe+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', cat: '☕ Rooftop Café', name: 'Tapri Central', info: "Jaipur's most beloved chai café — rooftop views, dozens of artisanal chai blends, and the best masala biscuits in town.", tags: ['Rooftop', "Chai Lover's Haven"], q: 'Tapri+Central+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', cat: '☕ Heritage Café', name: 'Café Palladio', info: 'A jaw-dropping Indo-Italian space inside a 300-year-old haveli. Hand-painted murals, garden seating.', tags: ['Heritage', 'Instagram Worthy'], q: 'Cafe+Palladio+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', cat: '☕ Brunch Spot', name: 'Hello Panda', info: 'Playful, quirky décor with a serious coffee programme. Try the lavender latte and French toast.', tags: ['Brunch', 'Artisan Coffee'], q: 'Hello+Panda+Cafe+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80', cat: '☕ Cocktail Bar', name: 'Bar Palladio', info: 'Indigo walls, gilded arches, and a legendary cocktail list inspired by Rajasthani botanicals.', tags: ['Cocktail Bar', 'Heritage Haveli'], q: 'Bar+Palladio+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80', cat: '☕ Hidden Gem', name: 'Peacock Rooftop', info: 'Tucked above the old walled city with a direct sightline to Hawa Mahal. Sunset here is pure magic.', tags: ['Views', 'Sunset'], q: 'Peacock+Rooftop+Restaurant+Jaipur' },
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

          {/* RESTAURANTS */}
          <div className="tab-panel" id="tab-restaurants">
            {[
              { img: 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?w=600&q=80', cat: '🍽 Royal Dining', name: 'Suvarna Mahal', info: 'Dine like royalty inside the Rambagh Palace. Gold leaf ceilings, live tabla, and a royal thali.', tags: ['Fine Dining', 'Thali'], q: 'Suvarna+Mahal+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', cat: '🍽 Street Food King', name: 'Laxmi Mishthan Bhandar', info: '"LMB" since 1954 — the most beloved sweets shop. Pyaaz kachori, rabdi, and ghewar are mandatory.', tags: ['Local Legend', 'Sweets'], q: 'LMB+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80', cat: '🍽 Rooftop Dining', name: 'Handi Restaurant', info: 'A Jaipur institution for authentic Rajasthani dal baati churma. Open clay ovens, brass lamps, folk musicians.', tags: ['Traditional', 'Rajasthani'], q: 'Handi+Restaurant+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80', cat: '🍽 Global Fusion', name: 'Jaipur Modern', info: 'Where Rajasthani recipes meet modern plating — ker sangri tacos, lamb laal maas sliders.', tags: ['Fusion', 'Cocktails'], q: 'Jaipur+Modern+Restaurant' },
              { img: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?w=600&q=80', cat: '🍽 Fast Bites', name: 'Rawat Mishthan Bhandar', info: 'The kachori queue stretches down the street by 7am. Come early — a Jaipur morning ritual.', tags: ['Breakfast', 'Kachori'], q: 'Rawat+Mishthan+Bhandar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', cat: '🍽 Heritage Hotel', name: 'Steam — ITC Rajputana', info: 'Multi-cuisine dining in a palace setting. Known for its legendary Sunday brunch and royal recipes.', tags: ['Buffet', 'Royal Cuisine'], q: 'ITC+Rajputana+Jaipur' },
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

          {/* SHOPS */}
          <div className="tab-panel" id="tab-shops">
            {[
              { img: 'https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=600&q=80', cat: '🛍 Jewellery Bazaar', name: 'Johari Bazaar', info: "The heartbeat of Jaipur's gem trade since the 16th century. Rubies, sapphires, emeralds, and kundan jewellery.", tags: ['Gems', 'Jewellery'], q: 'Johari+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cat: '🛍 Textile Market', name: 'Bapu Bazaar', info: "Jaipur's go-to for block-print fabrics, mojari shoes, and Rajasthani lac bangles. Bargain confidently.", tags: ['Textiles', 'Handicrafts'], q: 'Bapu+Bazaar+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', cat: '🛍 Curated Boutique', name: 'Anokhi', info: 'Iconic brand for hand block-printed cotton garments. Ethically made by local artisans.', tags: ['Block Print', 'Ethical Fashion'], q: 'Anokhi+Store+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', cat: '🛍 Home Decor', name: 'Kilol', info: 'A beautiful multi-storey store for Rajasthani home furnishings — handwoven rugs, painted furniture.', tags: ['Home Décor', 'Handwoven'], q: 'Kilol+Store+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', cat: '🛍 Blue Pottery', name: 'Kripal Kumbh', info: 'The most renowned blue pottery studio in India. Watch artisans paint intricate Persian-inspired patterns.', tags: ['Blue Pottery', 'Workshop'], q: 'Kripal+Kumbh+Blue+Pottery+Jaipur' },
              { img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', cat: '🛍 Antiques', name: 'Tripolia Bazaar', info: "The city's oldest market — meenakari bangles, lac jewellery, brass utensils, antique miniatures.", tags: ['Antiques', 'Old City'], q: 'Tripolia+Bazaar+Jaipur' },
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
        <div className="section-bg-gradient" style={{ background: 'rgba(13,10,7,0.92)' }} />
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">✦ Get Around Jaipur</div>
            <h2 className="section-title">Book Your <em>Ride Now</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Whether you&apos;re chasing a sunset at Nahargarh or heading to Amber Fort — your ride is one tap away.</p>
          </div>
          <div className="ride-grid">
            {[
              { icon: '🟡', name: 'Rapido', desc: "India's fastest bike taxi and auto service. Perfect for short hops through Jaipur's Old City lanes. Affordable, quick, and reliable.", href: 'https://rapido.bike', cls: 'btn-gold', label: 'Open Rapido App' },
              { icon: '🟢', name: 'OLA Cabs', desc: 'Book auto-rickshaws, mini cars, or SUVs across Jaipur. Strong coverage around Railway Station and all major tourist zones.', href: 'https://olacabs.com', cls: 'btn-teal', label: 'Open OLA App' },
              { icon: '⬛', name: 'Uber', desc: 'Reliable cab booking with fare transparency. UberGo and Uber Auto are popular. GPS tracking and easy UPI payments.', href: 'https://uber.com', cls: 'btn-primary', label: 'Open Uber App' },
            ].map(({ icon, name, desc, href, cls, label }) => (
              <div className="ride-card reveal" key={name}>
                <div className="ride-icon">{icon}</div>
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
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(16,12,7,0.97)0%,rgba(13,10,7,0.93)100%)' }} />
        <div className="container">
          <div className="reveal" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">✦ Navigate &amp; Explore Live</div>
              <h2 className="section-title">Find Your <em>Way Around</em></h2>
            </div>
            <LanguageTranslator />
          </div>
          <div className="reveal">
            <HeatMap user={user} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="https://maps.google.com/?q=Jaipur,Rajasthan,India" target="_blank" rel="noreferrer" className="btn btn-gold">🗺 Open Full Map in Google Maps</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">VibeGuide</div>
        <div className="footer-tagline">Curating the soul of Jaipur, one discovery at a time</div>
        <div className="ornament" style={{ marginBottom: '2rem' }}>
          <div className="ornament-line" /><div className="ornament-diamond" /><div className="ornament-line rev" />
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <a href="#monuments">Monuments</a>
          <a href="#explore">Cafés &amp; Shops</a>
          <a href="#ride">Get a Ride</a>
          <a href="#map-section">Map</a>
          <Link href="/route">Route Planner</Link>
          <Link href="/login">Sign In</Link>
        </div>
        <div className="footer-copy">© 2025 VibeGuide · Made with ♥ for travellers of Jaipur</div>
      </footer>

      <style>{`
        /* Strip */
        .location-strip { width:100%;overflow:hidden;display:flex;height:260px;position:relative; }
        .location-strip-inner { display:flex;gap:0;animation:stripSlide 28s linear infinite;will-change:transform; }
        .location-strip-inner:hover { animation-play-state:paused; }
        @keyframes stripSlide { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
        .strip-item { position:relative;flex-shrink:0;width:360px;height:260px;overflow:hidden; }
        .strip-item img { width:100%;height:100%;object-fit:cover;filter:brightness(0.65) saturate(0.8);transition:filter 0.4s; }
        .strip-item:hover img { filter:brightness(0.85) saturate(1.2); }
        .strip-item-label { position:absolute;bottom:0;left:0;right:0;padding:1.2rem 1rem 0.8rem;background:linear-gradient(to top,rgba(13,10,7,0.92)0%,transparent 100%);font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--gold);letter-spacing:1px; }
        .strip-item-sub { font-family:'Outfit',sans-serif;font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--sand);opacity:0.7;margin-top:0.1rem; }


        /* Monuments */
        #monuments { background:var(--bg-deep); }
        .monuments-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem; }
        .monument-card { position:relative;overflow:hidden;border-radius:4px;cursor:pointer;border:1px solid rgba(212,175,55,0.1);transition:border-color 0.4s; }
        .monument-card:hover { border-color:rgba(212,175,55,0.5); }
        .monument-card:first-child { grid-column:span 2; }
        .monument-img { width:100%;height:320px;object-fit:cover;display:block;transition:transform 0.6s,filter 0.4s;filter:brightness(0.7) saturate(0.9); }
        .monument-card:hover .monument-img { transform:scale(1.06);filter:brightness(0.5) saturate(1.2); }
        .monument-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(13,10,7,0.95)0%,transparent 50%);padding:1.5rem;display:flex;flex-direction:column;justify-content:flex-end; }
        .monument-tag { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:0.4rem; }
        .monument-name { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;line-height:1.2;margin-bottom:0.4rem; }
        .monument-desc { font-family:'Cormorant Garamond',serif;font-size:0.95rem;color:var(--text-muted);line-height:1.5;max-height:0;overflow:hidden;transition:max-height 0.5s,opacity 0.4s;opacity:0; }
        .monument-card:hover .monument-desc { max-height:100px;opacity:1; }
        .monument-action { margin-top:0.8rem;opacity:0;transform:translateY(10px);transition:opacity 0.3s,transform 0.3s; }
        .monument-card:hover .monument-action { opacity:1;transform:translateY(0); }

        /* Explore */
        #explore { background:linear-gradient(160deg,#120e08 0%,#0d0a07 100%); }
        .tabs { display:flex;gap:0.5rem;margin-bottom:2.5rem;border-bottom:1px solid rgba(212,175,55,0.15);padding-bottom:0; }
        .tab { padding:0.6rem 1.4rem;font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;color:var(--text-muted);background:none;border:none;position:relative;transition:color 0.3s;font-family:'Outfit',sans-serif; }
        .tab::after { content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transition:transform 0.3s; }
        .tab.active { color:var(--gold); }
        .tab.active::after { transform:scaleX(1); }
        .tab-panel { display:none; }
        .tab-panel.active { display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem; }
        .place-card { background:var(--bg-card);border:1px solid rgba(212,175,55,0.08);border-radius:4px;overflow:hidden;transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; }
        .place-card:hover { transform:translateY(-6px);border-color:rgba(212,175,55,0.35);box-shadow:0 12px 35px rgba(0,0,0,0.5); }
        .place-img { width:100%;height:160px;object-fit:cover;display:block;filter:brightness(0.75) saturate(0.85);transition:filter 0.4s; }
        .place-card:hover .place-img { filter:brightness(0.9) saturate(1.1); }
        .place-body { padding:1.2rem; }
        .place-category { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--terracotta-light);margin-bottom:0.4rem; }
        .place-name { font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:0.4rem; }
        .place-info { font-size:0.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.8rem; }
        .place-tags { display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem; }
        .place-tag { font-size:0.65rem;padding:0.2rem 0.6rem;border-radius:2px;background:rgba(212,175,55,0.08);color:var(--gold);border:1px solid rgba(212,175,55,0.2);letter-spacing:1px; }
        .place-actions { display:flex;gap:0.5rem;flex-wrap:wrap; }

        /* Ride */
        #ride { background:var(--bg-deep); }
        .ride-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem; }
        .ride-card { background:var(--bg-card2);border:1px solid rgba(212,175,55,0.1);border-radius:4px;padding:2rem;text-align:center;transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; }
        .ride-card:hover { transform:translateY(-5px);box-shadow:0 10px 35px rgba(0,0,0,0.5);border-color:rgba(212,175,55,0.3); }
        .ride-icon { font-size:2.5rem;margin-bottom:1rem; }
        .ride-name { font-family:'Playfair Display',serif;font-size:1.4rem;margin-bottom:0.5rem; }
        .ride-desc { font-size:0.85rem;color:var(--text-muted);margin-bottom:1.5rem;line-height:1.6; }

        /* Map section */
        #map-section { background:linear-gradient(160deg,#100c07 0%,#0d0a07 100%); }

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
