import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { lightTheme, darkTheme } from '../theme/colors';
import axios from 'axios';
import { config } from '../config';

function IslamicPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip-meteo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,2 38,18 56,18 42,30 48,48 30,38 12,48 18,30 4,18 22,18" fill="none" stroke="#C8A84B" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip-meteo)" />
    </svg>
  );
}

function SvgSun({ size = 80 }: { size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.22;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * Math.PI / 180;
    const r1 = r + size * 0.10, r2 = r + size * 0.20;
    return <line key={i} x1={cx + r1 * Math.cos(angle)} y1={cy + r1 * Math.sin(angle)} x2={cx + r2 * Math.cos(angle)} y2={cy + r2 * Math.sin(angle)} stroke="#E5C56A" strokeWidth={size * 0.045} strokeLinecap="round" />;
  });
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{rays}<circle cx={cx} cy={cy} r={r} fill="#E5C56A" /><circle cx={cx} cy={cy} r={r * 0.7} fill="#F5D87E" opacity={0.6} /></svg>;
}

function SvgCloud({ size = 80, color = '#b0b8c1' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 80 80"><path d="M18 52 Q14 52 14 46 Q14 38 24 37 Q24 26 37 26 Q48 26 52 35 Q62 34 62 43 Q62 52 54 52 Z" fill={color} /><path d="M18 52 Q14 52 14 46 Q14 38 24 37 Q24 26 37 26 Q48 26 52 35 Q62 34 62 43 Q62 52 54 52 Z" fill="white" opacity={0.15} /></svg>;
}

function SvgRain({ size = 80 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 80 80"><path d="M18 44 Q14 44 14 38 Q14 29 24 28 Q24 18 37 18 Q48 18 52 27 Q62 26 62 35 Q62 44 54 44 Z" fill="#7a9ab8" />{[[26,50],[34,56],[42,50],[50,56],[38,62]].map(([x,y]) => <line key={`${x}-${y}`} x1={x} y1={y} x2={x-2} y2={y+8} stroke="#5a8ab8" strokeWidth={2} strokeLinecap="round" />)}</svg>;
}

function SvgSnow({ size = 80 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 80 80"><path d="M18 44 Q14 44 14 38 Q14 29 24 28 Q24 18 37 18 Q48 18 52 27 Q62 26 62 35 Q62 44 54 44 Z" fill="#d0eaf5" />{[[26,52],[40,58],[54,52]].map(([x,y]) => <g key={`${x}-${y}`}><line x1={x} y1={y-6} x2={x} y2={y+6} stroke="#8bc0e0" strokeWidth={2} strokeLinecap="round" /><line x1={x-6} y1={y} x2={x+6} y2={y} stroke="#8bc0e0" strokeWidth={2} strokeLinecap="round" /></g>)}</svg>;
}

function WeatherIcon({ condition, size = 80 }: { condition: string; size?: number }) {
  const c = condition.toLowerCase();
  if (c.includes('pluie') || c.includes('rain') || c.includes('drizzle') || c.includes('bruine')) return <SvgRain size={size} />;
  if (c.includes('neige') || c.includes('snow')) return <SvgSnow size={size} />;
  if (c.includes('nuage') || c.includes('cloud') || c.includes('couvert') || c.includes('overcast') || c.includes('brouillard') || c.includes('fog')) return <SvgCloud size={size} />;
  return <SvgSun size={size} />;
}

function SvgThermometer({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>;
}
function SvgDrop({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
}
function SvgWind({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>;
}
function SvgGauge({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></svg>;
}
function SvgWarning({ color, size = 40 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function SvgPin({ color, size = 16 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}

export default function Meteo() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isAr = language === 'ar';
  const d = (fr: string, en: string, ar: string) => language === 'en' ? en : isAr ? ar : fr;

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 20,
    boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.32)',
    ...extra,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      if (!config.OPENWEATHER_API_KEY || config.OPENWEATHER_API_KEY === 'ta_clé_ici') {
        setError(t('meteo.missing_key', d('Clé API manquante', 'Missing API key', 'مفتاح API مفقود')));
        setLoading(false); return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${config.OPENWEATHER_API_KEY}`;
            const response = await axios.get(url);
            setWeather(response.data); setError('');
          } catch (err) { console.error(err); setError(t('meteo.error', d('Erreur chargement météo', 'Weather loading error', 'خطأ في تحميل الطقس'))); }
          finally { setLoading(false); }
        },
        () => {
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Berrechid,MA&units=metric&lang=fr&appid=${config.OPENWEATHER_API_KEY}`)
            .then((res) => { setWeather(res.data); setError(''); })
            .catch(() => setError(t('meteo.geo_denied', d('Géolocalisation refusée', 'Geolocation denied', 'تم رفض تحديد الموقع'))))
            .finally(() => setLoading(false));
        }
      );
    };
    fetchWeather();
  }, [t]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: C.pageBg, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `4px solid ${C.border}`, borderTopColor: C.green, animation: 'spin 0.9s linear infinite' }} />
        <p style={{ margin: 0, fontSize: 15, color: C.textMid }}>{t('meteo.loading', d('Chargement de la météo...', 'Loading weather...', 'جاري تحميل الطقس...'))}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const Hero = () => (
    <div style={{
      backgroundImage: `linear-gradient(160deg, rgba(12,34,24,0.96) 0%, rgba(26,61,40,0.90) 55%, rgba(14,45,30,0.96) 100%), url('/photomosquee.png')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      padding: '64px 24px 56px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #C8A84B, #E0C870, #C8A84B, transparent)' }} />
      <IslamicPattern />
      {isAr && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Scheherazade New', serif", fontSize: 'clamp(18px,4vw,48px)',
          color: '#ffffff', opacity: 0.04, pointerEvents: 'none', userSelect: 'none',
          textAlign: 'center', padding: '0 24px',
        }}>
          هُوَ الَّذِي يُرِيكُمُ الْبَرْقَ خَوْفًا وَطَمَعًا
        </div>
      )}
      <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: isAr ? 'right' : 'center' }}>
        <h1 style={{ fontFamily: isAr ? "'Scheherazade New', serif" : "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: '#F5F0E2', margin: '0 0 10px' }}>
          {t('meteo.title', d('Météo', 'Weather', 'الطقس'))}
        </h1>
        <p style={{ color: 'rgba(168,196,176,0.9)', fontSize: 15, margin: 0 }}>
          {d('Conditions météorologiques en temps réel', 'Real-time weather conditions', 'الأحوال الجوية في الوقت الفعلي')}
        </p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: C.pageBg, direction: isAr ? 'rtl' : 'ltr' }}>
        <Hero />
        <div style={{ maxWidth: 820, margin: '40px auto', padding: '0 20px' }}>
          <div style={{ ...card(), padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <SvgWarning color="#c0392b" size={44} />
            <p style={{ color: C.textDark, fontSize: 16, margin: 0 }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const temp      = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity  = weather.main.humidity;
  const wind      = Math.round(weather.wind.speed * 3.6);
  const pressure  = weather.main.pressure;
  const condition = weather.weather[0].description;
  const city      = weather.name;
  const country   = weather.sys.country;

  const pills = [
    { label: d('Ressenti', 'Feels like', 'الإحساس'), value: `${feelsLike}°`, icon: <SvgThermometer color={C.green} size={18} /> },
    { label: d('Humidité', 'Humidity', 'الرطوبة'),   value: `${humidity}%`, icon: <SvgDrop color={C.green} size={18} /> },
    { label: d('Vent', 'Wind', 'الريح'),             value: `${wind} km/h`, icon: <SvgWind color={C.green} size={18} /> },
    ...(pressure ? [{ label: d('Pression', 'Pressure', 'الضغط'), value: `${pressure} hPa`, icon: <SvgGauge color={C.green} size={18} /> }] : []),
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: C.pageBg, direction: isAr ? 'rtl' : 'ltr' }}>
      <Hero />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* ── MAIN CARD ────────────────────────────────────────────────────── */}
        <div style={{ ...card(), padding: '40px 36px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            <SvgPin color={C.green} size={16} />
            <span style={{ fontSize: 20, fontWeight: 600, color: C.textDark, fontFamily: "'Playfair Display', serif" }}>{city}, {country}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
            <WeatherIcon condition={condition} size={88} />
            <div style={{ fontSize: 68, fontWeight: 800, color: C.textDark, lineHeight: 1, fontFamily: "'Playfair Display', serif", letterSpacing: '-3px' }}>{temp}°</div>
          </div>
          <p style={{ fontSize: 18, color: C.textMid, textAlign: 'center', margin: '0 0 32px', textTransform: 'capitalize', letterSpacing: 0.5 }}>{condition}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pills.length}, 1fr)`, gap: 12 }}>
            {pills.map((pill) => (
              <div key={pill.label} style={{ background: C.cardBg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.green }}>{pill.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.textDark }}>{pill.value}</span>
                <span style={{ fontSize: isAr ? 14 : 10, color: C.textLight, textTransform: isAr ? 'none' : 'uppercase', letterSpacing: isAr ? 0 : 0.8, fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif' }}>
                  {pill.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRAYER CARD ──────────────────────────────────────────────────── */}
        <div style={{ ...card(), padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, color: C.gold, fontWeight: 600, margin: '0 0 6px' }}>
              {d('Prochaine prière', 'Next prayer', 'الصلاة القادمة')}
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.textDark, margin: '0 0 4px' }}>
              {d('Asr', 'Asr', 'العصر')}
            </p>
            <p style={{ fontSize: 14, color: C.textMid, margin: 0 }}>
              {d('Consultez la page Horaires pour les détails', 'Check the Prayer Times page for details', 'راجع صفحة مواقيت الصلاة للتفاصيل')}
            </p>
          </div>
        </div>

        {/* ── COUNSEL CARD ─────────────────────────────────────────────────── */}
        <div style={{ ...card(), padding: '24px 28px', borderLeft: isAr ? 'none' : `4px solid #C8A84B`, borderRight: isAr ? `4px solid #C8A84B` : 'none' }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, color: C.gold, fontWeight: 600, margin: '0 0 12px' }}>
            {d('Conseil islamique', 'Islamic counsel', 'نصيحة إسلامية')}
          </p>
          {isAr && (
            <p style={{ fontFamily: "'Scheherazade New', serif", fontSize: 20, color: C.textDark, direction: 'rtl', margin: '0 0 10px', lineHeight: 1.7 }}>
              هُوَ الَّذِي يُرِيكُمُ الْبَرْقَ خَوْفًا وَطَمَعًا
            </p>
          )}
          <p style={{ fontSize: isAr ? 14 : 13, color: C.textLight, margin: '0 0 12px', fontStyle: 'italic', fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif' }}>
            {d('« C\'est Lui qui vous montre l\'éclair, source de crainte et d\'espoir. » — Coran 13:12',
               '"It is He who shows you lightning, a source of fear and hope." — Quran 13:12',
               '« هو الذي يريكم البرق خوفاً وطمعاً » — القرآن 13:12')}
          </p>
          <p style={{ fontSize: 14, color: C.textMid, margin: 0, lineHeight: 1.7, fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif' }}>
            {d(
              'La météo nous rappelle la grandeur d\'Allah. Préparez-vous pour chaque prière, quelles que soient les conditions climatiques.',
              'The weather reminds us of the greatness of Allah. Prepare for every prayer, whatever the weather conditions.',
              'الطقس يذكرنا بعظمة الله. استعد لكل صلاة مهما كانت الأحوال الجوية.'
            )}
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
