import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';               // <-- MODIF : ajout
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

export default function Meteo() {
  const { t } = useTranslation();                             // <-- MODIF : déstructuration
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
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
          { day: t('meteo.day_sat'), temp: 24, icon: '🌤️' },      // <-- MODIF (traduction des jours)
          { day: t('meteo.day_sun'), temp: 25, icon: '☀️' },
          { day: t('meteo.day_mon'), temp: 23, icon: '☁️' },
          { day: t('meteo.day_tue'), temp: 21, icon: '🌧️' },
          { day: t('meteo.day_wed'), temp: 22, icon: '⛅' },
        ]
      });
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: C.textMid }}>{t('meteo.loading')}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('meteo.title')}</h2>                 {/* <-- MODIF */}
        <p style={{ marginBottom: 20, color: C.textMid }}>{weather.city}, {weather.country}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 60 }}>{weather.icon}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: C.textDark }}>{weather.temp}°C</div>
            <div style={{ color: C.textMid }}>{weather.condition}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div><strong>{t('meteo.feels_like')}</strong><br />{weather.feelsLike}°C</div>      {/* <-- MODIF */}
          <div><strong>{t('meteo.humidity')}</strong><br />{weather.humidity}%</div>           {/* <-- MODIF */}
          <div><strong>{t('meteo.wind')}</strong><br />{weather.wind} km/h</div>               {/* <-- MODIF */}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
          {weather.forecast.map((f: any) => (
            <div key={f.day} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: C.textDark }}>{f.day}</div>
              <div style={{ fontSize: 24 }}>{f.icon}</div>
              <div style={{ color: C.textMid }}>{f.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}