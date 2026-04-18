'use client';
import Navbar from '@/components/Navbar';
import LanguageTranslator from '@/components/LanguageTranslator';
import Link from 'next/link';

const itinerary = [
  {
    day: 'Day 1',
    theme: 'The Old Walled City',
    color: '#C05C42',
    stops: [
      { time: '7:00 AM', icon: '🌅', name: 'Sunrise at Nahargarh Fort', tip: 'Arrive before dawn — golden hour makes the city glow amber pink. Bring a jacket; hilltop winds are cold.', duration: '2 hrs', maps: 'Nahargarh+Fort+Jaipur' },
      { time: '9:30 AM', icon: '🌸', name: 'Hawa Mahal', tip: "Best photographed from the café across the street (Café Madpackers) over morning chai — you'll avoid the tourist crowd.", duration: '1 hr', maps: 'Hawa+Mahal+Jaipur' },
      { time: '11:00 AM', icon: '🔭', name: 'Jantar Mantar', tip: 'Hire an official guide (₹200) — the instruments look like abstract art without context. Ask about the Samrat Yantra eclipse prediction.', duration: '1.5 hrs', maps: 'Jantar+Mantar+Jaipur' },
      { time: '1:00 PM', icon: '🍛', name: 'Lunch at LMB (Laxmi Mishthan Bhandar)', tip: 'Order the thali — it includes dal baati churma, gatte ki sabzi, and three types of mishri. Sit on the first floor for A/C.', duration: '1 hr', maps: 'LMB+Jaipur' },
      { time: '2:30 PM', icon: '🏛️', name: 'City Palace & Museum', tip: 'The Mubarak Mahal section has the most stunning royal textile collection. The Diwan-i-Khas silver urns are world records.', duration: '2 hrs', maps: 'City+Palace+Jaipur' },
      { time: '5:00 PM', icon: '💎', name: 'Johari Bazaar', tip: "Don't buy at the first shop — wander deep into the lanes for better prices. Kundan sets and meenakari bangles are uniquely Jaipuri.", duration: '2 hrs', maps: 'Johari+Bazaar+Jaipur' },
      { time: '7:30 PM', icon: '🌙', name: 'Dinner at Peacock Rooftop', tip: 'Book a window table for Hawa Mahal views at dusk. Try the laal maas — it is fire.', duration: '1.5 hrs', maps: 'Peacock+Rooftop+Restaurant+Jaipur' },
    ],
  },
  {
    day: 'Day 2',
    theme: 'Forts & Palaces',
    color: '#D4AF37',
    stops: [
      { time: '8:00 AM', icon: '🐘', name: 'Amber Fort (Amer Fort)', tip: "Take the jeep up (₹200) over the elephant ride — same experience, faster and more ethical. Enter before 10 AM before tour buses arrive.", duration: '3 hrs', maps: 'Amer+Fort+Jaipur' },
      { time: '11:30 AM', icon: '🪞', name: 'Sheesh Mahal', tip: 'Inside Amber Fort — ask the guide to light a single candle in the hall of mirrors. 1 flame creates 1,000 reflected stars. Mind-blowing.', duration: '30 min', maps: 'Sheesh+Mahal+Amber+Fort' },
      { time: '12:30 PM', icon: '🍵', name: 'Café Anokhi', tip: 'The only AC break in this itinerary. Organic fresh salads, wood-fired bread, and exceptional pour-over coffee in a beautiful block-print setting.', duration: '1 hr', maps: 'Anokhi+Cafe+Jaipur' },
      { time: '2:00 PM', icon: '🏺', name: 'Jaigarh Fort', tip: "Only 5 km from Amber — the same ticket covers both. Jaigarh has the world's largest wheeled cannon (Jaivana). Views from the towers are spectacular.", duration: '1.5 hrs', maps: 'Jaigarh+Fort+Jaipur' },
      { time: '4:30 PM', icon: '🎨', name: 'Kripal Kumbh Blue Pottery Studio', tip: 'Watch artisans at work and pick a hand-painted piece to take home. Prices start at ₹150 for small tiles. The indigo-and-white patterns are Persian-inspired.', duration: '1 hr', maps: 'Kripal+Kumbh+Blue+Pottery+Jaipur' },
      { time: '6:00 PM', icon: '🌊', name: 'Jal Mahal (Sunset View)', tip: "You can't enter the palace but the roadside view at golden hour is iconic. Cross to the opposite bank for the best angle. Boats available (₹100).", duration: '1 hr', maps: 'Jal+Mahal+Jaipur' },
      { time: '7:30 PM', icon: '🥘', name: 'Rawat Mishthan Bhandar', tip: "Street-level royalty. The pyaaz kachori here is Jaipur's most famous. Order 3 — you'll thank us. Pair with sweet lassi.", duration: '45 min', maps: 'Rawat+Mishthan+Bhandar+Jaipur' },
    ],
  },
  {
    day: 'Day 3',
    theme: 'Markets, Arts & Hidden Gems',
    color: '#007A7A',
    stops: [
      { time: '8:30 AM', icon: '☕', name: 'Breakfast at Tapri Central', tip: 'Jaipur runs on chai — Tapri has over 30 blends. Try the Masala Kashmiri or the Rose Cardamom chai. Best rooftop morning views of the old city skyline.', duration: '1 hr', maps: 'Tapri+Central+Jaipur' },
      { time: '10:00 AM', icon: '🧵', name: 'Bapu Bazaar', tip: "Best for block-print fabric by the metre and mojari embroidered shoes. Start at the far end (Chand Pole side) — shops are less touristy and prices are fairer.", duration: '1.5 hrs', maps: 'Bapu+Bazaar+Jaipur' },
      { time: '12:00 PM', icon: '🗿', name: 'Tripolia Bazaar', tip: 'The oldest market in Jaipur — look for antique meenakari boxes, lac bangles, and hand-painted miniature paintings. Every stall tells a 200-year story.', duration: '1 hr', maps: 'Tripolia+Bazaar+Jaipur' },
      { time: '1:30 PM', icon: '🎭', name: 'Lunch at Handi Restaurant', tip: 'Open clay tandoor visible from your table. The laal maas (red chilli lamb) and bajra roti combo is the soul of Rajasthani food. The earthen pots (handis) keep food warm for hours.', duration: '1.5 hrs', maps: 'Handi+Restaurant+Jaipur' },
      { time: '3:30 PM', icon: '🪆', name: 'Kathputli Colony (Puppet Village)', tip: "Watch Rajasthani puppet artists perform in their workshop courtyard — no ticket, just a small donation. Buy a hand-crafted Kathputli to take home (₹250–500).", duration: '1 hr', maps: 'Kathputli+Colony+Jaipur' },
      { time: '5:00 PM', icon: '🛍️', name: 'Anokhi Store', tip: 'Budget 45 minutes minimum — three floors of ethical block-print garments, home textiles, and accessories. The basement sale section often has 40–60% off.', duration: '1 hr', maps: 'Anokhi+Store+Jaipur' },
      { time: '7:00 PM', icon: '👑', name: 'Farewell Dinner at Café Palladio', tip: 'Book 48 hours in advance. Ask for the garden section under the trees. Order the burrata and the white butter chicken. The cocktail list is inspired by Rajasthani botanicals.', duration: '2 hrs', maps: 'Cafe+Palladio+Jaipur' },
    ],
  },
];

const travelTips = [
  { icon: '🚗', title: 'Getting There', tip: 'Jaipur airport (JAI) is 13 km from city centre. Prepaid taxi (~₹400) or OLA/Uber (~₹280) from the airport.' },
  { icon: '🌡️', title: 'Best Time to Visit', tip: 'October to March. Avoid May–July (45°C heat). Monsoon (July–Aug) brings green hills but humidity.' },
  { icon: '💰', title: 'Daily Budget', tip: 'Budget: ₹1,500–2,500 | Mid-range: ₹4,000–8,000 | Luxury heritage hotels: ₹15,000+' },
  { icon: '🌐', title: 'Language', tip: 'Hindi and Rajasthani are primary. Tourist areas speak English. Use our translator below for other languages.' },
  { icon: '📱', title: 'Sim Card & Data', tip: 'Get an Airtel/Jio SIM at the airport. ₹299 gets you 28 days + 1.5GB/day. Essential for GPS navigation.' },
  { icon: '⚡', title: 'Power & Safety', tip: 'India uses Type C/D/M plugs, 230V. Keep your belongings close in crowded bazaars. Drink bottled water only.' },
];

export default function RoutePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Dancing+Script:wght@700&family=Outfit:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --gold:#D4AF37;--gold-light:#FFD700;--terracotta:#C05C42;
          --terracotta-light:#D98E7E;--terracotta-dark:#8E4432;
          --maroon:#800000;--teal:#007A7A;--teal-dark:#004D4D;
          --sand:#E5D3B3;--bg-deep:#0D0A07;--bg-card:#161109;--bg-card2:#1C1409;
          --text-main:#F0E8DC;--text-muted:#A08060;
        }
        body{background:var(--bg-deep);color:var(--text-main);font-family:'Outfit',sans-serif;overflow-x:hidden}

        /* Hero */
        .route-hero {
          height: 55vh; min-height: 380px;
          position: relative; overflow: hidden;
          display: flex; align-items: flex-end; padding: 4rem 2rem 3rem;
          margin-top: 0; padding-top: 80px;
        }
        .route-hero-bg {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=1600&q=85') center 40%/cover no-repeat;
          filter: brightness(0.3) saturate(0.7);
          transform: scale(1.03);
        }
        .route-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(13,10,7,1) 0%, rgba(13,10,7,0.4) 50%, rgba(13,10,7,0.1) 100%);
        }
        .route-hero-content { position: relative; z-index: 2; max-width: 1200px; width: 100%; margin: 0 auto; }
        .route-hero-label { font-size:0.65rem;letter-spacing:5px;text-transform:uppercase;color:var(--gold);margin-bottom:0.6rem; }
        .route-hero-title {
          font-family:'Playfair Display',serif; font-size:clamp(2.5rem,7vw,5rem);
          font-weight:900; line-height:0.95; margin-bottom:1rem;
        }
        .route-hero-title em { font-style:italic;color:var(--terracotta-light); }
        .route-hero-sub { font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic;color:var(--sand);opacity:0.85;max-width:600px; }

        /* Translator bar */
        .translator-bar {
          background: rgba(22,17,9,0.9); backdrop-filter:blur(10px);
          border-bottom: 1px solid rgba(212,175,55,0.15);
          padding: 0.8rem 2rem;
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
        }
        .translator-bar span { font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted); }

        /* Content */
        .route-container { max-width:1200px;margin:0 auto;padding:4rem 2rem; }

        /* Tips grid */
        .tips-section { margin-bottom:5rem; }
        .tips-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;margin-top:2rem; }
        .tip-card {
          background:var(--bg-card2); border:1px solid rgba(212,175,55,0.1);
          border-radius:6px; padding:1.5rem;
          transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s;
        }
        .tip-card:hover { transform:translateY(-4px);border-color:rgba(212,175,55,0.3);box-shadow:0 8px 25px rgba(0,0,0,0.4); }
        .tip-icon { font-size:1.8rem;margin-bottom:0.8rem; }
        .tip-title { font-family:'Playfair Display',serif;font-size:1rem;color:var(--gold);margin-bottom:0.4rem; }
        .tip-text { font-size:0.85rem;color:var(--text-muted);line-height:1.6; }

        /* Itinerary days */
        .day-section { margin-bottom:4rem; }
        .day-header {
          display:flex; align-items:center; gap:2rem; margin-bottom:2rem;
          padding-bottom:1rem; border-bottom:1px solid rgba(212,175,55,0.12);
        }
        .day-badge {
          font-family:'Dancing Script',cursive; font-size:1rem; font-weight:700;
          padding:0.4rem 1.2rem; border-radius:20px; letter-spacing:2px;
          white-space:nowrap;
        }
        .day-number { font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:900;line-height:1; }
        .day-theme { font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-style:italic;color:var(--text-muted); }

        /* Timeline */
        .timeline { position:relative;padding-left:2.5rem; }
        .timeline::before {
          content:''; position:absolute; left:0.6rem; top:0; bottom:0;
          width:2px; background:linear-gradient(to bottom,rgba(212,175,55,0.5),rgba(212,175,55,0.05));
        }
        .stop {
          position:relative; margin-bottom:2rem;
          background:var(--bg-card); border:1px solid rgba(212,175,55,0.08);
          border-radius:6px; padding:1.4rem 1.5rem;
          transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s;
        }
        .stop:hover { border-color:rgba(212,175,55,0.35);box-shadow:0 8px 25px rgba(0,0,0,0.4);transform:translateX(4px); }
        .stop::before {
          content:''; position:absolute; left:-2.1rem; top:1.5rem;
          width:12px; height:12px; border-radius:50%;
          background:var(--gold); border:2px solid var(--bg-deep);
          box-shadow:0 0 10px rgba(212,175,55,0.5);
        }
        .stop-top { display:flex;align-items:flex-start;gap:1rem;margin-bottom:0.6rem; }
        .stop-time { font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);white-space:nowrap;margin-top:0.2rem; }
        .stop-icon { font-size:1.5rem;flex-shrink:0; }
        .stop-info { flex:1; }
        .stop-name { font-family:'Playfair Display',serif;font-size:1.15rem;margin-bottom:0.3rem; }
        .stop-tip { font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--text-muted);line-height:1.6;font-style:italic; }
        .stop-meta { display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:0.8rem; }
        .stop-duration { font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted); }
        .stop-btn {
          font-size:0.7rem;letter-spacing:1.5px;text-transform:uppercase;
          padding:0.3rem 0.8rem; border-radius:2px;background:rgba(212,175,55,0.1);
          color:var(--gold);border:1px solid rgba(212,175,55,0.25);
          text-decoration:none;transition:background 0.2s,border-color 0.2s;
          font-family:'Outfit',sans-serif;
        }
        .stop-btn:hover { background:rgba(212,175,55,0.18);border-color:rgba(212,175,55,0.5); }

        /* Ornament */
        .ornament { display:flex;align-items:center;gap:1rem;margin:0 auto 3rem;max-width:300px;justify-content:center; }
        .orn-line { flex:1;height:1px;background:linear-gradient(to right,transparent,var(--gold)); }
        .orn-line.rev { background:linear-gradient(to left,transparent,var(--gold)); }
        .orn-diamond { width:8px;height:8px;background:var(--gold);transform:rotate(45deg); }

        /* CTA bottom */
        .route-cta {
          text-align:center; padding:4rem 2rem;
          background:linear-gradient(160deg,#100c07 0%,#0d0a07 100%);
          border-top:1px solid rgba(212,175,55,0.1);
        }
        .cta-title { font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,3rem);margin-bottom:1rem; }
        .cta-sub { font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic;color:var(--text-muted);margin-bottom:2.5rem; }
        .cta-buttons { display:flex;gap:1rem;justify-content:center;flex-wrap:wrap; }

        .btn { display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.8rem;font-family:'Outfit',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;border-radius:2px;position:relative;overflow:hidden;transition:transform 0.25s,box-shadow 0.25s; }
        .btn::before { content:'';position:absolute;inset:0;background:rgba(255,255,255,0.12);transform:translateX(-110%) skewX(-15deg);transition:transform 0.4s; }
        .btn:hover::before { transform:translateX(110%) skewX(-15deg); }
        .btn:hover { transform:translateY(-2px); }
        .btn-gold { background:linear-gradient(135deg,var(--gold-light),var(--gold));color:#1a0f00;box-shadow:0 4px 20px rgba(212,175,55,0.4); }
        .btn-ghost { background:transparent;border:1.5px solid var(--gold);color:var(--gold); }

        @media(max-width:900px){ .tips-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:600px){ .tips-grid{grid-template-columns:1fr} .day-number{font-size:1.8rem} }
      `}</style>

      <Navbar />

      {/* HERO */}
      <div className="route-hero">
        <div className="route-hero-bg" />
        <div className="route-hero-overlay" />
        <div className="route-hero-content">
          <div className="route-hero-label">✦ Your Complete Jaipur Guide</div>
          <h1 className="route-hero-title">
            3-Day <em>Route Planner</em><br />for Jaipur
          </h1>
          <p className="route-hero-sub">Curated itineraries, insider tips, transport guides, and every hidden gem — in one place.</p>
        </div>
      </div>

      {/* TRANSLATOR BAR */}
      <div className="translator-bar">
        <span>🌐 Translate this page:</span>
        <LanguageTranslator />
      </div>

      <div className="route-container">

        {/* TRAVEL TIPS */}
        <div className="tips-section">
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)' }}>✦ Before You Go</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '0.5rem' }}>
            Essential <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Travel Tips</em>
          </h2>
          <div className="tips-grid">
            {travelTips.map(({ icon, title, tip }) => (
              <div className="tip-card" key={title}>
                <div className="tip-icon">{icon}</div>
                <div className="tip-title">{title}</div>
                <div className="tip-text">{tip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ORNAMENT */}
        <div className="ornament">
          <div className="orn-line" /><div className="orn-diamond" /><div className="orn-line rev" />
        </div>

        {/* ITINERARY */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)' }}>✦ Curated Itinerary</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '3rem' }}>
          Your 3-Day <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Jaipur Journey</em>
        </h2>

        {itinerary.map(({ day, theme, color, stops }) => (
          <div className="day-section" key={day}>
            <div className="day-header">
              <span className="day-badge" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{day}</span>
              <div>
                <div className="day-number" style={{ color }}>{day}</div>
                <div className="day-theme">{theme}</div>
              </div>
            </div>

            <div className="timeline">
              {stops.map(({ time, icon, name, tip, duration, maps }) => (
                <div className="stop" key={name}>
                  <div className="stop-top">
                    <span className="stop-time">{time}</span>
                    <span className="stop-icon">{icon}</span>
                    <div className="stop-info">
                      <div className="stop-name">{name}</div>
                      <div className="stop-tip">💡 {tip}</div>
                    </div>
                  </div>
                  <div className="stop-meta">
                    <span className="stop-duration">⏱ {duration}</span>
                    <a
                      href={`https://maps.google.com/?q=${maps}`}
                      target="_blank" rel="noreferrer"
                      className="stop-btn"
                    >📍 View on Map</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="route-cta">
        <div className="ornament">
          <div className="orn-line" /><div className="orn-diamond" /><div className="orn-line rev" />
        </div>
        <h2 className="cta-title">Ready to <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Explore?</em></h2>
        <p className="cta-sub">Sign in to track your path and see live crowd heatmaps of Jaipur&apos;s busiest spots.</p>
        <div className="cta-buttons">
          <Link href="/login" className="btn btn-gold">✦ Sign In / Sign Up</Link>
          <Link href="/" className="btn btn-ghost">← Back to Home</Link>
        </div>
      </div>

      {/* FOOTER mini */}
      <footer style={{ background: '#080603', borderTop: '1px solid rgba(212,175,55,0.1)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#D4AF37,#D98E7E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>VibeGuide</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(160,128,96,0.4)' }}>© 2025 VibeGuide · Made with ♥ for travellers of Jaipur</div>
      </footer>
    </>
  );
}
