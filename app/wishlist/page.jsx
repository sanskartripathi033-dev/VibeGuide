'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Bookmark, Trash2, MapPin, Calendar, Wallet, Edit3, Save,
  ChevronDown, ChevronUp, ExternalLink, Plus, Clock, Compass, X
} from 'lucide-react';

function TripCard({ trip, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(trip.title);
  const [editNotes, setEditNotes] = useState(trip.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(trip.id, { title: editTitle, notes: editNotes });
    setEditing(false);
    setSaving(false);
  };

  const daysLeft = () => {
    const created = new Date(trip.created_at);
    const days = Math.floor((Date.now() - created) / 86400000);
    if (days === 0) return 'Saved today';
    if (days === 1) return 'Saved yesterday';
    return `Saved ${days} days ago`;
  };

  return (
    <div className="trip-card">
      {/* Card Header */}
      <div className="tc-header">
        <div className="tc-icon-wrap">
          <Compass size={22} color="white" />
        </div>
        <div className="tc-info" style={{ flex: 1 }}>
          {editing ? (
            <input
              className="tc-title-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="tc-title">{trip.title}</div>
          )}
          <div className="tc-meta">
            <span><MapPin size={12} /> {trip.destination}</span>
            {trip.days && <span><Calendar size={12} /> {trip.days} {trip.days === 1 ? 'day' : 'days'}</span>}
            {trip.budget && <span><Wallet size={12} /> {trip.budget}</span>}
          </div>
        </div>
        <div className="tc-actions">
          <button className="tc-btn" onClick={() => setEditing(!editing)} title="Edit">
            <Edit3 size={15} />
          </button>
          <button className="tc-btn danger" onClick={() => onDelete(trip.id)} title="Delete">
            <Trash2 size={15} />
          </button>
          <button className="tc-btn expand" onClick={() => setExpanded(!expanded)} title="Expand">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Edit notes */}
      {editing && (
        <div className="tc-edit-area">
          <div className="form-label">Personal Notes</div>
          <textarea
            className="tc-textarea"
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            placeholder="Add notes, reminders, hotel names, flight numbers..."
            rows={4}
          />
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
            <button className="tc-save-btn" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="tc-cancel-btn" onClick={() => { setEditing(false); setEditTitle(trip.title); setEditNotes(trip.notes || ''); }}>
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes display */}
      {!editing && trip.notes && (
        <div className="tc-notes">
          <div className="tc-notes-label">Your Notes</div>
          <p className="tc-notes-text">{trip.notes}</p>
        </div>
      )}

      {/* Itinerary expand */}
      {expanded && trip.itinerary && (
        <div className="tc-itinerary">
          <div className="tc-it-title">Itinerary Overview</div>
          {trip.itinerary.map?.((day, i) => (
            <div key={i} className="tc-day">
              <div className="tc-day-header">
                <span className="tc-day-badge">{day.day || `Day ${i + 1}`}</span>
                <span className="tc-day-theme">{day.theme}</span>
              </div>
              {day.stops?.map((stop, j) => (
                <div key={j} className="tc-stop">
                  <span className="tc-stop-time">{stop.time}</span>
                  <span className="tc-stop-name">{stop.name}</span>
                  {stop.maps && (
                    <a
                      href={`https://maps.google.com/?q=${stop.maps}`}
                      target="_blank" rel="noreferrer"
                      className="tc-map-link"
                    >
                      <ExternalLink size={11} /> Map
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="tc-footer">
        <span className="tc-time"><Clock size={12} /> {daysLeft()}</span>
        {trip.itinerary && (
          <button className="tc-expand-footer" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide itinerary' : `View full itinerary (${trip.itinerary.length || 0} days)`}
          </button>
        )}
        <Link href={`/route?dest=${encodeURIComponent(trip.destination)}`} className="tc-replan-link">
          <Compass size={13} /> Re-plan
        </Link>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDest, setFilterDest] = useState('');
  const [showQuickSave, setShowQuickSave] = useState(false);
  const [quickForm, setQuickForm] = useState({ destination: '', days: 3, budget: 'Mid-range', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      const u = data?.user ?? null;
      setUser(u);
      fetchTrips(u?.id);
    });
  }, [router]);

  const fetchTrips = async (uid) => {
    let dbTrips = [];
    try {
      if (uid) {
        const res = await fetch(`/api/trips?user_id=${uid}`);
        if (res.ok) dbTrips = await res.json();
      }
    } catch (e) {}
    
    const localTrips = JSON.parse(localStorage.getItem('localTrips') || '[]');
    setTrips([...dbTrips, ...localTrips].sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this saved trip?')) return;
    setTrips(prev => prev.filter(t => t.id !== id));
    
    if (typeof id === 'string' && id.startsWith('local_')) {
      const localTrips = JSON.parse(localStorage.getItem('localTrips') || '[]');
      localStorage.setItem('localTrips', JSON.stringify(localTrips.filter(t => t.id !== id)));
      window.dispatchEvent(new Event('tripsUpdated'));
      return;
    }
    
    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      window.dispatchEvent(new Event('tripsUpdated'));
    } catch (e) {
      fetchTrips(user?.id);
    }
  };

  const handleUpdate = async (id, updates) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    if (typeof id === 'string' && id.startsWith('local_')) {
      const localTrips = JSON.parse(localStorage.getItem('localTrips') || '[]');
      const updatedLocal = localTrips.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('localTrips', JSON.stringify(updatedLocal));
      window.dispatchEvent(new Event('tripsUpdated'));
      return;
    }
    
    try {
      await fetch(`/api/trips/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      window.dispatchEvent(new Event('tripsUpdated'));
    } catch (e) {
      fetchTrips(user?.id);
    }
  };

  const handleQuickSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tripData = { ...quickForm, title: `Trip to ${quickForm.destination}` };
    
    try {
      let savedData = null;
      if (user) {
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, ...tripData })
        });
        if (res.ok) savedData = await res.json();
      }
      
      if (!savedData) {
        // Fallback
        savedData = { id: 'local_' + Date.now(), created_at: new Date().toISOString(), ...tripData };
        const localTrips = JSON.parse(localStorage.getItem('localTrips') || '[]');
        localTrips.push(savedData);
        localStorage.setItem('localTrips', JSON.stringify(localTrips));
      }
      
      setTrips(prev => [savedData, ...prev]);
      setShowQuickSave(false);
      setQuickForm({ destination: '', days: 3, budget: 'Mid-range', notes: '' });
      window.dispatchEvent(new Event('tripsUpdated'));
    } catch (err) {
      alert('Failed to save trip.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = trips.filter(t =>
    !filterDest || t.destination.toLowerCase().includes(filterDest.toLowerCase()) ||
    t.title.toLowerCase().includes(filterDest.toLowerCase())
  );

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Explorer';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--atlas-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(21,58,48,0.1)', borderTopColor: 'var(--atlas-sage)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Loading your trips...</p>
        <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .wishlist-page { min-height: 100vh; background: var(--atlas-cream); }

        /* Hero */
        .wl-hero {
          background: linear-gradient(160deg, #0B1A15 0%, var(--atlas-green) 100%);
          padding: 8rem 2rem 4rem;
          position: relative; overflow: hidden;
        }
        .wl-hero::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 60px;
          background: var(--atlas-cream); clip-path: ellipse(55% 100% at 50% 100%);
        }
        .wl-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .wl-label { font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .wl-title { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900; color: var(--atlas-cream); line-height: 1.15; margin-bottom: 0.8rem; }
        .wl-title em { font-style: italic; color: var(--gold); }
        .wl-sub { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: rgba(240,244,242,0.65); margin-bottom: 2.5rem; }

        /* Summary Cards */
        .wl-summary {
          max-width: 1200px; margin: 2.5rem auto 0; padding: 0 2rem;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem;
        }
        .wl-sum-card {
          background: white; border-radius: 20px; padding: 1.5rem;
          border: 1px solid rgba(21,58,48,0.07); box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          text-align: center;
        }
        .wl-sum-val { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--atlas-green); font-weight: 900; }
        .wl-sum-label { font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-top: 0.3rem; }

        /* Toolbar */
        .wl-toolbar {
          max-width: 1200px; margin: 2.5rem auto 1.5rem; padding: 0 2rem;
          display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
        }
        .wl-search { flex: 1; min-width: 200px; padding: 0.75rem 1rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; background: white; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--atlas-green); outline: none; }
        .wl-search:focus { border-color: var(--atlas-sage); box-shadow: 0 0 0 3px rgba(71,146,130,0.1); }

        /* Trip Cards */
        .wl-list { max-width: 1200px; margin: 0 auto; padding: 0 2rem 6rem; display: flex; flex-direction: column; gap: 1.2rem; }

        .trip-card {
          background: white; border-radius: 20px;
          border: 1px solid rgba(21,58,48,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          overflow: hidden;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .trip-card:hover { box-shadow: 0 12px 35px rgba(21,58,48,0.1); transform: translateY(-3px); }

        .tc-header { padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem; }
        .tc-icon-wrap { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tc-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--atlas-green); font-weight: 700; margin-bottom: 0.4rem; }
        .tc-title-input { width: 100%; font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--atlas-green); border: 1.5px solid var(--atlas-sage); border-radius: 8px; padding: 0.4rem 0.6rem; outline: none; margin-bottom: 0.4rem; }
        .tc-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
        .tc-meta span { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); }

        .tc-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
        .tc-btn { width: 34px; height: 34px; border-radius: 10px; background: rgba(21,58,48,0.05); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--atlas-green); transition: background 0.2s; }
        .tc-btn:hover { background: rgba(21,58,48,0.12); }
        .tc-btn.danger:hover { background: rgba(229,62,62,0.1); color: #E53E3E; }

        .tc-edit-area { padding: 0 1.5rem 1.5rem; }
        .tc-textarea { width: 100%; padding: 0.85rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: var(--atlas-green); resize: vertical; outline: none; background: #F9FBFA; }
        .tc-textarea:focus { border-color: var(--atlas-sage); }
        .tc-save-btn { display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1.2rem; background: var(--atlas-green); color: white; border: none; border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .tc-save-btn:disabled { opacity: 0.6; }
        .tc-cancel-btn { display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1.2rem; background: transparent; color: var(--text-muted); border: 1px solid rgba(21,58,48,0.15); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 0.82rem; cursor: pointer; }

        .tc-notes { padding: 0 1.5rem 1.2rem; }
        .tc-notes-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 0.4rem; }
        .tc-notes-text { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: #4A5D57; line-height: 1.7; }

        .tc-itinerary { padding: 0 1.5rem 1.2rem; border-top: 1px solid rgba(21,58,48,0.06); padding-top: 1.2rem; }
        .tc-it-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 1rem; }
        .tc-day { margin-bottom: 1.2rem; }
        .tc-day-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem; }
        .tc-day-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(21,58,48,0.07); color: var(--atlas-green); }
        .tc-day-theme { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--text-muted); font-size: 0.95rem; }
        .tc-stop { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
        .tc-stop:hover { background: rgba(21,58,48,0.03); }
        .tc-stop-time { font-size: 0.68rem; letter-spacing: 1px; text-transform: uppercase; color: var(--gold); min-width: 70px; }
        .tc-stop-name { font-size: 0.88rem; color: var(--atlas-green); flex: 1; }
        .tc-map-link { display: inline-flex; align-items: center; gap: 3px; font-size: 0.68rem; color: var(--atlas-sage); border: 1px solid rgba(71,146,130,0.3); padding: 0.2rem 0.5rem; border-radius: 6px; text-decoration: none; }

        .tc-footer { padding: 0.8rem 1.5rem; border-top: 1px solid rgba(21,58,48,0.06); display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .tc-time { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; color: var(--text-muted); flex: 1; }
        .tc-expand-footer { font-size: 0.78rem; color: var(--atlas-sage); background: none; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; padding: 0; text-decoration: underline; }
        .tc-replan-link { display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--atlas-green); font-weight: 600; text-decoration: none; padding: 0.3rem 0.8rem; border-radius: 8px; background: rgba(21,58,48,0.06); transition: background 0.2s; }
        .tc-replan-link:hover { background: rgba(21,58,48,0.12); }

        /* Empty state */
        .wl-empty { text-align: center; padding: 5rem 2rem; }
        .wl-empty-icon { width: 80px; height: 80px; margin: 0 auto 1.5rem; border-radius: 50%; background: rgba(21,58,48,0.06); display: flex; align-items: center; justify-content: center; color: var(--atlas-sage); }

        /* Quick Save Modal */
        .qs-modal-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(11,26,21,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .qs-modal { background: white; border-radius: 28px; padding: 2.5rem; max-width: 500px; width: 100%; box-shadow: 0 40px 100px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .qs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; }
        .qs-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--atlas-green); font-weight: 700; }
        .qs-close { width: 36px; height: 36px; border-radius: 50%; background: rgba(21,58,48,0.06); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--atlas-green); }

        .form-label { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 0.5rem; }
        .form-group { margin-bottom: 1.2rem; }
        .form-input, .form-select { width: 100%; padding: 0.85rem 1rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--atlas-green); background: #F9FBFA; outline: none; }
        .form-input:focus, .form-select:focus { border-color: var(--atlas-sage); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-submit { width: 100%; padding: 1rem; border-radius: 14px; background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); color: white; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.3s; }
        .form-submit:disabled { opacity: 0.6; }
        .form-textarea { width: 100%; padding: 0.85rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; color: var(--atlas-green); resize: vertical; outline: none; }

        /* FAB */
        .wl-fab { position: fixed; bottom: 2.5rem; right: 2.5rem; z-index: 100; width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 30px rgba(21,58,48,0.35); transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s; }
        .wl-fab:hover { transform: scale(1.1); box-shadow: 0 14px 40px rgba(21,58,48,0.45); }

        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.8rem; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; border-radius: 9999px; transition: transform 0.3s, box-shadow 0.3s; }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); color: white; box-shadow: 0 6px 20px rgba(21,58,48,0.25); }
        .btn-ghost { background: transparent; border: 1.5px solid rgba(240,244,242,0.4); color: rgba(240,244,242,0.8); }

        footer { background: #0B1A15; border-top: 1px solid rgba(71,146,130,0.1); padding: 3rem 2rem; text-align: center; margin-top: 4rem; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, var(--atlas-sage), var(--atlas-cream)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
        .footer-copy { font-size: 0.75rem; color: rgba(240,244,242,0.3); }

        @media (max-width: 768px) { .wl-summary { grid-template-columns: 1fr 1fr; } .form-grid { grid-template-columns: 1fr; } }
        @media (max-width: 500px) { .wl-summary { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar />
      <div className="wishlist-page">

        {/* Hero */}
        <div className="wl-hero">
          <div className="wl-hero-inner">
            <div className="wl-label"><Bookmark size={14} /> Your Travel Wishlist</div>
            <h1 className="wl-title">
              <em>Plan Now,</em><br />Explore Later
            </h1>
            <p className="wl-sub">Save and manage your AI-generated trip plans. Edit notes, track ideas, and pick up right where you left off.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowQuickSave(true)}>
                <Plus size={16} /> Save a New Trip
              </button>
              <Link href="/reviews" className="btn btn-ghost">
                <Bookmark size={16} /> Community Reviews
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="wl-summary">
          {[
            { val: trips.length, label: 'Saved Trips' },
            { val: trips.reduce((s, t) => s + (t.days || 0), 0), label: 'Total Days Planned' },
            { val: [...new Set(trips.map(t => t.destination))].length, label: 'Destinations' },
          ].map(s => (
            <div key={s.label} className="wl-sum-card">
              <div className="wl-sum-val">{s.val}</div>
              <div className="wl-sum-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="wl-toolbar">
          <input
            className="wl-search"
            placeholder="Filter by destination or trip name..."
            value={filterDest}
            onChange={e => setFilterDest(e.target.value)}
          />
          <Link href="/route" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Compass size={16} /> Plan New Trip
          </Link>
        </div>

        {/* List */}
        <div className="wl-list">
          {filtered.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon"><Bookmark size={36} /></div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--atlas-green)', marginBottom: '0.6rem' }}>
                {trips.length === 0 ? 'No trips saved yet' : 'No trips match your filter'}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {trips.length === 0
                  ? 'Generate an itinerary on the Route Planner and save it here to access it anytime.'
                  : 'Try a different search term.'}
              </p>
              {trips.length === 0 && (
                <Link href="/route" className="btn btn-primary">Generate Your First Itinerary</Link>
              )}
            </div>
          ) : (
            filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      <button className="wl-fab" onClick={() => setShowQuickSave(true)} title="Save a New Trip">
        <Plus size={26} />
      </button>

      {/* Quick Save Modal */}
      {showQuickSave && (
        <div className="qs-modal-backdrop" onClick={e => e.target === e.currentTarget && setShowQuickSave(false)}>
          <div className="qs-modal">
            <div className="qs-header">
              <div className="qs-title">Save a Trip Idea</div>
              <button className="qs-close" onClick={() => setShowQuickSave(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleQuickSave}>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input className="form-input" required placeholder="e.g. Jaipur, Paris, Tokyo" value={quickForm.destination} onChange={e => setQuickForm({ ...quickForm, destination: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Duration (days)</label>
                  <input className="form-input" type="number" min="1" max="30" value={quickForm.days} onChange={e => setQuickForm({ ...quickForm, days: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <select className="form-select" value={quickForm.budget} onChange={e => setQuickForm({ ...quickForm, budget: e.target.value })}>
                    <option>Backpacker / Budget</option>
                    <option>Mid-range</option>
                    <option>Luxury Heritage</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-textarea" rows={3} placeholder="Hotel ideas, must-see spots, travel dates..." value={quickForm.notes} onChange={e => setQuickForm({ ...quickForm, notes: e.target.value })} />
              </div>
              <button type="submit" className="form-submit" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Trip'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer>
        <div className="footer-logo">ATLAS</div>
        <div className="footer-copy">© 2025 ATLAS · Planning your next great adventure</div>
      </footer>
    </>
  );
}
