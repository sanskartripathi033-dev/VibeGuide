'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav>
      <Link href="/" className="nav-logo">VibeGuide</Link>
      <ul className="nav-links">
        <li><Link href="/about">About</Link></li>
        <li><Link href="/#monuments">Monuments</Link></li>
        <li><Link href="/#explore">Explore</Link></li>
        <li><Link href="/route">Route</Link></li>
        <li><Link href="/#map-section">Map</Link></li>
        {user ? (
          <>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="btn-nav"
                style={{
                  background: 'transparent',
                  border: '1.5px solid var(--gold)',
                  color: 'var(--gold)',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >Sign Out</button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className="btn-nav">Sign In</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
