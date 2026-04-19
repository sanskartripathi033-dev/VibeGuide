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
      `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=4`
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
        top: '2rem',
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
        top: '100%',
        right: 0,
        marginTop: '1rem',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(21, 58, 48, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        width: 'max-content',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        opacity: isHovered ? 1 : 0,
        visibility: isHovered ? 'visible' : 'hidden',
        transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isHovered ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.8rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#000000', marginBottom: '0.2rem', fontWeight: 700 }}>Jaipur, Rajasthan</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#000000', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={20} color={color === '#cbd5e1' || color === '#e2e8f0' ? '#64748b' : color} /> {label}
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#000000' }}>
            {Math.round(c.temperature_2m)}°
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
            <Droplets size={16} color="#3b82f6" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.round(c.relative_humidity_2m)}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
            <Wind size={16} color="#475569" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.round(c.wind_speed_10m)} km/h</span>
          </div>
        </div>

        {/* Travel Recommendation Tip */}
        <div style={{ background: 'rgba(59,167,143,0.1)', padding: '0.8rem', borderRadius: '12px', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem' }}>
            {[51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(c.weather_code) ? '☂️' : c.temperature_2m > 35 ? '🔥' : '✨'}
          </span>
          <div style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 600, lineHeight: 1.4 }}>
            {[51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(c.weather_code) 
              ? "Rain expected. Great for indoor cafés and palaces!" 
              : c.temperature_2m > 35 
                ? "Quite hot! Stay hydrated and pick indoor spots early." 
                : "Perfect weather to go out and explore the monuments!"}
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, color: 'var(--text-muted)' }}>Upcoming</div>
          {weather.daily?.time?.slice(1, 4).map((dateStr, i) => {
            const dateObj = new Date(dateStr);
            const dayName = i === 0 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const maxTemp = Math.round(weather.daily.temperature_2m_max[i + 1]);
            const minTemp = Math.round(weather.daily.temperature_2m_min[i + 1]);
            const dCode = weather.daily.weather_code[i + 1];
            const DIcon = getWMOInfo(dCode).Icon;
            const dColor = getWMOInfo(dCode).color;

            return (
              <div key={dateStr} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#000000' }}>
                <div style={{ width: '4rem', fontWeight: 600 }}>{dayName}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <DIcon size={16} color={dColor === '#cbd5e1' || dColor === '#e2e8f0' ? '#64748b' : dColor} />
                </div>
                <div style={{ fontWeight: 600, display: 'flex', gap: '8px' }}>
                  <span>{maxTemp}°</span> <span style={{ color: 'var(--text-muted)' }}>{minTemp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cloud Button */}
      <div 
        className="cloud-button"
        style={{
          width: '60px',
          height: '60px',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          filter: isHovered 
            ? 'drop-shadow(0 0 12px rgba(59,167,143,0.8))' 
            : 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
          transition: 'all 0.3s ease',
        }}
      >
        <Icon 
          size={42} 
          color={color === '#facc15' ? '#f59e0b' : '#ffffff'} 
          strokeWidth={2} 
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
