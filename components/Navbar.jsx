'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      // Toggle navbar dock position when scrolled past hero (approx 700px or 80vh)
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
        const data = await res.json();
        
        // Attempt to extract the most specific, granular physical place or building first
        const specificPlace = data.address.amenity || data.address.building || data.address.shop || data.address.tourism || data.address.leisure || data.address.historic || data.address.road || data.address.neighbourhood;
        
        const city = data.address.city || data.address.town || data.address.village || "";
        
        let preciseLocation = "Unknown Location";
        
        if (specificPlace && city && specificPlace !== city) {
          preciseLocation = `${specificPlace}, ${city}`;
        } else if (specificPlace) {
          preciseLocation = specificPlace;
        } else if (city) {
          preciseLocation = `${city}, ${data.address.country || ""}`;
        }
        
        // Truncate to ensure the navbar doesn't stretch infinitely on very long street names
        if (preciseLocation.length > 35) preciseLocation = preciseLocation.substring(0, 32) + "...";
        
        setLocation(preciseLocation);
      } catch (err) {
        console.error(err);
        setLocation("Unavailable");
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert("Please allow location access in your browser to proceed.");
      setIsLocating(false);
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">ATLAS</Link>
      <ul className="nav-links">
        <li><Link href="/about">About</Link></li>
        <li><Link href="/#monuments">Monuments</Link></li>
        <li><Link href="/#nearby">Nearby</Link></li>
        <li><Link href="/#explore">Explore</Link></li>
        <li><Link href="/#ride">Ride</Link></li>
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
                  borderRadius: '9999px',
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
            <Link href="/login" className="btn-nav" style={{ borderRadius: '9999px' }}>Sign In</Link>
          </li>
        )}
        <li>
          {location ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', border: '1px solid var(--gold)', padding: '0.4rem 0.8rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              📍 {location}
            </span>
          ) : (
            <button onClick={handleLocate} disabled={isLocating} style={{ fontSize: '0.8rem', color: 'var(--gold)', background: 'transparent', border: '1px dashed var(--gold)', padding: '0.4rem 0.8rem', borderRadius: '9999px', cursor: 'pointer' }}>
              {isLocating ? 'Locating...' : '📍 Detect Location'}
            </button>
          )}
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
