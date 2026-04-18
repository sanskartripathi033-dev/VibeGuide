'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess('✅ Account created! Check your email to confirm, then sign in.');
    setTab('signin');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Dancing+Script:wght@700&family=Outfit:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0D1614;font-family:'Outfit',sans-serif;overflow-x:hidden}

        .login-wrap {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
        }

        /* LEFT PANEL */
        .login-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .login-left-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1477587458883-47145ed6736c?w=1200&q=85') center/cover no-repeat;
          filter: brightness(0.35) saturate(0.8);
          transform: scale(1.03);
          transition: transform 8s ease;
        }
        .login-left:hover .login-left-bg { transform: scale(1); }
        .login-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(13,22,20,0.3) 0%, rgba(13,22,20,0.85) 100%);
        }
        .login-left-content { position: relative; z-index: 2; }
        .login-brand {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 900; letter-spacing: 2px;
          background: linear-gradient(135deg,#78D59A,#3BA78F);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 0.4rem;
        }
        .login-brand-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 1.1rem; color: #EEF1F0; opacity: 0.8;
          margin-bottom: 2rem;
        }
        .login-quote {
          font-family: 'Dancing Script', cursive;
          font-size: 1.6rem; color: #78D59A; line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .login-quote-attr {
          font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase;
          color: #8FBBAF;
        }

        /* RIGHT PANEL */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: linear-gradient(160deg, #12241F 0%, #0D1614 100%);
          position: relative;
        }
        .login-right::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(59,167,143,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          width: 100%; max-width: 420px;
          background: rgba(20,36,32,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59,167,143,0.18);
          border-radius: 8px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          position: relative;
          z-index: 1;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 700; margin-bottom: 0.4rem;
          background: linear-gradient(135deg,#78D59A,#3BA78F);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .card-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; color: #8FBBAF; font-style: italic; margin-bottom: 2rem;
        }

        /* Tab switcher */
        .auth-tabs {
          display: flex; margin-bottom: 2rem;
          border-bottom: 1px solid rgba(59,167,143,0.15);
        }
        .auth-tab {
          flex: 1; padding: 0.7rem 1rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase;
          background: none; border: none; cursor: pointer;
          color: #8FBBAF; transition: color 0.3s; position: relative;
        }
        .auth-tab::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; background: #3BA78F; transform: scaleX(0);
          transition: transform 0.3s;
        }
        .auth-tab.active { color: #3BA78F; }
        .auth-tab.active::after { transform: scaleX(1); }

        /* Form */
        .form-group { margin-bottom: 1.2rem; }
        .form-label {
          display: block; font-size: 0.7rem; letter-spacing: 2.5px;
          text-transform: uppercase; color: #8FBBAF; margin-bottom: 0.4rem;
        }
        .form-input {
          width: 100%; padding: 0.85rem 1rem;
          background: rgba(13,22,20,0.7);
          border: 1px solid rgba(59,167,143,0.2);
          border-radius: 4px;
          color: #EEF1F0; font-family: 'Outfit', sans-serif; font-size: 0.9rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
        }
        .form-input:focus {
          border-color: rgba(59,167,143,0.6);
          box-shadow: 0 0 0 3px rgba(59,167,143,0.08);
        }
        .form-input::placeholder { color: #436A5E; }

        .submit-btn {
          width: 100%; padding: 0.9rem;
          background: linear-gradient(135deg, #236757, #3BA78F);
          color: #EEF1F0;
          font-family: 'Outfit', sans-serif; font-size: 0.85rem;
          font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          border: none; border-radius: 9999px; cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 6px 15px rgba(35,103,87,0.3);
          margin-top: 0.5rem;
        }
        .submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-110%) skewX(-15deg);
          transition: transform 0.4s;
        }
        .submit-btn:hover::before { transform: translateX(110%) skewX(-15deg); }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(59,167,143,0.4); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error-msg {
          background: rgba(128,0,0,0.2); border: 1px solid rgba(200,50,50,0.4);
          border-radius: 4px; padding: 0.8rem 1rem;
          color: #ff8888; font-size: 0.82rem; margin-bottom: 1rem;
        }
        .success-msg {
          background: rgba(0,122,0,0.2); border: 1px solid rgba(0,200,100,0.3);
          border-radius: 4px; padding: 0.8rem 1rem;
          color: #66ffaa; font-size: 0.82rem; margin-bottom: 1rem;
        }

        .divider {
          display: flex; align-items: center; gap: 0.8rem;
          margin: 1.5rem 0; color: #8FBBAF; font-size: 0.75rem; letter-spacing: 2px;
        }
        .divider::before,.divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(59,167,143,0.12);
        }

        .back-link {
          display: block; text-align: center; margin-top: 1.5rem;
          font-size: 0.8rem; color: #8FBBAF; text-decoration: none;
          letter-spacing: 1px; transition: color 0.3s;
        }
        .back-link:hover { color: #3BA78F; }

        /* Ornament */
        .card-ornament {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .card-orn-line { flex:1; height:1px; background: linear-gradient(to right, transparent, rgba(59,167,143,0.3)); }
        .card-orn-line.rev { background: linear-gradient(to left, transparent, rgba(59,167,143,0.3)); }
        .card-orn-diamond { width:6px;height:6px;background:#3BA78F;transform:rotate(45deg); }

        @media(max-width:768px){
          .login-wrap { grid-template-columns:1fr; }
          .login-left { display:none; }
        }
      `}</style>

      <div className="login-wrap">
        {/* LEFT: Brand Panel */}
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <div className="login-brand">VibeGuide</div>
            <div className="login-brand-sub">Your Royal Jaipur Travel Companion</div>
            <div className="login-quote">&ldquo;Jaipur is not just a city,<br />it is a state of mind.&rdquo;</div>
            <div className="login-quote-attr">— The Pink City, Rajasthan</div>
          </div>
        </div>

        {/* RIGHT: Auth Card */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-title">
              {tab === 'signin' ? 'Welcome Back' : 'Join VibeGuide'}
            </div>
            <div className="card-subtitle">
              {tab === 'signin'
                ? 'Sign in to access your travel dashboard & live crowd heatmap'
                : 'Create your account to start exploring Jaipur'}
            </div>

            <div className="card-ornament">
              <div className="card-orn-line" />
              <div className="card-orn-diamond" />
              <div className="card-orn-line rev" />
            </div>

            {/* Tab Switcher */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setError(''); setSuccess(''); }}
              >Sign In</button>
              <button
                className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
              >Sign Up</button>
            </div>

            {error && <div className="error-msg">⚠ {error}</div>}
            {success && <div className="success-msg">{success}</div>}

            {/* SIGN IN FORM */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email-signin">Email Address</label>
                  <input
                    id="email-signin"
                    className="form-input"
                    type="email" name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handle}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password-signin">Password</label>
                  <input
                    id="password-signin"
                    className="form-input"
                    type="password" name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handle}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : '✦ Sign In to VibeGuide'}
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name-signup">Full Name</label>
                  <input
                    id="name-signup"
                    className="form-input"
                    type="text" name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handle}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email-signup">Email Address</label>
                  <input
                    id="email-signup"
                    className="form-input"
                    type="email" name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handle}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password-signup">Password</label>
                  <input
                    id="password-signup"
                    className="form-input"
                    type="password" name="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handle}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : '✦ Create My Account'}
                </button>
              </form>
            )}

            <div className="divider">or</div>

            <Link href="/" className="back-link">← Back to VibeGuide Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
