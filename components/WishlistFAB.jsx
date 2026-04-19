'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, X, Plus, MapPin, Compass } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WishlistFAB() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tripCount, setTripCount] = useState(0);
  const [recentTrips, setRecentTrips] = useState([]);

  const loadTrips = async () => {
    let dbTrips = [];
    const { data } = await supabase.auth.getUser();
    const u = data?.user ?? null;
    setUser(u);

    if (u) {
      try {
        const res = await fetch(`/api/trips?user_id=${u.id}`);
        if (res.ok) dbTrips = await res.json();
      } catch (e) {}
    }

    const localTrips = JSON.parse(localStorage.getItem('localTrips') || '[]');
    const allTrips = [...dbTrips, ...localTrips].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    setTripCount(allTrips.length);
    setRecentTrips(allTrips.slice(0, 3));
  };

  useEffect(() => {
    loadTrips();
    window.addEventListener('tripsUpdated', loadTrips);
    return () => window.removeEventListener('tripsUpdated', loadTrips);
  }, []);

  return (
    <>
      <style>{`
        .wl-fab-wrap {
          position: fixed;
          bottom: 7rem;
          left: 1.5rem;
          z-index: 900;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
        }

        /* Popover card */
        .wl-popover {
          background: white;
          border-radius: 20px;
          padding: 1.2rem;
          width: 260px;
          box-shadow: 0 20px 60px rgba(21,58,48,0.18), 0 0 0 1px rgba(21,58,48,0.06);
          transform-origin: bottom left;
          animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        .wl-pop-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
        }
        .wl-pop-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; color: var(--atlas-green);
        }
        .wl-pop-close {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(21,58,48,0.06); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--atlas-green); transition: background 0.2s;
        }
        .wl-pop-close:hover { background: rgba(21,58,48,0.12); }

        .wl-trip-item {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.55rem 0.5rem; border-radius: 10px;
          text-decoration: none; color: var(--atlas-green);
          transition: background 0.2s;
          font-size: 0.85rem;
        }
        .wl-trip-item:hover { background: rgba(21,58,48,0.05); }
        .wl-trip-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--atlas-sage); flex-shrink: 0;
        }
        .wl-trip-name { font-weight: 600; flex: 1; }
        .wl-trip-dest { font-size: 0.72rem; color: var(--text-muted); }

        .wl-pop-divider {
          height: 1px; background: rgba(21,58,48,0.07);
          margin: 0.8rem 0;
        }

        .wl-pop-btn {
          display: flex; align-items: center; gap: 6px;
          width: 100%; padding: 0.65rem 0.8rem;
          background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage));
          color: white; border: none; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.5px; cursor: pointer; text-decoration: none;
          justify-content: center; transition: opacity 0.2s;
        }
        .wl-pop-btn:hover { opacity: 0.9; }
        .wl-pop-btn-ghost {
          display: flex; align-items: center; gap: 6px;
          width: 100%; padding: 0.6rem 0.8rem; margin-top: 0.5rem;
          background: transparent;
          color: var(--atlas-green); border: 1.5px solid rgba(21,58,48,0.15);
          border-radius: 12px; font-family: 'Outfit', sans-serif;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          text-decoration: none; justify-content: center; transition: border-color 0.2s;
        }
        .wl-pop-btn-ghost:hover { border-color: var(--atlas-sage); }

        /* FAB button */
        .wl-fab-btn {
          width: 52px; height: 52px; border-radius: 16px;
          background: white;
          border: 1.5px solid rgba(21,58,48,0.12);
          box-shadow: 0 6px 24px rgba(21,58,48,0.14);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--atlas-green);
          position: relative;
          transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s;
        }
        .wl-fab-btn:hover { transform: scale(1.1); box-shadow: 0 10px 32px rgba(21,58,48,0.22); }
        .wl-fab-btn.active { background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); color: white; border-color: transparent; }

        .wl-badge {
          position: absolute; top: -5px; right: -5px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--gold); color: #0B1A15;
          font-size: 0.65rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
        }

        .wl-empty-state {
          text-align: center; padding: 0.5rem;
          color: var(--text-muted); font-size: 0.82rem; line-height: 1.5;
        }
      `}</style>

      <div className="wl-fab-wrap">
        {open && (
          <div className="wl-popover">
            <div className="wl-pop-header">
              <div className="wl-pop-title">My Saved Trips</div>
              <button className="wl-pop-close" onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {!user && tripCount === 0 ? (
              <div className="wl-empty-state">
                <p style={{ marginBottom: '0.8rem' }}>Sign in to sync your travel plans across devices.</p>
                <Link href="/login" className="wl-pop-btn">Sign In</Link>
              </div>
            ) : recentTrips.length === 0 ? (
              <div className="wl-empty-state">
                <p style={{ marginBottom: '0.8rem' }}>No trips saved yet. Generate an itinerary and save it here.</p>
                <Link href="/route" className="wl-pop-btn"><Compass size={14} /> Plan a Trip</Link>
              </div>
            ) : (
              <>
                {recentTrips.map(trip => (
                  <Link href="/wishlist" key={trip.id} className="wl-trip-item">
                    <div className="wl-trip-dot" />
                    <div>
                      <div className="wl-trip-name">{trip.title}</div>
                      <div className="wl-trip-dest"><MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />{trip.destination} · {trip.days}d</div>
                    </div>
                  </Link>
                ))}

                {tripCount > 3 && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.3rem 0.5rem' }}>
                    +{tripCount - 3} more saved trips
                  </div>
                )}
                <div className="wl-pop-divider" />
                <Link href="/wishlist" className="wl-pop-btn">
                  <Bookmark size={14} /> View All Saved Trips
                </Link>
                <Link href="/route" className="wl-pop-btn-ghost">
                  <Plus size={14} /> Plan New Trip
                </Link>
              </>
            )}
          </div>
        )}

        <button
          className={`wl-fab-btn ${open ? 'active' : ''}`}
          onClick={() => setOpen(v => !v)}
          title="Saved Trips"
        >
          <Bookmark size={22} />
          {user && tripCount > 0 && <span className="wl-badge">{tripCount > 9 ? '9+' : tripCount}</span>}
        </button>
      </div>
    </>
  );
}
