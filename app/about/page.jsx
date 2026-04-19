'use client';
import Navbar from '@/components/Navbar';
import ImageWithLightbox from '@/components/ImageWithLightbox';
import Link from 'next/link';
import { useEffect } from 'react';
import { Brain, Globe, Clock, TrendingDown, Backpack, Smartphone } from 'lucide-react';

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
        <div className="section-bg-gradient" style={{ background: 'linear-gradient(160deg,rgba(20,36,32,0.97)0%,rgba(13,22,20,0.93)100%)' }} />
        
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
              <div className="section-label">✦ Global Planner</div>
              <h2 className="section-title">The Soul of <em>Smart Travel</em></h2>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                VibeGuide is a cutting-edge itinerary architect designed to transform how you explore the world. Powered by advanced <strong style={{ color: 'var(--gold)' }}>AI Models</strong>, we curate bespoke journeys across continents globally.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Whether you're visiting the neon streets of Tokyo, ancient Roman ruins, or finding the perfect Parisian café, VibeGuide delivers high-precision, personalized travel intelligence instantly.
              </p>
              
              <div className="about-facts">
                {[
                  [<Brain size={24} color="var(--gold)" />, 'Intelligence', 'Powered by Gemini AI Engine'],
                  [<Globe size={24} color="var(--gold)" />, 'Coverage', 'Supports over 200+ Countries'],
                  [<Clock size={24} color="var(--gold)" />, 'Speed', 'Full itineraries in ~20 seconds'],
                  [<TrendingDown size={24} color="var(--gold)" />, 'Budgeting', 'Real-time Transport & Spend estimates'],
                  [<Backpack size={24} color="var(--gold)" />, 'Flexible', 'Tailored for any duration or budget'],
                  [<Smartphone size={24} color="var(--gold)" />, 'PWA', 'Installable as a Mobile Application'],
                ].map(([icon, label, val], i) => (
                  <div className="fact-card" key={i}>
                    <div className="fact-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.6rem' }}>{icon}</div>
                    <div className="fact-label">{label}</div>
                    <div className="fact-value">{val}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link href="/route" className="btn btn-gold">✦ Build an Itinerary →</Link>
                <Link href="/" className="btn btn-ghost">← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section style={{ background: 'var(--bg-deep)', padding: '6rem 2rem', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">✦ Under the Hood</span>
            <h2 className="section-title">The AI <em style={{ fontStyle: 'italic', color: 'var(--terracotta-light)' }}>Architecture</em></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>How VibeGuide turns your simple input into a comprehensive, hour-by-hour adventure.</p>
          </div>

          <div className="timeline-container">
            {[
              { year: 'Step 1', title: 'Data Intake', desc: 'You provide a destination, trip length, exact budget metrics, and your personal vibe choices (e.g. Culture, Food, Nature).' },
              { year: 'Step 2', title: 'Algorithmic Structuring', desc: 'The platform wraps your inputs into a rigorous prompt payload optimized to extract formatted travel intelligence.' },
              { year: 'Step 3', title: 'Generative AI', desc: 'Google Gemini acts as the architectural brain, scanning hundreds of global cultural hubs, transit nodes, and pricing models.' },
              { year: 'Step 4', title: 'Budget Modelling', desc: 'The model extracts local currency factors to give you realistic transit and daily spending expectations.' },
              { year: 'Step 5', title: 'JSON Parsing', desc: 'The raw text response is destructured, cleaned of markdown, and parsed into a strict JSON payload on our Node server.' },
              { year: 'Step 6', title: 'Dynamic Rendering', desc: 'The client receives the data packet and maps it to beautiful React components, presenting a flawless itinerary UI.' },
            ].map((item, i) => (
              <div className={`timeline-item reveal ${i % 2 === 0 ? 'left' : 'right'}`} key={item.year}>
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-grid { display:grid;grid-template-columns:minmax(300px, 1fr) 1.2fr;gap:3rem;align-items:center; width:100%; }
        .about-image-stack { position:relative;height:500px; width:100%; max-width:450px; margin:0 auto; }
        .about-img { position:absolute;border-radius:4px;object-fit:cover;transition:transform 0.4s; }
        .about-img:hover { transform:scale(1.03);z-index:5; }
        .about-img-main { width:72%;height:80%;top:0;left:0;box-shadow:12px 12px 40px rgba(0,0,0,0.7);border:1px solid rgba(59,167,143,0.2); }
        .about-img-secondary { width:55%;height:55%;bottom:0;right:0;box-shadow:8px 8px 30px rgba(0,0,0,0.6);border:1px solid rgba(192,92,66,0.3); }
        .about-badge-float { position:absolute;top:50%;left:58%;transform:translate(-50%,-50%);background:linear-gradient(135deg,var(--maroon),var(--terracotta-dark));border-radius:50%;width:100px;height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(128,0,0,0.6);z-index:6;pointer-events:none; }
        .about-badge-float strong { font-size:1.8rem;font-family:'Playfair Display',serif;color:var(--gold);line-height:1; }
        .about-badge-float span { font-size:0.6rem;letter-spacing:2px;color:var(--sand);text-transform:uppercase; }
        .about-facts { display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin:2rem 0; }
        .fact-card { background:var(--bg-card2);border:1px solid rgba(59,167,143,0.12);border-radius:4px;padding:1.2rem;transition:border-color 0.3s,box-shadow 0.3s; }
        .fact-card:hover { border-color:rgba(59,167,143,0.4);box-shadow:0 4px 20px rgba(59,167,143,0.08); }
        .fact-icon { font-size:1.4rem;margin-bottom:0.4rem; }
        .fact-label { font-size:0.6rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold); }
        .fact-value { font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--text-main);margin-top:0.2rem; }

        /* TIMELINE STYLES */
        .timeline-container { position:relative; max-width:800px; margin:0 auto; padding:2rem 0; }
        .timeline-container::before { content:''; position:absolute; left:50%; top:0; bottom:0; width:2px; background:linear-gradient(to bottom,transparent,var(--gold),transparent); transform:translateX(-50%); }
        .timeline-item { position:relative; width:50%; padding:0 3rem; margin-bottom:3rem; }
        .timeline-item.left { left:0; text-align:right; }
        .timeline-item.right { left:50%; text-align:left; }
        .timeline-item::before { content:''; position:absolute; top:20px; width:14px; height:14px; background:var(--bg-deep); border:2px solid var(--gold); border-radius:50%; z-index:2; box-shadow:0 0 10px rgba(59,167,143,0.4); }
        .timeline-item.left::before { right:-7px; }
        .timeline-item.right::before { left:-7px; }
        .timeline-content { padding:1.5rem; background:var(--bg-card); border:1px solid rgba(59,167,143,0.1); border-radius:6px; transition:transform 0.3s; }
        .timeline-item:hover .timeline-content { transform:translateY(-5px); border-color:rgba(59,167,143,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.3); }
        .timeline-year { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:var(--terracotta); margin-bottom:0.5rem; }
        .timeline-title { font-family:'Outfit',sans-serif; font-size:1.1rem; color:var(--gold); margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:1px; }
        .timeline-desc { font-family:'Cormorant Garamond',serif; font-size:1.1rem; line-height:1.6; color:var(--text-muted); }

        @media(max-width:1050px){
          .about-grid{grid-template-columns:1fr; gap:4rem;}
          .about-image-stack{height:400px; width:80%;}
        }
        @media(max-width:600px){
          .about-facts{grid-template-columns:1fr}
          .timeline-container::before { left:20px; }
          .timeline-item { width:100%; padding:0 0 0 3rem; left:0 !important; text-align:left !important; }
          .timeline-item::before { left:13px !important; }
        }
      `}</style>
    </>
  );
}
