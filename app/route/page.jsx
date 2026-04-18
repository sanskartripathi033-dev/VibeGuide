'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LanguageTranslator from '@/components/LanguageTranslator';
import Link from 'next/link';

const defaultItinerary = [
  {
    day: 'Day 1',
    theme: 'Iconic Global Arrival',
    color: '#3BA78F',
    stops: [
      { time: '9:00 AM', icon: '🌍', name: 'Enter Your Destination', tip: 'Use the AI form above to generate a bespoke hour-by-hour itinerary for any city instantly.', duration: '1 hr', maps: 'World+Map' },
      { time: '11:00 AM', icon: '🧠', name: 'AI Generation', tip: 'Our engine parses millions of geo-spatial points and structural reviews to curate a master route.', duration: '1.5 hrs', maps: 'AI+Engine' },
      { time: '1:00 PM', icon: '💸', name: 'Real-time Budgeting', tip: 'Watch transit and daily estimates dynamically adapt to your generated plan.', duration: '1 hr', maps: 'Budget' },
    ],
  }
];

const travelTips = [
  { icon: '✈️', title: 'Global Flight Checks', tip: 'Always cross-reference flight prices using incognito mode on your browser to avoid markup.' },
  { icon: '🌡️', title: 'Climate Check', tip: 'Before booking, investigate the shoulder seasons of your destination for optimal pricing and weather.' },
  { icon: '💰', title: 'Currency Conversion', tip: 'Use cards without foreign transaction fees to save substantially on overseas swipe rates.' },
  { icon: '🌐', title: 'Language', tip: 'Download local language packs offline in Google Translate before checking out of your hotel.' },
];

export default function RoutePage() {
  const [formData, setFormData] = useState({ origin: '', days: 3, budget: 'Mid-range', preferences: 'Culture & History' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);

  const fallbackQuotes = [
    "To travel is to discover that everyone is wrong about other countries. – Aldous Huxley",
    "Once a year, go someplace you've never been before. – Dalai Lama",
    "The world is a book, and those who do not travel read only a page. – Saint Augustine",
    "Traveling – it leaves you speechless, then turns you into a storyteller. – Ibn Battuta"
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('dest');
    if (dest) {
      setFormData(prev => ({ ...prev, origin: dest }));
    }
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    let quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % fallbackQuotes.length);
    }, 3500);

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlan(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
      clearInterval(quoteInterval);
    }
  };

  const itineraryToUse = plan ? plan.itinerary : defaultItinerary;
  const quotesToUse = plan?.quotes || fallbackQuotes;

  return (
    <>
      <style>{`
        .route-hero {
          height: 60vh; min-height: 480px;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          padding: 6rem 2rem 3rem; margin-top: 0;
        }
        .route-hero-bg {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=1600&q=85') center 40%/cover no-repeat;
          filter: brightness(0.35) saturate(0.8);
          transform: scale(1.03); z-index:0;
        }
        .route-hero-overlay {
          position: absolute; inset: 0; z-index:1;
          background: linear-gradient(to top, var(--bg-deep) 0%, rgba(13,22,20,0.4) 50%, rgba(13,22,20,0.1) 100%);
        }
        .route-hero-content { position: relative; z-index: 2; max-width: 1000px; width: 100%; text-align: center; }
        
        .ai-form {
          background: rgba(22, 17, 9, 0.7);
          backdrop-filter: blur(12px); border: 1px solid rgba(59,167,143,0.3);
          border-radius: 8px; padding: 2rem; margin-top: 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
          text-align: left;
        }
        .ai-form input, .ai-form select {
          width: 100%; padding: 0.8rem; background: rgba(0,0,0,0.4);
          border: 1px solid rgba(59,167,143,0.2); color: #fff;
          border-radius: 4px; outline: none; font-family:'Outfit',sans-serif;
        }
        .ai-form input:focus, .ai-form select:focus { border-color: var(--gold); }
        .ai-form label { display: block; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
        .ai-form .full-col { grid-column: 1 / -1; }
        
        .loading-overlay {
          position:fixed; inset:0; z-index:999;
          background:rgba(13,22,20,0.9); backdrop-filter:blur(10px);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          color:var(--text-main); font-family:'Cormorant Garamond',serif;
        }
        .spinner {
          width: 50px; height: 50px; border: 3px solid rgba(59,167,143,0.2);
          border-top-color: var(--gold); border-radius: 50%;
          animation: spin 1s linear infinite; margin-bottom:2rem;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* General styles preserved */
        .route-container { max-width:1200px;margin:0 auto;padding:4rem 2rem; }
        .translator-bar {
          background: var(--bg-card); backdrop-filter:blur(10px);
          border-bottom: 1px solid rgba(59,167,143,0.15);
          padding: 0.8rem 2rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 80px;
        }
        .translator-bar span { font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted); }
        
        /* Stats Box */
        .stats-box {
          background: linear-gradient(135deg, rgba(192,92,66,0.1), rgba(59,167,143,0.1));
          border: 1px solid var(--gold); border-radius: 8px; padding: 2rem; margin-bottom: 4rem;
          display:flex; justify-content: space-around; flex-wrap:wrap; gap: 2rem;
        }
        .stat-item { text-align: center; }
        .stat-label { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
        .stat-val { font-family: 'Playfair Display',serif; font-size: 1.5rem; color: var(--text-main); }
        
        /* Stop/Timeline */
        .tips-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-top:2rem;margin-bottom:4rem; }
        .tip-card { background:var(--bg-card2); border:1px solid rgba(59,167,143,0.1); border-radius:6px; padding:1.5rem; }
        .tip-icon { font-size:1.8rem;margin-bottom:0.8rem; }
        .tip-title { font-family:'Playfair Display',serif;font-size:1rem;color:var(--gold);margin-bottom:0.4rem; }
        .tip-text { font-size:0.85rem;color:var(--text-muted);line-height:1.6; }
        .day-section { margin-bottom:4rem; }
        .day-header { display:flex; align-items:center; gap:2rem; margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid rgba(59,167,143,0.12); }
        .day-badge { font-family:'Dancing Script',cursive; font-size:1rem; font-weight:700; padding:0.4rem 1.2rem; border-radius:20px; letter-spacing:2px; }
        .day-number { font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:900;line-height:1; }
        .day-theme { font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-style:italic;color:var(--text-muted); }
        .timeline { position:relative;padding-left:2.5rem; }
        .timeline::before { content:''; position:absolute; left:0.6rem; top:0; bottom:0; width:2px; background:linear-gradient(to bottom,rgba(59,167,143,0.5),rgba(59,167,143,0.05)); }
        .stop { position:relative; margin-bottom:2rem; background:var(--bg-card); border:1px solid rgba(59,167,143,0.08); border-radius:6px; padding:1.4rem 1.5rem; }
        .stop::before { content:''; position:absolute; left:-2.1rem; top:1.5rem; width:12px; height:12px; border-radius:50%; background:var(--gold); border:2px solid var(--bg-deep); }
        .stop-top { display:flex;align-items:flex-start;gap:1rem;margin-bottom:0.6rem; }
        .stop-time { font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold); }
        .stop-icon { font-size:1.5rem; }
        .stop-name { font-family:'Playfair Display',serif;font-size:1.15rem;margin-bottom:0.3rem; }
        .stop-tip { font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--text-muted);line-height:1.6;font-style:italic; }
        
        @media(max-width:900px){ .ai-form { grid-template-columns:1fr; } .tips-grid {grid-template-columns:1fr 1fr;} }
        @media(max-width:600px){ .tips-grid {grid-template-columns:1fr;} }
      `}</style>
      
      {isGenerating && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)' }}>Scripting Your Royal Journey...</h2>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', maxWidth: '600px', textAlign: 'center' }}>"{quotesToUse[currentQuote]}"</p>
        </div>
      )}

      <Navbar />
      
      <div className="translator-bar">
        <span>🌐 Translate this page:</span>
        <LanguageTranslator />
      </div>

      <div className="route-hero">
        <div className="route-hero-bg" />
        <div className="route-hero-overlay" />
        <div className="route-hero-content">
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', marginBottom:'0.5rem' }}>AI <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Route Planner</em></h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color:'var(--sand)', marginBottom: '1rem' }}>Enter your trip details to generate a highly tailored, hour-by-hour itinerary including accurate price estimates.</p>
          
          <form className="ai-form" onSubmit={handleGenerate}>
            <div>
              <label>Destination City / Region</label>
              <input type="text" required placeholder="e.g. Paris, Tokyo, Jaipur" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
            </div>
            <div>
              <label>Duration (Days)</label>
              <input type="number" min="1" max="10" required value={formData.days} onChange={e => setFormData({...formData, days: Number(e.target.value)})} />
            </div>
            <div>
              <label>Budget Level</label>
              <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                <option>Backpacker / Budget</option>
                <option>Mid-range</option>
                <option>Luxury Heritage</option>
              </select>
            </div>
            <div>
              <label>Travel Preferences</label>
              <select value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})}>
                <option>Culture & History</option>
                <option>Food & Bazaars</option>
                <option>Photography & Architecture</option>
                <option>Relaxed Paced</option>
              </select>
            </div>
            <div className="full-col" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-gold" style={{ border: 'none', width: '100%', justifyContent: 'center' }}>✦ Generate Itinerary</button>
            </div>
          </form>
        </div>
      </div>

      <div className="route-container">
        
        {plan && plan.estimates && (
          <div className="stats-box">
            <div className="stat-item">
              <div className="stat-label">Estimated Transport</div>
              <div className="stat-val">{plan.estimates.transport}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Estimated Daily Spend</div>
              <div className="stat-val">{plan.estimates.daily}</div>
            </div>
          </div>
        )}

        <div className="tips-grid">
          {travelTips.map(({ icon, title, tip }) => (
            <div className="tip-card" key={title}>
              <div className="tip-icon">{icon}</div>
              <div className="tip-title">{title}</div>
              <div className="tip-text">{tip}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', margin: '4rem 0 2rem' }}>
          {plan ? "Your AI-Generated" : "Sample Curated"} <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Journey</em>
        </h2>

        {itineraryToUse.map(({ day, theme, color, stops }) => (
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
                    <div style={{ flex: 1 }}>
                      <div className="stop-name">{name}</div>
                      <div className="stop-tip">💡 {tip}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>⏱ {duration}</span>
                    <a href={`https://maps.google.com/?q=${maps}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', background: 'rgba(59,167,143,0.1)', color: 'var(--gold)', textDecoration: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px' }}>📍 Map</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="route-cta">
        <h2 className="cta-title">Ready to <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Explore?</em></h2>
        <p className="cta-sub">Sign in to track your path and see live crowd heatmaps of Jaipur's busiest spots.</p>
        <div className="cta-buttons">
          <Link href="/login" className="btn btn-gold">✦ Sign In / Sign Up</Link>
          <Link href="/" className="btn btn-ghost">← Back to Home</Link>
        </div>
      </div>

      {/* FOOTER mini */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid rgba(59,167,143,0.1)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(135deg,var(--gold),var(--terracotta-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>VibeGuide</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2025 VibeGuide · Made with ♥ for travellers of Jaipur</div>
      </footer>
    </>
  );
}
