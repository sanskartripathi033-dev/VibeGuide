'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeatMap from '@/components/HeatMap';
import NearbyMonuments from '@/components/NearbyMonuments';
import { supabase } from '@/lib/supabase';
import { Map, Landmark, Flame, Globe, Coffee, CarTaxiFront, MapPin } from 'lucide-react';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data?.user) {
        router.replace('/login');
        return;
      }
      setUser(data.user);
      // Fetch profile
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      setProfile(pData);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0D1614', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem',
        fontFamily: 'Outfit, sans-serif',
      }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1.5s linear infinite' }}>✦</div>
        <p style={{ color: '#8FBBAF', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Loading your dashboard…</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Explorer';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Dancing+Script:wght@700&family=Outfit:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --gold:#3BA78F;--gold-light:#78D59A;--terracotta:#3BA78F;
          --terracotta-light:#78D59A;--terracotta-dark:#236757;--maroon:#236757;
          --teal:#007A7A;--teal-dark:#004D4D;--sand:#E5D3B3;
          --bg-deep:#0D1614;--bg-card:#142420;--bg-card2:#19322B;
          --text-main:#EEF1F0;--text-muted:#8FBBAF;
        }
        body{background:var(--bg-deep);color:var(--text-main);font-family:'Outfit',sans-serif;overflow-x:hidden}

        .dash-wrap { padding-top: 80px; min-height: 100vh; }

        /* Hero banner */
        .dash-banner {
          background: linear-gradient(135deg, #100c07 0%, #1a0d05 50%, #0D1614 100%);
          border-bottom: 1px solid rgba(59,167,143,0.12);
          padding: 3rem 2rem;
          position: relative; overflow: hidden;
        }
        .dash-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(59,167,143,0.07) 0%, transparent 60%);
        }
        .dash-banner-inner { max-width:1200px;margin:0 auto;position:relative;z-index:1; }
        .dash-greeting { font-size:0.75rem;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:0.5rem; }
        .dash-name {
          font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;
          background:linear-gradient(135deg,var(--gold-light),var(--terracotta-light));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          margin-bottom:0.4rem;
        }
        .dash-sub { font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic;color:var(--text-muted); }
        .dash-meta { display:flex;gap:1.5rem;margin-top:1.5rem;flex-wrap:wrap; }
        .dash-meta-item { display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:var(--text-muted);letter-spacing:1px; }
        .dash-meta-dot { width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0; }

        /* Stat cards */
        .dash-stats { max-width:1200px;margin:0 auto;padding:2.5rem 2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem; }
        .stat-card {
          background:var(--bg-card2); border:1px solid rgba(59,167,143,0.1);
          border-radius:6px; padding:1.5rem;
          transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s;
        }
        .stat-card:hover { transform:translateY(-4px);border-color:rgba(59,167,143,0.3);box-shadow:0 8px 25px rgba(0,0,0,0.4); }
        .stat-icon { font-size:2rem;margin-bottom:0.8rem; }
        .stat-label { font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.3rem; }
        .stat-value { font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--gold); }
        .stat-sub { font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem; }

        /* Sections */
        .dash-section { max-width:1200px;margin:0 auto;padding:0 2rem 3rem; }
        .dash-section-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.8rem; }
        .dash-section-title span { font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);background:rgba(59,167,143,0.08);border:1px solid rgba(59,167,143,0.2);border-radius:2px;padding:0.2rem 0.6rem; }

        /* Quick access cards */
        .quick-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem; }
        .quick-card {
          background:var(--bg-card); border:1px solid rgba(59,167,143,0.08);
          border-radius:6px; padding:1.5rem; text-decoration:none; color:inherit;
          display:flex;flex-direction:column;gap:0.5rem;
          transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s;
        }
        .quick-card:hover { transform:translateY(-5px);border-color:rgba(59,167,143,0.35);box-shadow:0 10px 30px rgba(0,0,0,0.5); }
        .quick-card-icon { font-size:2.2rem; }
        .quick-card-title { font-family:'Playfair Display',serif;font-size:1.1rem; }
        .quick-card-desc { font-size:0.82rem;color:var(--text-muted);line-height:1.5; }
        .quick-card-arrow { font-size:0.8rem;color:var(--gold);letter-spacing:2px;margin-top:auto; }

        /* Map section */
        .dash-map { background:var(--bg-card2);border:1px solid rgba(59,167,143,0.1);border-radius:8px;padding:2rem;margin-bottom:2rem; }
        .dash-map-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem; }
        .live-badge { display:inline-flex;align-items:center;gap:0.4rem;padding:0.3rem 0.8rem;background:rgba(0,200,80,0.1);border:1px solid rgba(0,200,80,0.3);border-radius:20px;font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;color:#00c850; }
        .live-dot { width:6px;height:6px;border-radius:50%;background:#00c850;animation:livepulse 1.5s infinite; }
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        /* Profile card */
        .profile-card { background:var(--bg-card2);border:1px solid rgba(59,167,143,0.1);border-radius:6px;padding:1.5rem;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap; }
        .profile-avatar { width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--maroon),var(--terracotta-dark));display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);flex-shrink:0; }
        .profile-info { flex:1; }
        .profile-name { font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:0.2rem; }
        .profile-email { font-size:0.8rem;color:var(--text-muted); }
        .profile-joined { font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-top:0.3rem; }

        /* Schema download box */
        .schema-box { background:#0a0704;border:1px solid rgba(59,167,143,0.15);border-radius:6px;padding:1.5rem;margin-top:1rem; }
        .schema-box pre { font-size:0.78rem;color:#8FBBAF;line-height:1.8;overflow-x:auto;white-space:pre-wrap; }
        .schema-box code { color:#3BA78F; }

        .btn { display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.8rem;font-family:'Outfit',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;border-radius:2px;position:relative;overflow:hidden;transition:transform 0.25s,box-shadow 0.25s; }
        .btn::before { content:'';position:absolute;inset:0;background:rgba(255,255,255,0.12);transform:translateX(-110%) skewX(-15deg);transition:transform 0.4s; }
        .btn:hover::before { transform:translateX(110%) skewX(-15deg); }
        .btn:hover { transform:translateY(-2px); }
        .btn-gold { background:linear-gradient(135deg,#78D59A,#3BA78F);color:#1a0f00;box-shadow:0 4px 20px rgba(59,167,143,0.4); }
        .btn-ghost { background:transparent;border:1.5px solid var(--gold);color:var(--gold); }
        .btn-danger { background:linear-gradient(135deg,#5a0000,#236757);color:#E5D3B3;box-shadow:0 4px 15px rgba(128,0,0,0.4); }

        @media(max-width:900px){ .dash-stats{grid-template-columns:1fr 1fr} .quick-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:600px){ .dash-stats{grid-template-columns:1fr} .quick-grid{grid-template-columns:1fr} }
      `}</style>

      <Navbar />

      <div className="dash-wrap">

        {/* BANNER */}
        <div className="dash-banner">
          <div className="dash-banner-inner">
            <div className="dash-greeting">{greeting}, Explorer</div>
            <div className="dash-name">{displayName}</div>
            <div className="dash-sub">Welcome back to your Jaipur travel dashboard</div>
            <div className="dash-meta">
              <div className="dash-meta-item">
                <div className="dash-meta-dot" />
                <span>{user?.email}</span>
              </div>
              <div className="dash-meta-item">
                <div className="dash-meta-dot" />
                <span>Member since {new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="dash-stats">
          {[
            { icon: <Map size={28} color="var(--gold)" />, label: 'Tourist Spots', value: '50+', sub: 'Curated by ATLAS' },
            { icon: <Landmark size={28} color="var(--gold)" />, label: 'Heritage Sites', value: '6', sub: 'UNESCO + Royal' },
            { icon: <Flame size={28} color="var(--gold)" />, label: 'Live Crowd Data', value: 'Real-time', sub: 'Heatmap active' },
            { icon: <Globe size={28} color="var(--gold)" />, label: 'Languages', value: '12', sub: 'Supported via Translate' },
          ].map(({ icon, label, value, sub }, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>{icon}</div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* QUICK ACCESS */}
        <div className="dash-section">
          <div className="dash-section-title">
            Quick Access <span>Your Guide</span>
          </div>
          <div className="quick-grid">
            {[
              { icon: <Map size={28} color="var(--gold)" />, title: 'Route Planner', desc: 'Follow your 3-day curated Jaipur itinerary with stops, tips, and map links.', href: '/route', arrow: 'View Route →' },
              { icon: <Landmark size={28} color="var(--gold)" />, title: 'Monuments', desc: 'Explore Jaipur\'s 6 most iconic landmarks with history and navigation.', href: '/#monuments', arrow: 'Explore →' },
              { icon: <Coffee size={28} color="var(--gold)" />, title: 'Cafés & Bazaars', desc: 'Discover the best cafés, restaurants, and famous markets of Jaipur.', href: '/#explore', arrow: 'Discover →' },
              { icon: <CarTaxiFront size={28} color="var(--gold)" />, title: 'Book a Ride', desc: 'Rapido, OLA, Uber — find the fastest way to your next destination.', href: '/#ride', arrow: 'Book Now →' },
              { icon: <MapPin size={28} color="var(--gold)" />, title: 'Full Map', desc: 'Open Google Maps centred on Jaipur with all key tourist spots.', href: 'https://maps.google.com/?q=Jaipur', arrow: 'Open Maps →' },
              { icon: <Globe size={28} color="var(--gold)" />, title: 'Language Guide', desc: 'Common Hindi phrases for tourists — greetings, numbers, and shopping.', href: '/route', arrow: 'View Tips →' },
            ].map(({ icon, title, desc, href, arrow }, i) => (
              <Link href={href} className="quick-card" key={i}>
                <div className="quick-card-icon" style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
                <div className="quick-card-title">{title}</div>
                <div className="quick-card-desc">{desc}</div>
                <div className="quick-card-arrow">{arrow}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* NEARBY MONUMENTS */}
        <div className="dash-section">
          <NearbyMonuments />
        </div>

        {/* LIVE HEATMAP */}
        <div className="dash-section">
          <div className="dash-section-title">
            Live Crowd Map <span className="live-badge"><span className="live-dot" />Live</span>
          </div>
          <div className="dash-map">
            <div className="dash-map-header">
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Toggle &quot;Show Live Crowd Trails&quot; to see real-time foot-traffic heatmap. Enable &quot;Track My Path&quot; to contribute your location.
                </p>
              </div>
            </div>
            <HeatMap user={user} />
          </div>
        </div>

        {/* PROFILE */}
        <div className="dash-section">
          <div className="dash-section-title">Your Profile</div>
          <div className="profile-card">
            <div className="profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name">{displayName}</div>
              <div className="profile-email">{user?.email}</div>
              <div className="profile-joined">✦ VibeGuide Member</div>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">Sign Out</button>
          </div>
        </div>

        {/* DATABASE SCHEMA INFO (Removed by user request) */}

        {/* Footer */}
        <footer style={{ background: '#080603', borderTop: '1px solid rgba(59,167,143,0.1)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#3BA78F,#78D59A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.4rem' }}>VibeGuide</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(160,128,96,0.4)' }}>© 2025 VibeGuide · Your Jaipur Travel Companion</div>
        </footer>

      </div>
    </>
  );
}
