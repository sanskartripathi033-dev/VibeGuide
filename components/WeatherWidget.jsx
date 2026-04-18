'use client';
import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Gauge, CloudLightning, CloudSnow, CloudFog, CloudDrizzle, Thermometer, Calendar } from 'lucide-react';

const getWMOInfo = (code) => {
  if (code === 0) return { label: 'Clear Sky', Icon: Sun, color: '#facc15' };
  if (code === 1 || code === 2) return { label: 'Partly Cloudy', Icon: Cloud, color: '#e2e8f0' };
  if (code === 3) return { label: 'Overcast', Icon: Cloud, color: '#94a3b8' };
  if ([45, 48].includes(code)) return { label: 'Foggy', Icon: CloudFog, color: '#cbd5e1' };
  if ([51, 53, 55].includes(code)) return { label: 'Drizzle', Icon: CloudDrizzle, color: '#93c5fd' };
  if ([61, 63, 65].includes(code)) return { label: 'Rain', Icon: CloudRain, color: '#3b82f6' };
  if ([71, 73, 75].includes(code)) return { label: 'Snow', Icon: CloudSnow, color: '#e0f2fe' };
  if ([80, 81, 82].includes(code)) return { label: 'Showers', Icon: CloudRain, color: '#2563eb' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', Icon: CloudLightning, color: '#8b5cf6' };
  return { label: 'Unknown', Icon: Thermometer, color: '#cbd5e1' };
};

const LAT = 26.9124;
const LON = 75.7873;

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&timezone=Asia%2FKolkata`
    )
      .then(r => r.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load weather data.');
        setLoading(false);
      });
  }, []);

  if (loading || error || !weather) return null;

  const c = weather.current;
  const { label, Icon, color } = getWMOInfo(c.weather_code);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 100,
        fontFamily: "'Outfit',sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Card */}
      <div style={{
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: '1rem',
        background: 'rgba(13,22,20,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,167,143,0.3)',
        borderRadius: '16px',
        padding: '1.5rem',
        width: 'max-content',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        opacity: isHovered ? 1 : 0,
        visibility: isHovered ? 'visible' : 'hidden',
        transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isHovered ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>Jaipur, Rajasthan</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={20} color={color} /> {label}
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: 'var(--text-main)' }}>
            {Math.round(c.temperature_2m)}°
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Droplets size={16} color="#93c5fd" />
            <span style={{ fontSize: '0.85rem' }}>{Math.round(c.relative_humidity_2m)}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Wind size={16} color="#cbd5e1" />
            <span style={{ fontSize: '0.85rem' }}>{Math.round(c.wind_speed_10m)} km/h</span>
          </div>
        </div>
      </div>

      {/* Floating Cloud Button */}
      <div 
        className="cloud-button"
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(59,167,143,0.9), rgba(20,50,45,0.95))',
          backdropFilter: 'blur(8px)',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '1px solid rgba(132,212,192,0.4)',
          boxShadow: isHovered 
            ? '0 0 20px rgba(59,167,143,0.6)' 
            : '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon 
          size={28} 
          color={color === '#facc15' ? '#fde047' : '#ffffff'} 
          strokeWidth={2.5} 
        />
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .cloud-button {
          animation: float 4s ease-in-out infinite;
        }
        .cloud-button:hover {
          animation-play-state: paused;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
