'use client';
import { useState, useEffect } from 'react';

// Hardcoded coordinates for Jaipur monuments
const MONUMENTS = [
  { name: 'Hawa Mahal', lat: 26.9239, lng: 75.8267, cat: 'Palace' },
  { name: 'Amber Fort', lat: 26.9855, lng: 75.8513, cat: 'Fort' },
  { name: 'City Palace', lat: 26.9255, lng: 75.8236, cat: 'Palace' },
  { name: 'Jantar Mantar', lat: 26.9247, lng: 75.8245, cat: 'Observatory' },
  { name: 'Nahargarh Fort', lat: 26.9372, lng: 75.8160, cat: 'Fort' },
  { name: 'Jal Mahal', lat: 26.9672, lng: 75.8456, cat: 'Palace' },
  { name: 'Albert Hall Museum', lat: 26.9116, lng: 75.8195, cat: 'Museum' },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export default function NearbyMonuments() {
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const locateUser = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        
        // Calculate distances and sort
        const withDistances = MONUMENTS.map(m => ({
          ...m,
          distance: calculateDistance(userLat, userLng, m.lat, m.lng)
        })).sort((a, b) => a.distance - b.distance);
        
        setNearby(withDistances);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Location access denied. Enable GPS to find nearby places.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    // Optionally auto-locate on mount, but better to let user click to save privacy/battery
  }, []);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(212,175,55,0.1)',
      borderRadius: '8px',
      padding: '2rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            What&apos;s Nearby?
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Find the closest heritage sites to your current location.</p>
        </div>
        <button onClick={locateUser} disabled={loading} style={{
          background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)',
          color: 'var(--gold)', padding: '0.6rem 1.2rem', borderRadius: '4px',
          fontFamily: "'Outfit',sans-serif", fontSize: '0.75rem', letterSpacing: '1px',
          textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s'
        }}>
          {loading ? 'Locating...' : '📍 Find Nearby Monuments'}
        </button>
      </div>

      {error && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</div>}

      {nearby.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {nearby.map((m) => (
            <div key={m.name} style={{
              background: 'var(--bg-card2)', border: '1px solid rgba(212,175,55,0.08)',
              padding: '1.2rem', borderRadius: '6px',
            }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
                {m.cat}
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', marginBottom: '0.6rem' }}>
                {m.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {m.distance < 1 ? (m.distance * 1000).toFixed(0) + ' m away' : m.distance.toFixed(1) + ' km away'}
                </span>
                <a href={`https://maps.google.com/?q=${m.lat},${m.lng}`} target="_blank" rel="noreferrer" style={{
                  fontSize: '0.75rem', color: 'var(--terracotta-light)', textDecoration: 'none',
                  borderBottom: '1px solid var(--terracotta-light)', paddingBottom: '0.1rem'
                }}>
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {nearby.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Click the button to scan the area around you.
        </div>
      )}
    </div>
  );
}
