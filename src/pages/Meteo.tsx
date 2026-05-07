import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next'; 
import { lightTheme, darkTheme } from '../theme/colors';
export default function Meteo() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const { t } = useTranslation(); 
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule des données (remplacer par appel API réel)
    setTimeout(() => {
      setWeather({
        city: 'Berrechid',
        country: 'Maroc',
        temp: 24,
        feelsLike: 26,
        humidity: 48,
        wind: 12,
        condition: 'Partiellement nuageux',
        icon: '🌤️',
        forecast: [
          { day: 'Sam', temp: 24, icon: '🌤️' },
          { day: 'Dim', temp: 25, icon: '☀️' },
          { day: 'Lun', temp: 23, icon: '☁️' },
          { day: 'Mar', temp: 21, icon: '🌧️' },
          { day: 'Mer', temp: 22, icon: '⛅' },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>Météo</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{weather.city}, {weather.country}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 ,color: '#bcbcbc'  }}>
          <div style={{ fontSize: 60 }}>{weather.icon}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700 ,color: '#757575'}}>{weather.temp}°C</div>
            <div>{weather.condition}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 , color: '#757575'  }}>
          <div><strong>Ressenti</strong><br />{weather.feelsLike}°C</div>
          <div><strong>Humidité</strong><br />{weather.humidity}%</div>
          <div><strong>Vent</strong><br />{weather.wind} km/h</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 16 , color: '#757575' }}>
          {weather.forecast.map(f => (
            <div key={f.day} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600 }}>{f.day}</div>
              <div style={{ fontSize: 24 }}>{f.icon}</div>
              <div>{f.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}