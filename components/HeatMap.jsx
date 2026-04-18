'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Activity, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function HeatMap({ user }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const trackingIntervalRef = useRef(null);

  const [heatmapOn, setHeatmapOn] = useState(false);
  const [trackingOn, setTrackingOn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [pointCount, setPointCount] = useState(0);
  const [currentCoords, setCurrentCoords] = useState(null);

  useEffect(() => {
    // Only initialize map on client side
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Dynamically import Leaflet so it doesn't break SSR
    import('leaflet').then((L) => {
      import('leaflet.heat').then(() => {
        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [26.9124, 75.7873], // Jaipur, Rajasthan
          zoom: 13,
          zoomControl: true,
        });

        // Use a sleek dark-themed OpenStreetMap tile layer (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Initialize empty Heatmap Layer
        heatmapLayerRef.current = L.heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: {
            0.0: 'rgba(0,0,0,0)',
            0.3: '#00c850',
            0.5: '#ffe600',
            0.7: '#ff5000',
            1.0: '#ff0000',
          }
        });

        // Refresh data when map is dragged or zoomed
        map.on('moveend', () => {
          if (heatmapOn) fetchAndUpdateHeatmap();
        });
      });
    });

    return () => {
       if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
       if (mapInstanceRef.current) {
         mapInstanceRef.current.remove();
         mapInstanceRef.current = null;
       }
    };
  }, []);

  async function fetchAndUpdateHeatmap() {
    if (!mapInstanceRef.current || !heatmapLayerRef.current) return;
    const bounds = mapInstanceRef.current.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    try {
      const res = await fetch(
        `/api/heatmap?lat_min=${sw.lat}&lat_max=${ne.lat}&lng_min=${sw.lng}&lng_max=${ne.lng}`
      );
      if (!res.ok) throw new Error('API error');
      const { points } = await res.json();
      
      setPointCount(points.length);

      // leaflet.heat expects an array of [lat, lng, intensity]
      const heatData = points.map(p => [p.lat, p.lng, 1.0]);
      heatmapLayerRef.current.setLatLngs(heatData);
    } catch (err) {
      console.error('Heatmap fetch error:', err);
    }
  }

  // Toggle heatmap layer visibility
  const toggleHeatmap = () => {
    if (!heatmapLayerRef.current || !mapInstanceRef.current) return;
    if (heatmapOn) {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
      setHeatmapOn(false);
      setStatusMsg('');
    } else {
      heatmapLayerRef.current.addTo(mapInstanceRef.current);
      setHeatmapOn(true);
      fetchAndUpdateHeatmap();
      setStatusMsg('Live crowd data loaded');
    }
  };

  // Toggle path tracking
  const toggleTracking = () => {
    if (!user) { setStatusMsg('⚠ Sign in to track your path'); return; }
    if (trackingOn) {
      clearInterval(trackingIntervalRef.current);
      setTrackingOn(false);
      setStatusMsg('Tracking stopped');
    } else {
      setTrackingOn(true);
      setStatusMsg('Tracking your path...');
      trackingIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          setCurrentCoords({ lat, lng });

          // Fly to the new location smoothly
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
          }
          
          await fetch('/api/trails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, user_id: user.id }),
          });

          // If heatmap is on, instantly drop a small visual marker for the user's satisfaction
          // (They are already saved to db, this just shows immediate feedback)
          if (heatmapOn && heatmapLayerRef.current) {
             heatmapLayerRef.current.addLatLng([lat, lng, 1.0]);
          }

        }, (err) => setStatusMsg('Location access denied'));
      }, 10000); // 10 seconds
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '4px',
          border: '1px solid rgba(59,167,143,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          background: '#0a0a0a',
          zIndex: 1 // Leaflet needs low z-index so controls can go above
        }}
      />

      {/* Control Overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        zIndex: 10,
      }}>
        {/* Heatmap Toggle */}
        <button
          onClick={toggleHeatmap}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: heatmapOn
              ? 'linear-gradient(135deg,rgba(255,80,0,0.9),rgba(255,0,0,0.85))'
              : 'rgba(13,22,20,0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59,167,143,0.35)',
            borderRadius: '4px',
            padding: '0.7rem 1.2rem',
            color: heatmapOn ? '#fff' : 'var(--gold)',
            cursor: 'pointer',
            fontFamily: 'Outfit,sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: 600,
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
          }}
        >
          <Flame size={16} /> {heatmapOn ? 'Hide' : 'Show'} Live Crowd Trails
          {heatmapOn && pointCount > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '20px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.7rem',
            }}>{pointCount} pts</span>
          )}
        </button>

        {/* Track Path Toggle */}
        <button
          onClick={toggleTracking}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: trackingOn
              ? 'linear-gradient(135deg,rgba(0,122,122,0.9),rgba(0,77,77,0.85))'
              : 'rgba(13,22,20,0.88)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${trackingOn ? 'rgba(0,200,150,0.5)' : 'rgba(59,167,143,0.35)'}`,
            borderRadius: '4px',
            padding: '0.7rem 1.2rem',
            color: trackingOn ? '#00ffaa' : 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'Outfit,sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: 600,
            transition: 'all 0.3s',
            whiteSpace: 'nowrap',
          }}
        >
          <Activity size={16} color={trackingOn ? "#00ffaa" : "#94a3b8"} /> 
          {trackingOn ? 'Tracking ON' : 'Track My Path'}
        </button>

        {/* Status Message */}
        {statusMsg && (
          <div style={{
            background: 'rgba(13,22,20,0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59,167,143,0.2)',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            color: 'var(--sand)',
            fontSize: '0.75rem',
            letterSpacing: '1px',
          }}>{statusMsg}</div>
        )}
      </div>

      {/* Coordinates overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'rgba(13,22,20,0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59,167,143,0.3)',
        borderRadius: '4px',
        padding: '1rem 1.5rem',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <MapPin size={18} /> {currentCoords ? 'Your Location' : 'Jaipur, Rajasthan'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {currentCoords
            ? `${currentCoords.lat.toFixed(4)}° N, ${currentCoords.lng.toFixed(4)}° E`
            : '26.9124° N, 75.7873° E'}
        </p>
      </div>

      {/* Ensure map controls don't overlap wildly */}
      <style>{`
        .leaflet-control-zoom { border: 1px solid rgba(59,167,143,0.2) !important; border-radius: 4px !important; overflow: hidden; }
        .leaflet-control-zoom a { background: rgba(13,22,20,0.85) !important; color: #3BA78F !important; border-bottom: 1px solid rgba(59,167,143,0.1) !important; }
        .leaflet-control-zoom a:hover { background: rgba(26,20,14,0.9) !important; }
        .leaflet-container { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  );
}
