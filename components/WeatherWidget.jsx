'use client';
import { useEffect, useState } from 'react';

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Heavy Storm', icon: '⛈️' },
};

// Jaipur coordinates
const LAT = 26.9124;
const LON = 75.7873;

function UVLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#00c850' };
  if (uv <= 5) return { label: 'Moderate', color: '#ffe600' };
  if (uv <= 7) return { label: 'High', color: '#ff8c00' };
  if (uv <= 10) return { label: 'Very High', color: '#ff4500' };
  return { label: 'Extreme', color: '#ff0055' };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,` +
      `weather_code,wind_speed_10m,uv_index,surface_pressure` +
      `&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum` +
      `&timezone=Asia%2FKolkata&forecast_days=4`
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

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⛅</div>
      <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Loading weather…</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</div>
  );

  const c = weather.current;
  const d = weather.daily;
  const wmo = WMO_CODES[c.weather_code] || { label: 'Unknown', icon: '🌡️' };
  const uv = UVLevel(c.uv_index);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif" }}>

      {/* ── CURRENT CONDITIONS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>

        {/* Hero card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(18,36,30,0.9) 0%, rgba(13,22,20,0.95) 100%)',
          border: '1px solid rgba(59,167,143,0.2)',
          borderRadius: '12px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            fontSize: '8rem', opacity: 0.08, lineHeight: 1,
            pointerEvents: 'none', userSelect: 'none',
          }}>{wmo.icon}</div>

          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>
              ✦ Jaipur, Rajasthan
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {Math.round(c.temperature_2m)}°C
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Feels like {Math.round(c.apparent_temperature)}°C
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.6rem' }}>{wmo.icon}</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--softwhite)' }}>{wmo.label}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {[
            { icon: '💧', label: 'Humidity', value: `${c.relative_humidity_2m}%`, sub: c.relative_humidity_2m > 60 ? 'Humid' : 'Comfortable' },
            { icon: '💨', label: 'Wind Speed', value: `${c.wind_speed_10m} km/h`, sub: c.wind_speed_10m < 20 ? 'Light Breeze' : 'Windy' },
            { icon: '🌧️', label: 'Precipitation', value: `${c.precipitation} mm`, sub: c.precipitation === 0 ? 'None' : 'Active' },
            { icon: '🌡️', label: 'Pressure', value: `${Math.round(c.surface_pressure)} hPa`, sub: 'Sea Level' },
          ].map(({ icon, label, value, sub }) => (
            <div key={label} style={{
              background: 'rgba(20,36,32,0.6)',
              border: '1px solid rgba(59,167,143,0.12)',
              borderRadius: '10px',
              padding: '1rem',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,167,143,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,167,143,0.12)'}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{icon}</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>{label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.1rem' }}>{value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UV INDEX BAR ── */}
      <div style={{
        background: 'rgba(20,36,32,0.6)',
        border: '1px solid rgba(59,167,143,0.12)',
        borderRadius: '10px',
        padding: '1.2rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>🌞 UV Index</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: uv.color }}>{c.uv_index}</span>
            <span style={{ fontSize: '0.85rem', color: uv.color, fontWeight: 600 }}>{uv.label}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Low</span><span>Moderate</span><span>High</span><span>V.High</span><span>Extreme</span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #00c850, #ffe600, #ff8c00, #ff4500, #ff0055)', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: `${Math.min((c.uv_index / 12) * 100, 100)}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '14px', height: '14px',
              borderRadius: '50%',
              background: uv.color,
              border: '2px solid #fff',
              boxShadow: `0 0 8px ${uv.color}`,
            }} />
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '180px' }}>
          {c.uv_index <= 2 ? '✅ No protection needed' :
           c.uv_index <= 5 ? '🧴 Sunscreen recommended' :
           c.uv_index <= 7 ? '🧴 SPF 30+ essential. Cover up!' :
           c.uv_index <= 10 ? '⚠️ Avoid sun 10am–4pm' :
           '🚨 Stay indoors if possible'}
        </div>
      </div>

      {/* ── 4-DAY FORECAST ── */}
      <div>
        <div style={{ fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
          ✦ 4-Day Forecast
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
          {d.time.map((dateStr, i) => {
            const date = new Date(dateStr);
            const dayName = i === 0 ? 'Today' : days[date.getDay()];
            const dayWmo = WMO_CODES[d.weather_code?.[i]] || { icon: '🌡️' };

            return (
              <div key={dateStr} style={{
                background: i === 0 ? 'rgba(59,167,143,0.12)' : 'rgba(20,36,32,0.5)',
                border: `1px solid ${i === 0 ? 'rgba(59,167,143,0.3)' : 'rgba(59,167,143,0.1)'}`,
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(59,167,143,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = i === 0 ? 'rgba(59,167,143,0.3)' : 'rgba(59,167,143,0.1)'; }}
              >
                <div style={{ fontSize: '0.7rem', color: i === 0 ? 'var(--gold)' : 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{dayName}</div>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{dayWmo.icon}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{Math.round(d.temperature_2m_max[i])}°</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round(d.temperature_2m_min[i])}°</div>
                {d.precipitation_sum[i] > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#78D59A', marginTop: '0.3rem' }}>💧 {d.precipitation_sum[i]}mm</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Travel tip banner */}
      <div style={{
        marginTop: '1.2rem',
        padding: '0.8rem 1.2rem',
        background: 'rgba(59,167,143,0.07)',
        border: '1px solid rgba(59,167,143,0.15)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
      }}>
        <span>🧳</span>
        <span>
          <strong style={{ color: 'var(--gold)' }}>Travel Tip: </strong>
          {c.temperature_2m > 38
            ? 'Jaipur is very hot — carry water, wear light cotton, and visit outdoor monuments before 10am.'
            : c.temperature_2m > 30
            ? 'Warm weather — ideal for fort visits in the early morning or evening. Sunscreen is essential.'
            : c.temperature_2m > 20
            ? 'Perfect sightseeing weather! Great time to explore the Pink City on foot.'
            : 'Cool and pleasant — ideal for long heritage walks. Light layers recommended.'}
        </span>
      </div>

      <style>{`
        @media(max-width:700px){
          .weather-grid { grid-template-columns: 1fr !important; }
          .forecast-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
