import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigatePage } from '../context/NavigationContext';
import QiblaCompass from '../components/layout/QiblaCompass';
import { useTheme } from '../hooks/useTheme';
import { lightTheme, darkTheme } from '../theme/colors';
import { HADITH_OF_DAY } from '../data/hadiths';
import axios from 'axios';
import { config } from '../config';
import { FaFire, FaStar, FaBookOpen, FaCalendarAlt, FaMoon, FaMosque, FaBell, FaMapMarkerAlt } from 'react-icons/fa';
import { GiPrayerBeads, GiGrain, GiSunflower } from 'react-icons/gi';
import { WiDaySunny, WiCloudy, WiHumidity, WiStrongWind } from 'react-icons/wi';

/**
 * Composant principal de la page d'accueil.
 * Affiche :
 * - Une bannière (hero) avec image de fond (mosquée)
 * - Des statistiques (prières, série, dhikr, score)
 * - Outils spirituels
 * - Horaires de prière (API AlAdhan)
 * - Météo (API OpenWeatherMap)
 * - Événements, hadith du jour, progression AsmaUlHusna
 */
export default function Accueil() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const navigate = useNavigatePage();

  // --- État pour les horaires de prière (API AlAdhan) ---
  const [prayerTimingsAPI, setPrayerTimingsAPI] = useState<Record<string, string> | null>(null);
  const [loadingPrayers, setLoadingPrayers] = useState<boolean>(true);
  const [errorPrayers, setErrorPrayers] = useState<string>('');

  // --- Countdown dynamique vers la prochaine prière ---
  const [liveCountdown, setLiveCountdown] = useState('00:00:00');
  const [nextPrayerName, setNextPrayerName] = useState('Asr');
  const [nextPrayerTime, setNextPrayerTime] = useState('--:--');
  const [currentPrayerName, setCurrentPrayerName] = useState('Dhuhr');

  useEffect(() => {
    if (!prayerTimingsAPI) return;
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const update = () => {
      const now = new Date();
      const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      let found = false;
      for (let i = 0; i < prayerOrder.length; i++) {
        const raw = prayerTimingsAPI[prayerOrder[i]] || '';
        const clean = raw.replace(/ \(.*\)/, '');
        const [h, m] = clean.split(':').map(Number);
        const pSecs = h * 3600 + m * 60;
        if (pSecs > nowSecs) {
          const diff = pSecs - nowSecs;
          const hh = Math.floor(diff / 3600);
          const mm = Math.floor((diff % 3600) / 60);
          const ss = diff % 60;
          setLiveCountdown(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`);
          setNextPrayerName(prayerOrder[i]);
          setNextPrayerTime(clean);
          setCurrentPrayerName(i > 0 ? prayerOrder[i - 1] : 'Isha');
          found = true;
          break;
        }
      }
      if (!found) {
        const raw = prayerTimingsAPI['Fajr'] || '';
        const clean = raw.replace(/ \(.*\)/, '');
        const [fh, fm] = clean.split(':').map(Number);
        const diff = (86400 - nowSecs) + fh * 3600 + fm * 60;
        const hh = Math.floor(diff / 3600);
        const mm = Math.floor((diff % 3600) / 60);
        const ss = diff % 60;
        setLiveCountdown(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`);
        setNextPrayerName('Fajr');
        setNextPrayerTime(clean);
        setCurrentPrayerName('Isha');
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [prayerTimingsAPI]);

  // --- Qibla dynamique via géolocalisation ---
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude, lon = pos.coords.longitude;
      const KAABA = { lat: 21.3891, lon: 39.8579 };
      const φ1 = lat * Math.PI / 180, φ2 = KAABA.lat * Math.PI / 180;
      const Δλ = (KAABA.lon - lon) * Math.PI / 180;
      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      setQiblaAngle(Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360));
    });
  }, []);

  // --- État pour la météo (API OpenWeatherMap) ---
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    condition: string;
    feelsLike: number;
    humidity: number;
    wind: number;
    city: string;
  } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [errorWeather, setErrorWeather] = useState<string>('');

  // --- Récupération des horaires de prière (position réelle, sinon Berrechid) ---
  useEffect(() => {
    const handle = (req: Promise<{ data: { data: { timings: Record<string, string> } } }>) =>
      req
        .then((r) => { setPrayerTimingsAPI(r.data.data.timings); setErrorPrayers(''); })
        .catch(() => setErrorPrayers('Impossible de charger les horaires'))
        .finally(() => setLoadingPrayers(false));

    const byCity = () =>
      axios.get('https://api.aladhan.com/v1/timingsByCity?city=Berrechid&country=MA&method=4');

    setLoadingPrayers(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => handle(axios.get(
          `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=4`
        )),
        () => handle(byCity())
      );
    } else {
      handle(byCity());
    }
  }, []);

  // --- Récupération de la météo réelle (géolocalisation ou ville par défaut) ---
  useEffect(() => {
    const fetchWeather = async () => {
      if (!config.OPENWEATHER_API_KEY || config.OPENWEATHER_API_KEY === 'ta_clé_ici') {
        setErrorWeather('Clé API météo manquante');
        setLoadingWeather(false);
        return;
      }
      const apply = (d: {
        main: { temp: number; feels_like: number; humidity: number };
        weather: { description: string }[];
        wind: { speed: number };
        name: string;
        sys?: { country?: string };
      }) => {
        setWeatherData({
          temp: Math.round(d.main.temp),
          condition: d.weather[0].description,
          feelsLike: Math.round(d.main.feels_like),
          humidity: d.main.humidity,
          wind: Math.round(d.wind.speed * 3.6),
          city: `${d.name}${d.sys?.country ? ', ' + d.sys.country : ''}`,
        });
        setErrorWeather('');
      };

      const base = 'https://api.openweathermap.org/data/2.5/weather';
      const byCity = () => axios.get(`${base}?q=Berrechid,MA&units=metric&lang=${i18n.language}&appid=${config.OPENWEATHER_API_KEY}`);

      const run = (req: Promise<{ data: Parameters<typeof apply>[0] }>) =>
        req.then((res) => apply(res.data)).catch(() => setErrorWeather('Erreur chargement météo')).finally(() => setLoadingWeather(false));

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => run(axios.get(
            `${base}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&lang=${i18n.language}&appid=${config.OPENWEATHER_API_KEY}`
          )),
          () => run(byCity())
        );
      } else {
        run(byCity());
      }
    };
    fetchWeather();
  }, []);

  // --- Style commun des cartes (arrondi, ombre, transition) ---
  const cardStyle = (extra?: React.CSSProperties) => ({
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: '20px',
    boxShadow:
      theme === 'light'
        ? '0 8px 20px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.02)'
        : '0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ...extra,
  });

  // --- Données des cartes statistiques (icônes, libellés, valeurs) ---
  const statCards = [
    {
      icon: <GiPrayerBeads style={{ fontSize: '20px', color: C.green }} />,
      iconBg: 'rgba(45,106,79,0.10)',
      label: t('stats.prayers_today'),
      value: '5 / 3',
      progress: 60,
      sub: t('stats.completed'),
    },
    {
      icon: <FaFire style={{ fontSize: '20px', color: C.gold }} />,
      iconBg: 'rgba(255,140,0,0.10)',
      label: t('stats.current_streak'),
      value: '7',
      progress: 70,
      sub: t('stats.days'),
    },
    {
      icon: <GiSunflower style={{ fontSize: '20px', color: C.gold }} />,
      iconBg: 'rgba(45,106,79,0.10)',
      label: t('stats.dhikr_today'),
      value: '120',
      progress: undefined,
      sub: t('stats.repetitions'),
    },
    {
      icon: <FaStar style={{ fontSize: '20px', color: C.gold }} />,
      iconBg: 'rgba(232,204,100,0.12)',
      label: t('stats.spiritual_score'),
      value: '85%',
      progress: undefined,
      sub: t('stats.excellent'),
    },
  ];

  // --- Outils spirituels (SalatTracker, Alhamdulillah, ...) ---
  const spiritualTools = [
    {
      id: 'salat',
      icon: <GiPrayerBeads style={{ fontSize: '24px', color: C.green }} />,
      title: t('tools.salat_title'),
      subtitle: t('tools.salat_desc'),
    },
    {
      id: 'alhamdulillah',
      icon: <GiGrain style={{ fontSize: '24px', color: C.green }} />,
      title: t('tools.alhamd_title'),
      subtitle: t('tools.alhamd_desc'),
    },
    {
      id: 'hadith',
      icon: <FaBookOpen style={{ fontSize: '24px', color: C.green }} />,
      title: t('tools.hadith_title'),
      subtitle: t('tools.hadith_desc'),
    },
    {
      id: 'asma',
      icon: <FaMosque style={{ fontSize: '24px', color: C.green }} />,
      title: t('tools.asma_title'),
      subtitle: t('tools.asma_desc'),
    },
  ];

  // --- Événements à venir (données statiques, mais traduites) ---
  const events = [
    {
      id: 1,
      icon: <FaCalendarAlt style={{ fontSize: '24px', color: C.gold }} />,
      title: t('event_dua_title'),
      date: t('event_dua_date'),
      location: t('event_dua_location'),
    },
    {
      id: 2,
      icon: <FaMoon style={{ fontSize: '24px', color: C.gold }} />,
      title: t('event_ramadan_title'),
      date: t('event_ramadan_date'),
      location: t('event_ramadan_location'),
    },
    {
      id: 3,
      icon: <FaMosque style={{ fontSize: '24px', color: C.gold }} />,
      title: t('event_conf_title'),
      date: t('event_conf_date'),
      location: t('event_conf_location'),
    },
  ];

  // --- Liste des prières pour la section horaires dynamique ---
  const prayersList = [
    { name: 'Fajr', label: t('salat.fajr') },
    { name: 'Dhuhr', label: t('salat.dhuhr') },
    { name: 'Asr', label: t('salat.asr') },
    { name: 'Maghrib', label: t('salat.maghrib') },
    { name: 'Isha', label: t('salat.isha') },
  ];

  // --- Choix de l'icône météo selon la température ---
  const getWeatherIcon = (temp: number) => {
    if (temp > 30) return <WiDaySunny style={{ fontSize: '50px', color: C.gold }} />;
    if (temp > 20) return <WiDaySunny style={{ fontSize: '50px', color: C.gold }} />;
    if (temp > 15) return <WiCloudy style={{ fontSize: '50px', color: C.textLight }} />;
    return <WiCloudy style={{ fontSize: '50px', color: C.textLight }} />;
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", color: C.textDark }}>
      {/* 
        SECTION HERO (bannière) 
        - Colonne de gauche : image de fond (mosquée) + texte d'accueil + boutons
        - Colonne du milieu : prochaine prière
        - Colonne de droite : boussole Qibla
      */}
      <div
        style={{
          ...cardStyle(),
          marginBottom: '18px',
          display: 'grid',
          gridTemplateColumns: '1fr 210px 190px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Ligne dorée supérieure (cohérence avec PageBanner) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 3, background: 'linear-gradient(90deg, transparent, #C8A84B 20%, #E0C870 50%, #C8A84B 80%, transparent)' }} />

        <div
          style={{
            backgroundImage:
              `linear-gradient(105deg, rgba(10,24,16,0.92) 0%, rgba(20,45,32,0.80) 38%, rgba(27,56,40,0.45) 70%, rgba(27,56,40,0.20) 100%), url('${import.meta.env.BASE_URL}photomosquee.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            padding: '32px 30px',
            minHeight: '205px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            transform: 'scaleX(-1)',
            overflow: 'hidden',
          }}
        >
          {/* Contenu remis à l'endroit — l'image de fond est inversée en miroir (mosquée à gauche) */}
          <div style={{ transform: 'scaleX(-1)', display: 'flex', flexDirection: 'column', width: '100%' }}>
          <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,204,100,0.92)' }}>{t('welcome')}</p>
          <h1 style={{ margin: '0 0 10px', fontSize: '30px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.18, letterSpacing: '-0.01em', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
            {t('hero_title')}
          </h1>
          <p
            style={{
              margin: '0 0 22px',
              fontSize: '12.5px',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.7,
              maxWidth: '320px',
            }}
          >
            {t('hero_desc')}
          </p>
          <div style={{ display: 'flex', gap: '11px' }}>
            <button
              onClick={() => navigate('salat')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #C8A84B 0%, #E0C870 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#1a1a0a',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(200,168,75,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(200,168,75,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(200,168,75,0.35)'; }}
            >
              {t('btn_start')}
            </button>
            <button
              onClick={() => navigate('horaires')}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              {t('btn_explore')}
            </button>
          </div>
          </div>
        </div>

        <div
          style={{
            padding: '22px 18px',
            borderLeft: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '10.5px',
              color: C.textMid,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {t('next_prayer')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: C.textDark }}>
              {t(`salat.${nextPrayerName.toLowerCase()}`) || nextPrayerName}
            </p>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(45,106,79,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <WiDaySunny style={{ fontSize: '24px', color: C.gold }} />
            </div>
          </div>
          <p
            style={{
              margin: '0 0 2px',
              fontSize: '28px',
              fontWeight: 800,
              color: C.textDark,
              fontFamily: "'Courier New',monospace",
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            {liveCountdown}
          </p>
          <p style={{ margin: '0 0 14px', fontSize: '10.5px', color: C.textLight }}>{t('remaining')}</p>
          <div style={{ background: C.cardBg2, borderRadius: '8px', padding: '10px 12px', marginBottom: 'auto' }}>
            <p style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: C.textDark }}>{nextPrayerTime}</p>
            <p style={{ margin: 0, fontSize: '10.5px', color: C.textMid }}>{t('today')}</p>
          </div>
        </div>

        <div
          onClick={() => navigate('qibla')}
          style={{
            padding: '22px 18px',
            borderLeft: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          <p
            style={{
              margin: '0 0 10px',
              fontSize: '10.5px',
              color: C.textMid,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {t('qibla_compass')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <QiblaCompass />
          </div>
          <p style={{ margin: '0 0 1px', fontSize: '11px', color: C.textMid }}>{t('direction')}</p>
          <p style={{ margin: '0 0 1px', fontSize: '22px', fontWeight: 700, color: C.textDark, lineHeight: 1 }}>
            {qiblaAngle !== null ? `${qiblaAngle}°` : '...'}
          </p>
          <p style={{ margin: '0 0 6px', fontSize: '11px', color: C.textMid }}>{t('qibla.south_west')}</p>
          <p style={{ margin: 0, fontSize: '11px', color: C.green }}>
            <FaMapMarkerAlt style={{ fontSize: '10px', marginRight: '4px' }} /> {t('my_position')}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '18px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...cardStyle({ padding: '15px 16px' }) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '9px',
                  background: s.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                }}
              >
                {s.icon}
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: C.textMid }}>{s.label}</p>
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '23px', fontWeight: 700, color: C.textDark }}>{s.value}</p>
            {s.progress !== undefined && (
              <div style={{ height: '3px', background: C.border, borderRadius: '2px', margin: '4px 0' }}>
                <div
                  style={{
                    width: `${s.progress}%`,
                    height: '100%',
                    background: i === 1 ? C.gold : C.green,
                    borderRadius: '2px',
                  }}
                />
              </div>
            )}
            <p style={{ margin: 0, fontSize: '11px', color: C.textMid }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px', alignItems: 'stretch' }}>
        <div style={cardStyle({ padding: '18px', display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '14.5px', fontWeight: 600, color: C.textDark }}>{t('spiritual_tools')}</h2>
            <button onClick={() => navigate('salat')} style={{ background: 'none', border: 'none', color: C.green, fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
              {t('see_all')} ›
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: '10px', flex: 1 }}>
            {spiritualTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => navigate(tool.id)}
                style={{
                  background: C.cardBg2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '13px 13px 10px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 16px rgba(0,0,0,0.1)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '9px',
                    background: 'rgba(45,106,79,0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '9px',
                  }}
                >
                  {tool.icon}
                </div>
                <p style={{ margin: '0 0 2px', fontSize: '12.5px', fontWeight: 600, color: C.textDark }}>{tool.title}</p>
                <p style={{ margin: '0 0 7px', fontSize: '11px', color: C.textMid, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {tool.subtitle}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: C.green, fontWeight: 500 }}>{t('open')} ↗</p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle({ padding: '18px', display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
            <h2 style={{ margin: 0, fontSize: '14.5px', fontWeight: 600, color: C.textDark }}>{t('prayer_times')}</h2>
            <button onClick={() => navigate('horaires')} style={{ background: 'none', border: 'none', color: C.green, fontSize: '11.5px', cursor: 'pointer', fontWeight: 500 }}>
              {t('today')} ›
            </button>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: '11px', color: C.textMid }}>
            <FaMapMarkerAlt style={{ fontSize: '10px', marginRight: '4px' }} /> {weatherData?.city || t('berrechid')}
          </p>

          {loadingPrayers ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: `2px solid ${C.border}`,
                  borderTop: `2px solid ${C.green}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : errorPrayers ? (
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(231,76,60,0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#e74c3c' }}>{errorPrayers}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '10px',
                  background: C.green,
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px' }}>
                {prayersList.map((prayer) => {
                  const prayerTime = (prayerTimingsAPI?.[prayer.name] || '').replace(/ \(.*\)/, '');
                  const isCurrent = prayer.name === nextPrayerName;
                  return (
                    <div
                      key={prayer.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 11px',
                        borderRadius: '8px',
                        background: isCurrent ? C.green : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: isCurrent ? 'white' : C.border,
                          border: isCurrent ? 'none' : `1.5px solid ${C.textLight}`,
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: '12.5px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'white' : C.textDark }}>
                        {prayer.label}
                      </p>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 600, color: isCurrent ? 'white' : C.textMid }}>
                        {prayerTime || '--:--'}
                      </p>
                      {isCurrent && <FaBell style={{ fontSize: '12px', color: 'white' }} />}
                    </div>
                  );
                })}
              </div>
              <div style={{ background: C.cardBg2, borderRadius: '9px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div>
                  <p style={{ margin: '0 0 1px', fontSize: '10.5px', color: C.textMid }}>{t('next_prayer')}</p>
                  <p style={{ margin: '0 0 3px', fontSize: '17px', fontWeight: 700, color: C.textDark }}>
                    {t(`salat.${nextPrayerName.toLowerCase()}`) || nextPrayerName}
                  </p>
                  <p style={{ margin: '0 0 1px', fontSize: '19px', fontWeight: 800, color: C.textDark, fontFamily: "'Courier New',monospace" }}>
                    {liveCountdown}
                  </p>
                  <p style={{ margin: 0, fontSize: '10.5px', color: C.textMid }}>{t('remaining')}</p>
                </div>
                <FaMosque style={{ fontSize: '32px', opacity: 0.5, color: C.textLight }} />
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr 1fr', gap: '12px' }}>
        <div style={cardStyle({ padding: '16px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '11px' }}>
            <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: C.textDark }}>{t('upcoming_events')}</h3>
            <button onClick={() => navigate('evenements')} style={{ background: 'none', border: 'none', color: C.green, fontSize: '10.5px', cursor: 'pointer', fontWeight: 500 }}>
              {t('see_all')} ›
            </button>
          </div>
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate('evenements')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '9px',
                background: C.cardBg2,
                borderRadius: '8px',
                marginBottom: '7px',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: 'rgba(45,106,79,0.10)',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {event.icon}
              </div>
              <div>
                <p style={{ margin: '0 0 1px', fontSize: '11.5px', fontWeight: 600, color: C.textDark }}>{event.title}</p>
                <p style={{ margin: 0, fontSize: '10px', color: C.textMid }}>{event.date}</p>
                <p style={{ margin: 0, fontSize: '10px', color: C.textLight }}>{event.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div onClick={() => navigate('hadith')} style={{ ...cardStyle({ padding: '16px', display: 'flex', flexDirection: 'column' }), cursor: 'pointer', transition: 'transform 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = '')}>
          <h3 style={{ margin: '0 0 11px', fontSize: '13.5px', fontWeight: 600, color: C.textDark }}>{t('hadith_of_day')}</h3>
          <div style={{ background: C.cardBg2, borderRadius: '9px', padding: '13px', flex: 1 }}>
            <p style={{ margin: '0 0 8px', fontSize: '15px', textAlign: 'right', fontFamily: "'Amiri','Noto Naskh Arabic',serif", color: C.textDark }}>
              {HADITH_OF_DAY.arabic}
            </p>
            <p style={{ margin: '0 0 8px', fontSize: '11.5px', fontStyle: 'italic', color: C.textDark }}>
              « {HADITH_OF_DAY.french} »
            </p>
            <p style={{ margin: 'auto 0 8px', fontSize: '10.5px', color: C.textMid }}>
              <FaBookOpen style={{ fontSize: '10px', marginRight: '4px' }} /> {HADITH_OF_DAY.source}
            </p>
          </div>
        </div>

        <div onClick={() => navigate('meteo')} style={{ ...cardStyle({ padding: '16px' }), cursor: 'pointer', transition: 'transform 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = '')}>
          <h3 style={{ margin: '0 0 1px', fontSize: '13.5px', fontWeight: 600, color: C.textDark }}>{t('weather')}</h3>
          <p style={{ margin: '0 0 12px', fontSize: '10.5px', color: C.textMid }}>
            <FaMapMarkerAlt style={{ fontSize: '10px', marginRight: '4px' }} /> {weatherData?.city || t('berrechid')}
          </p>
          {loadingWeather ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: `2px solid ${C.border}`,
                  borderTop: `2px solid ${C.green}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : errorWeather ? (
            <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(231,76,60,0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '11px', color: '#e74c3c' }}>{errorWeather}</p>
            </div>
          ) : weatherData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {getWeatherIcon(weatherData.temp)}
                <div>
                  <p style={{ margin: 0, fontSize: '30px', fontWeight: 700, lineHeight: 1, color: C.textDark }}>
                    {weatherData.temp}°C
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '10.5px', color: C.textMid }}>{weatherData.condition}</p>
                </div>
              </div>
              {[
                [t('feels_like'), `${weatherData.feelsLike}°C`, <WiDaySunny key="fl" />],
                [t('humidity'), `${weatherData.humidity}%`, <WiHumidity key="hum" />],
                [t('wind'), `${weatherData.wind} km/h`, <WiStrongWind key="win" />],
              ].map(([label, value, icon], i, arr) => (
                <div
                  key={label as string}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 0',
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <span style={{ fontSize: '11px', color: C.textMid, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {icon} {label}
                  </span>
                  <span style={{ fontSize: '11px', color: C.textDark, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </>
          ) : null}
        </div>

        <div style={{ ...cardStyle({ padding: '16px' }) }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '13.5px', fontWeight: 600, color: C.textDark }}>{t('asma_progress')}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <svg viewBox="0 0 88 88" width="88" height="88">
              <circle cx="44" cy="44" r="37" fill="none" stroke={C.border} strokeWidth="7" />
              <circle
                cx="44"
                cy="44"
                r="37"
                fill="none"
                stroke={C.green}
                strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 37 * 0.72} ${2 * Math.PI * 37}`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
              />
              <text x="44" y="40" textAnchor="middle" fill={C.textDark} fontSize="14" fontWeight="700">
                72%
              </text>
              <text x="44" y="52" textAnchor="middle" fill={C.textMid} fontSize="8">
                71 / 99
              </text>
            </svg>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '11px', color: C.textMid, textAlign: 'center' }}>{t('names_learned')}</p>
          <div style={{ background: C.cardBg2, borderRadius: '8px', padding: '10px 12px', textAlign: 'center', marginBottom: '10px' }}>
            <p style={{ margin: '0 0 2px', fontSize: '19px', fontFamily: "'Amiri','Noto Naskh Arabic',serif", lineHeight: 1.5, color: C.textDark }}>
              الرَّحْمَن
            </p>
            <p style={{ margin: '0 0 1px', fontSize: '12px', fontWeight: 600, color: C.textDark }}>Ar-Rahman</p>
            <p style={{ margin: 0, fontSize: '10.5px', color: C.textMid }}>{t('the_most_merciful')}</p>
          </div>
          <button
            onClick={() => navigate('asma')}
            style={{
              width: '100%',
              padding: '9px',
              background: C.green,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {t('see_full_list')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}