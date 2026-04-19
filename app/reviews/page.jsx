'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Heart, MessageSquare, MapPin, Star, Plus, X, Upload,
  Filter, Search, Camera, Award, TrendingUp, ChevronDown
} from 'lucide-react';

const CATEGORIES = ['All', 'Monument', 'Cafe', 'Restaurant', 'Bazaar', 'Ride', 'Hotel', 'Hidden Gem'];
const PLACES = [
  'Hawa Mahal', 'Amer Fort', 'City Palace', 'Jal Mahal', 'Nahargarh Fort',
  'Jantar Mantar', 'Patrika Gate', 'Johari Bazaar', 'Bapu Bazaar', 'Anokhi Cafe',
  'Tapri Central', 'Cafe Palladio', 'Suvarna Mahal', 'LMB Jaipur', 'Rapido',
  'OLA Cabs', 'Uber', 'Tripolia Bazaar', 'Other'
];

const SAMPLE_REVIEWS = [
  {
    id: 1, author_name: 'Priya Sharma', place: 'Hawa Mahal', category: 'Monument',
    rating: 5, body: 'Absolutely breathtaking at sunrise. The 953 windows cast the most incredible light patterns inside. We arrived at 6am just to avoid the crowds — completely worth it. The rooftop view of the old city is something you will carry with you for life.',
    image_url: 'https://res.cloudinary.com/dbizje0oq/image/upload/v1776553271/Hawa-Mahal-2_zkkaws.jpg',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), review_likes: [{}, {}, {}], user_id: 'sample1'
  },
  {
    id: 2, author_name: 'Arjun Mehta', place: 'Tapri Central', category: 'Cafe',
    rating: 5, body: 'The ultimate Jaipur chai experience. Rooftop seating with a panoramic view of the Pink City, and their masala chai is genuinely the best I have had — anywhere. The bun maska is the perfect companion. Go during golden hour.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(), review_likes: [{}, {}], user_id: 'sample2'
  },
  {
    id: 3, author_name: 'Francesca Romano', place: 'Johari Bazaar', category: 'Bazaar',
    rating: 4, body: 'A sensory overload in the best possible way. Rows of glittering gems, kundan jewelry, and lac bangles as far as you can see. Bargain confidently — the shopkeepers expect it and respect a fair negotiator. Set aside 3 hours minimum.',
    image_url: 'https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=800&q=80',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), review_likes: [{}], user_id: 'sample3'
  },
  {
    id: 4, author_name: 'Ravi Kumar', place: 'Amer Fort', category: 'Monument',
    rating: 5, body: 'The elephant ride up to the fort is a highlight in itself. Inside, the Sheesh Mahal hall of mirrors is worth the entire trip — a single candle illuminates the entire ceiling like a night sky. The audio guide app is excellent.',
    image_url: '/thumbnails/Amber Fort.png',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), review_likes: [{}, {}, {}, {}], user_id: 'sample4'
  },
];

function StarRating({ value, onChange, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star} type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 0 }}
        >
          <Star size={size} fill={(hover || value) >= star ? '#D4AF37' : 'none'} color={(hover || value) >= star ? '#D4AF37' : '#567368'} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, user, onLike }) {
  const isLiked = review.review_likes?.some(l => l.user_id === user?.id);
  const likeCount = review.review_likes?.length || 0;
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return d === 1 ? '1 day ago' : `${d} days ago`;
  };

  return (
    <div className="review-card">
      {/* Header */}
      <div className="rc-header">
        <div className="rc-avatar">{review.author_name.charAt(0).toUpperCase()}</div>
        <div className="rc-meta">
          <div className="rc-name">{review.author_name}</div>
          <div className="rc-place"><MapPin size={11} /> {review.place}</div>
        </div>
        <div className="rc-badge">{review.category}</div>
      </div>

      {/* Image */}
      {review.image_url && (
        <div className="rc-image-wrap">
          <img src={review.image_url} alt={review.place} className="rc-image" />
          <div className="rc-image-overlay">
            <StarRating value={review.rating} size={16} />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="rc-body">
        {!review.image_url && <div style={{ marginBottom: '0.6rem' }}><StarRating value={review.rating} size={16} /></div>}
        <p className="rc-text">{review.body}</p>
      </div>

      {/* Footer */}
      <div className="rc-footer">
        <button
          className={`rc-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(review.id)}
          title={user ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
        >
          <Heart size={16} fill={isLiked ? '#E53E3E' : 'none'} color={isLiked ? '#E53E3E' : 'currentColor'} />
          <span>{likeCount}</span>
        </button>
        <span className="rc-time">{timeAgo(review.created_at)}</span>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [filtered, setFiltered] = useState(SAMPLE_REVIEWS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [form, setForm] = useState({
    place: '', category: 'Monument', rating: 0, body: '', image_url: ''
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    fetchReviews();
  }, []);

  useEffect(() => {
    let result = [...reviews];
    if (activeCategory !== 'All') result = result.filter(r => r.category === activeCategory);
    if (searchQuery) result = result.filter(r =>
      r.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === 'top') result.sort((a, b) => (b.review_likes?.length || 0) - (a.review_likes?.length || 0));
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    setFiltered(result);
  }, [reviews, activeCategory, searchQuery, sortBy]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.length) setReviews([...data, ...SAMPLE_REVIEWS]);
      }
    } catch (e) { /* Use sample data on error */ }
  };

  const handleLike = async (reviewId) => {
    if (!user) { alert('Please sign in to like reviews.'); return; }
    // Optimistic update
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      const isLiked = r.review_likes?.some(l => l.user_id === user.id);
      return {
        ...r,
        review_likes: isLiked
          ? r.review_likes.filter(l => l.user_id !== user.id)
          : [...(r.review_likes || []), { user_id: user.id }]
      };
    }));
    try {
      await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
    } catch (e) { fetchReviews(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { alert('Please select a star rating.'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
          ...form, body: form.body
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews(prev => [{ ...data, review_likes: [] }, ...prev]);
      setShowModal(false);
      setForm({ place: '', category: 'Monument', rating: 0, body: '', image_url: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: reviews.length,
    topRated: reviews.filter(r => r.rating === 5).length,
    totalLikes: reviews.reduce((s, r) => s + (r.review_likes?.length || 0), 0)
  };

  return (
    <>
      <style>{`
        .reviews-page { min-height: 100vh; padding-bottom: 6rem; }

        /* Hero */
        .rv-hero {
          background: linear-gradient(160deg, var(--atlas-green) 0%, #0B1A15 100%);
          padding: 8rem 2rem 3rem;
          position: relative; overflow: hidden;
        }
        .rv-hero::before {
          content: ''; position: absolute; top: -40%; right: -10%;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(71,146,130,0.15) 0%, transparent 70%);
        }
        .rv-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .rv-hero-label { font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .rv-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; color: var(--atlas-cream); line-height: 1.1; margin-bottom: 1rem; }
        .rv-hero-title em { font-style: italic; color: var(--gold); }
        .rv-hero-sub { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: rgba(240,244,242,0.7); margin-bottom: 2.5rem; max-width: 500px; line-height: 1.7; }
        .rv-hero-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }

        /* Stats bar */
        .rv-stats-bar {
          background: var(--atlas-pure);
          border-bottom: 1px solid rgba(21,58,48,0.1);
          padding: 1.5rem 2rem;
        }
        .rv-stats-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 3rem; align-items: center; flex-wrap: wrap; }
        .rv-stat { display: flex; align-items: center; gap: 0.8rem; }
        .rv-stat-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(21,58,48,0.06); display: flex; align-items: center; justify-content: center; color: var(--atlas-green); }
        .rv-stat-val { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--atlas-green); font-weight: 700; }
        .rv-stat-label { font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); }

        /* Toolbar */
        .rv-toolbar {
          max-width: 1200px; margin: 2rem auto; padding: 0 2rem;
          display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
        }
        .rv-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .rv-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .rv-search { width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; background: white; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--atlas-green); outline: none; transition: border-color 0.3s; }
        .rv-search:focus { border-color: var(--atlas-sage); box-shadow: 0 0 0 3px rgba(71,146,130,0.1); }
        .rv-sort { padding: 0.75rem 1rem; border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px; background: white; font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--atlas-green); cursor: pointer; }

        /* Category Pills */
        .rv-cats { max-width: 1200px; margin: 0 auto 2rem; padding: 0 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .rv-cat-pill { padding: 0.45rem 1.1rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px; border: 1.5px solid rgba(21,58,48,0.15); background: white; color: var(--text-muted); cursor: pointer; transition: all 0.25s; }
        .rv-cat-pill.active, .rv-cat-pill:hover { background: var(--atlas-green); color: white; border-color: var(--atlas-green); transform: translateY(-2px); box-shadow: 0 4px 14px rgba(21,58,48,0.2); }

        /* Grid */
        .rv-grid { max-width: 1200px; margin: 0 auto; padding: 0 2rem; columns: 3; gap: 1.5rem; }
        @media (max-width: 1100px) { .rv-grid { columns: 2; } }
        @media (max-width: 680px) { .rv-grid { columns: 1; } }

        /* Review Card */
        .review-card {
          break-inside: avoid; margin-bottom: 1.5rem;
          background: white; border-radius: 20px;
          border: 1px solid rgba(21,58,48,0.07);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease;
        }
        .review-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(21,58,48,0.12); }

        .rc-header { padding: 1.2rem 1.2rem 0.8rem; display: flex; align-items: center; gap: 0.8rem; }
        .rc-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 1.2rem; color: white; font-weight: 700; flex-shrink: 0; }
        .rc-meta { flex: 1; }
        .rc-name { font-weight: 700; font-size: 0.95rem; color: var(--atlas-green); }
        .rc-place { display: flex; align-items: center; gap: 3px; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
        .rc-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 6px; background: rgba(21,58,48,0.06); color: var(--atlas-sage); border: 1px solid rgba(71,146,130,0.2); }

        .rc-image-wrap { position: relative; width: 100%; height: 220px; overflow: hidden; }
        .rc-image { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .review-card:hover .rc-image { transform: scale(1.04); }
        .rc-image-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(to top, rgba(21,58,48,0.85) 0%, transparent 100%); }

        .rc-body { padding: 1rem 1.2rem; }
        .rc-text { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: #334155; line-height: 1.7; }

        .rc-footer { padding: 0.8rem 1.2rem 1rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(21,58,48,0.06); }
        .rc-like-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 0.85rem; font-family: 'Outfit', sans-serif; padding: 0.4rem 0.8rem; border-radius: 8px; transition: all 0.2s; }
        .rc-like-btn:hover { background: rgba(229,62,62,0.08); color: #E53E3E; }
        .rc-like-btn.liked { color: #E53E3E; }
        .rc-time { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.5px; }

        /* Empty state */
        .rv-empty { max-width: 1200px; margin: 4rem auto; padding: 4rem 2rem; text-align: center; }
        .rv-empty-icon { width: 80px; height: 80px; margin: 0 auto 1.5rem; border-radius: 50%; background: rgba(21,58,48,0.06); display: flex; align-items: center; justify-content: center; color: var(--atlas-sage); }

        /* Post Button */
        .post-btn {
          position: fixed; bottom: 2.5rem; right: 2.5rem; z-index: 100;
          width: 62px; height: 62px; border-radius: 50%;
          background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage));
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 8px 30px rgba(21,58,48,0.35);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
        }
        .post-btn:hover { transform: scale(1.1) rotate(90deg); box-shadow: 0 14px 40px rgba(21,58,48,0.45); }

        /* Modal */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(11,26,21,0.75); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: white; border-radius: 28px; padding: 2.5rem;
          max-width: 560px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
          animation: slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--atlas-green); font-weight: 700; }
        .modal-close { width: 36px; height: 36px; border-radius: 50%; background: rgba(21,58,48,0.06); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--atlas-green); transition: background 0.2s; }
        .modal-close:hover { background: rgba(21,58,48,0.12); }

        .form-group { margin-bottom: 1.4rem; }
        .form-label { display: block; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--atlas-sage); margin-bottom: 0.5rem; }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 0.85rem 1rem;
          border: 1.5px solid rgba(21,58,48,0.12); border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem;
          color: var(--atlas-green); background: #F9FBFA; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--atlas-sage); background: white;
          box-shadow: 0 0 0 3px rgba(71,146,130,0.1);
        }
        .form-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-submit {
          width: 100%; padding: 1rem; border-radius: 14px;
          background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage));
          color: white; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          transition: opacity 0.3s, transform 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .form-submit:hover { opacity: 0.9; transform: translateY(-2px); }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .signin-nudge {
          background: linear-gradient(135deg, rgba(21,58,48,0.05), rgba(71,146,130,0.05));
          border: 1px dashed rgba(21,58,48,0.2); border-radius: 14px; padding: 1.5rem;
          text-align: center; margin-bottom: 1.5rem;
        }

        /* Btn */
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.8rem; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; cursor: pointer; border: none; border-radius: 9999px; transition: transform 0.3s, box-shadow 0.3s; }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(135deg, var(--atlas-green), var(--atlas-sage)); color: white; box-shadow: 0 6px 20px rgba(21,58,48,0.25); }
        .btn-ghost { background: transparent; border: 1.5px solid var(--atlas-green); color: var(--atlas-green); }

        footer { background: #0B1A15; border-top: 1px solid rgba(71,146,130,0.1); padding: 3rem 2rem; text-align: center; margin-top: 4rem; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; background: linear-gradient(135deg, var(--atlas-sage), var(--atlas-cream)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
        .footer-copy { font-size: 0.75rem; color: rgba(240,244,242,0.3); }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="rv-hero">
        <div className="rv-hero-inner">
          <div className="rv-hero-label"><Camera size={14} /> Community Reviews</div>
          <h1 className="rv-hero-title">
            Real Stories from<br /><em>Real Travellers</em>
          </h1>
          <p className="rv-hero-sub">
            Discover authentic reviews of Jaipur's monuments, cafes, bazaars, and more — written by people who have actually been there.
          </p>
          <div className="rv-hero-row">
            <button className="btn btn-primary" onClick={() => user ? setShowModal(true) : window.location.href = '/login'}>
              <Plus size={16} /> Write a Review
            </button>
            <Link href="/wishlist" className="btn btn-ghost" style={{ borderColor: 'rgba(240,244,242,0.4)', color: 'rgba(240,244,242,0.8)' }}>
              <Award size={16} /> My Saved Trips
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="rv-stats-bar">
        <div className="rv-stats-inner">
          {[
            { icon: <MessageSquare size={18} />, val: stats.total, label: 'Reviews' },
            { icon: <Star size={18} />, val: stats.topRated, label: '5-Star Reviews' },
            { icon: <Heart size={18} />, val: stats.totalLikes, label: 'Total Likes' },
            { icon: <TrendingUp size={18} />, val: Math.round(reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1) * 10) / 10, label: 'Avg Rating' },
          ].map(s => (
            <div key={s.label} className="rv-stat">
              <div className="rv-stat-icon">{s.icon}</div>
              <div>
                <div className="rv-stat-val">{s.val}</div>
                <div className="rv-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="rv-toolbar">
        <div className="rv-search-wrap">
          <span className="rv-search-icon"><Search size={16} /></span>
          <input className="rv-search" placeholder="Search places, reviews..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="rv-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="top">Most Liked</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="rv-cats">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`rv-cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rv-empty">
          <div className="rv-empty-icon"><MessageSquare size={36} /></div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--atlas-green)', marginBottom: '0.5rem' }}>No reviews found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="rv-grid">
          {filtered.map(review => (
            <ReviewCard key={review.id} review={review} user={user} onLike={handleLike} />
          ))}
        </div>
      )}

      {/* Floating Post Button */}
      <button className="post-btn" onClick={() => user ? setShowModal(true) : window.location.href = '/login'} title="Write a Review">
        <Plus size={26} />
      </button>

      {/* Post Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Share Your Experience</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {!user && (
              <div className="signin-nudge">
                <p style={{ color: 'var(--atlas-green)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                  Sign in to post reviews and help other travellers.
                </p>
                <Link href="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>Sign In</Link>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Place / Location</label>
                  <select className="form-select" value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} required>
                    <option value="">Select a place...</option>
                    {PLACES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} size={28} />
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-textarea" placeholder="Share what made this place special, what to expect, tips for other travellers..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required minLength={30} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} /> Photo URL (optional)
                </label>
                <input className="form-input" type="url" placeholder="https://your-image-url.jpg" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>

              <button type="submit" className="form-submit" disabled={isSubmitting || !user}>
                {isSubmitting ? 'Posting...' : <><MessageSquare size={16} /> Post Review</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer>
        <div className="footer-logo">ATLAS</div>
        <div className="footer-copy">© 2025 ATLAS · Authentic stories from the Pink City</div>
      </footer>
    </>
  );
}
