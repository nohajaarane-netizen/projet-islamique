import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { FaMapMarkerAlt, FaExclamationTriangle, FaCalendarAlt, FaSyncAlt } from 'react-icons/fa';
import { BsSunrise, BsSun, BsCloudSun, BsSunset, BsMoonStars } from 'react-icons/bs';
import { GiSamaraMosque } from 'react-icons/gi';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrayerTimings {
  Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
  [key: string]: string;
}
interface DaySchedule {
  date: string;
  gregorian: { date: string; weekday: { en: string } };
  hijri: { date: string };
  timings: PrayerTimings;
}
interface GeoState {
  lat: number; lng: number;
  city: string; country: string;
  status: 'idle' | 'loading' | 'ok' | 'denied' | 'error';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerKey = typeof PRAYERS[number];

const PRAYER_ARABIC: Record<PrayerKey, string> = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};
const PRAYER_ICON: Record<PrayerKey, React.ReactElement> = {
  Fajr:    <BsSunrise />,
  Dhuhr:   <BsSun />,
  Asr:     <BsCloudSun />,
  Maghrib: <BsSunset />,
  Isha:    <BsMoonStars />,
};
const WEEKDAY_I18N_KEY: Record<string, string> = {
  Monday: 'days.monday', Tuesday: 'days.tuesday', Wednesday: 'days.wednesday',
  Thursday: 'days.thursday', Friday: 'days.friday', Saturday: 'days.saturday',
  Sunday: 'days.sunday',
};
const HIJRI_MONTHS_AR: Record<string, string> = {
  '01':'مُحَرَّم','02':'صَفَر','03':'رَبِيعُ الْأَوَّل','04':'رَبِيعُ الثَّانِي',
  '05':'جُمَادَى الأُولَى','06':'جُمَادَى الآخِرَة','07':'رَجَب','08':'شَعْبَان',
  '09':'رَمَضَان','10':'شَوَّال','11':'ذُو الْقَعْدَة','12':'ذُو الْحِجَّة',
};
const HIJRI_MONTHS: Record<string, string> = {
  '01':'Muharram','02':'Safar','03':"Rabi' al-Awwal",'04':"Rabi' al-Thani",
  '05':'Jumada al-Awwal','06':'Jumada al-Thani','07':'Rajab','08':"Sha'ban",
  '09':'Ramadan','10':'Shawwal','11':"Dhu al-Qi'dah",'12':'Dhu al-Hijjah',
};

const gold = '#C8A84B';
const goldLight = '#E0C870';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToMins(t: string) {
  const [h, m] = (t || '00:00').split(':').map(Number);
  return h * 60 + m;
}
function padZ(n: number) { return String(n).padStart(2, '0'); }

function getNextPrayer(timings: PrayerTimings, nowMins: number): { key: PrayerKey; minsLeft: number } {
  for (const p of PRAYERS) {
    const t = timeToMins(timings[p]);
    if (nowMins < t) return { key: p, minsLeft: t - nowMins };
  }
  // After Isha → next Fajr tomorrow
  const fajrMins = timeToMins(timings.Fajr);
  return { key: 'Fajr', minsLeft: 1440 - nowMins + fajrMins };
}

function getCurrentPrayer(timings: PrayerTimings, nowMins: number): PrayerKey {
  let current: PrayerKey = 'Isha';
  for (const p of PRAYERS) {
    if (nowMins >= timeToMins(timings[p])) current = p;
  }
  return current;
}

function parseHijri(raw: string) {
  const [y, m, d] = raw.split('-');
  return { day: d || '', month: m || '', year: y || '' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06, color: _c }: { opacity?: number; color?: string }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="ip-hor" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={gold} strokeWidth="0.55" opacity={opacity} />
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={gold} strokeWidth="0.55" opacity={opacity} transform="rotate(45 32 32)" />
        <circle cx="32" cy="32" r="9" fill="none" stroke={gold} strokeWidth="0.45" opacity={opacity * 0.7} />
        <circle cx="32" cy="32" r="2" fill={gold} opacity={opacity * 0.5} />
        <line x1="32" y1="0" x2="32" y2="64" stroke={gold} strokeWidth="0.25" opacity={opacity * 0.35} />
        <line x1="0" y1="32" x2="64" y2="32" stroke={gold} strokeWidth="0.25" opacity={opacity * 0.35} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-hor)" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Horaires: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [geo, setGeo] = useState<GeoState>({ lat: 0, lng: 0, city: '', country: '', status: 'idle' });
  const [todayTimings, setTodayTimings] = useState<PrayerTimings | null>(null);
  const [hijriRaw, setHijriRaw] = useState('');
  const [gregorianRaw, setGregorianRaw] = useState('');
  const [weekday, setWeekday] = useState('');
  const [monthData, setMonthData] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [viewYear, setViewYear]   = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1);
  const [viewMonthData, setViewMonthData] = useState<DaySchedule[]>([]);
  const [loadingMonthView, setLoadingMonthView] = useState(false);
  const [now, setNow] = useState(new Date());
  const [hoveredPrayer, setHoveredPrayer] = useState<PrayerKey | null>(null);

  // Tick every second for countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const currentPrayer = useMemo(
    () => (todayTimings ? getCurrentPrayer(todayTimings, nowMins) : null),
    [todayTimings, nowMins]
  );
  const nextInfo = useMemo(
    () => (todayTimings ? getNextPrayer(todayTimings, nowMins) : null),
    [todayTimings, nowMins]
  );

  const secsLeft = nextInfo ? Math.round(nextInfo.minsLeft * 60 - now.getSeconds()) : 0;

  // ── Geolocation ─────────────────────────────────────────────────────────────

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo(g => ({ ...g, status: 'error', city: 'Berrechid', country: 'MA' }));
      return;
    }
    setGeo(g => ({ ...g, status: 'loading' }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let city = 'Ma ville', country = '';
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'fr' } }
          );
          const addr = res.data.address || {};
          city    = addr.city || addr.town || addr.village || addr.county || 'Ma ville';
          country = addr.country_code?.toUpperCase() || '';
        } catch { /* silently use default */ }
        setGeo({ lat, lng, city, country, status: 'ok' });
      },
      () => {
        // Permission denied — fallback to Berrechid
        setGeo({ lat: 33.2616, lng: -7.5869, city: 'Berrechid', country: 'MA', status: 'denied' });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  // Auto-request on mount — deferred to avoid sync-setState lint rule
  useEffect(() => {
    const id = setTimeout(requestLocation, 0);
    return () => clearTimeout(id);
  }, [requestLocation]);

  // Fetch data for a different month
  useEffect(() => {
    const d = new Date();
    if (viewYear === d.getFullYear() && viewMonth === d.getMonth() + 1) return;
    if (geo.status !== 'ok' && geo.status !== 'denied') return;
    let ignore = false;
    (async () => {
      try {
        setLoadingMonthView(true);
        const params = `latitude=${geo.lat}&longitude=${geo.lng}&method=4`;
        const res = await axios.get(`https://api.aladhan.com/v1/calendar/${viewYear}/${viewMonth}?${params}`);
        if (!ignore) setViewMonthData(res.data.data || []);
      } catch { /* silently ignore */ }
      finally { if (!ignore) setLoadingMonthView(false); }
    })();
    return () => { ignore = true; };
  }, [geo.lat, geo.lng, geo.status, viewYear, viewMonth]);

  // ── Fetch prayer times once we have coords ─────────────────────────────────

  useEffect(() => {
    if (geo.status !== 'ok' && geo.status !== 'denied') return;
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setError('');
        const today = new Date();
        const base = `https://api.aladhan.com/v1`;
        const params = `latitude=${geo.lat}&longitude=${geo.lng}&method=4`;
        const [todayRes, monthRes] = await Promise.all([
          axios.get(`${base}/timings/${Math.floor(Date.now() / 1000)}?${params}`),
          axios.get(`${base}/calendar/${today.getFullYear()}/${today.getMonth() + 1}?${params}`),
        ]);
        if (!ignore) {
          setTodayTimings(todayRes.data.data.timings);
          setHijriRaw(todayRes.data.data.date.hijri.date);
          setGregorianRaw(todayRes.data.data.date.gregorian.date);
          setWeekday(todayRes.data.data.date.gregorian.weekday.en);
          setMonthData(monthRes.data.data || []);
        }
      } catch {
        if (!ignore) setError(t('horaires.error'));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [geo.lat, geo.lng, geo.status]);

  // ── Styles ───────────────────────────────────────────────────────────────────

  const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: isDark ? 'rgba(12,18,32,0.90)' : 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(18px)',
    border: `1px solid ${isDark ? 'rgba(200,168,75,0.13)' : 'rgba(200,168,75,0.18)'}`,
    borderRadius: 22,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 6px 28px rgba(27,48,34,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
    ...extra,
  });

  // ── Loading screen ────────────────────────────────────────────────────────

  if (geo.status === 'idle' || geo.status === 'loading' || (loading && !todayTimings)) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 18 }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{ width: 56, height: 56, border: `2px solid rgba(200,168,75,0.15)`, borderTop: `2.5px solid ${gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: gold }}>
          {geo.status === 'loading' ? <FaMapMarkerAlt /> : <GiSamaraMosque />}
        </span>
      </div>
      <p style={{ color: C.textMid, fontSize: 14, fontWeight: 500 }}>
        {geo.status === 'loading' ? t('horaires_extra.locating') : t('horaires_extra.loading_schedule')}
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ ...glass({ padding: '36px 40px', textAlign: 'center', maxWidth: 380 }) }}>
        <p style={{ fontSize: 32, marginBottom: 12, color: '#c0392b' }}><FaExclamationTriangle /></p>
        <p style={{ fontSize: 14, color: '#c0392b', marginBottom: 20 }}>{error}</p>
        <button onClick={() => { requestLocation(); }}
          style={{ padding: '10px 24px', background: `linear-gradient(135deg,${gold},#A8882A)`, border: 'none', borderRadius: 12, color: '#0D1810', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          {t('horaires_extra.retry')}
        </button>
      </div>
    </div>
  );

  if (!todayTimings) return null;

  const hijri    = parseHijri(hijriRaw);
  const hijriAr  = `${hijri.day} ${HIJRI_MONTHS_AR[hijri.month] || ''}`;
  const hijriLat = `${hijri.day} ${HIJRI_MONTHS[hijri.month] || ''} ${hijri.year} H`;
  const todayNum = now.getDate();
  const todayYear = now.getFullYear();
  const todayMonthNum = now.getMonth() + 1;
  const isCurrentMonthView = viewYear === todayYear && viewMonth === todayMonthNum;

  // Navigation handlers
  const goPrevMonth = () => {
    setShowFullMonth(false);
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  };
  const goNextMonth = () => {
    setShowFullMonth(false);
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
    setShowFullMonth(false);
  };

  const viewMonthLabel = new Date(viewYear, viewMonth - 1, 1)
    .toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  const displayData = isCurrentMonthView ? monthData : viewMonthData;
  const daysFromToday = isCurrentMonthView
    ? displayData.filter(day => parseInt(day.gregorian?.date?.split('-')[0] || '0', 10) >= todayNum)
    : displayData;

  const visibleDays = showFullMonth ? daysFromToday : daysFromToday.slice(0, 10);
  const locLabel = geo.city ? `${geo.city}${geo.country ? ', ' + geo.country : ''}` : 'Ma position';

  const cdownH = Math.floor(secsLeft / 3600);
  const cdownM = Math.floor((secsLeft % 3600) / 60);
  const cdownS = secsLeft % 60;

  const prayerMeta: Record<PrayerKey, { label: string; sub: string }> = {
    Fajr:    { label: t('salat.fajr'),    sub: t('salat_extra.fajr_sub')    },
    Dhuhr:   { label: t('salat.dhuhr'),   sub: t('salat_extra.dhuhr_sub')   },
    Asr:     { label: t('salat.asr'),     sub: t('salat_extra.asr_sub')     },
    Maghrib: { label: t('salat.maghrib'), sub: t('salat_extra.maghrib_sub') },
    Isha:    { label: t('salat.isha'),    sub: t('salat_extra.isha_sub')    },
  };

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', paddingBottom: 52 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative',
        backgroundImage: `linear-gradient(145deg, rgba(6,15,10,0.80) 0%, rgba(18,48,30,0.68) 55%, rgba(8,20,14,0.60) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '28px 32px 24px',
        border: '1px solid rgba(200,168,75,0.14)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
      }}>
        <IslamicPattern opacity={0.07} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

        {/* Location badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 18 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '4px 12px', backdropFilter: 'blur(8px)',
          }}>
            <FaMapMarkerAlt style={{ fontSize: 12, color: goldLight }} />
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{locLabel}</span>
            {geo.status === 'denied' && (
              <button onClick={requestLocation} title={t('horaires_extra.retry')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: goldLight, fontSize: 11, padding: 0, marginLeft: 4 }}>
                ↺
              </button>
            )}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
            <svg width="7" height="7" viewBox="0 0 20 20"><polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill="#C8A84B" /></svg>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
          </div>
          <div style={{ borderLeft: `3px solid rgba(200,168,75,0.75)`, paddingLeft: 14 }}>
            <p style={{ margin: '0 0 3px', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(224,200,112,0.8)', fontWeight: 600 }}>
              {t(WEEKDAY_I18N_KEY[weekday] || 'days.monday') || weekday}
            </p>
            <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em' }}>
              {t('horaires.title')}
            </h1>

            {/* Countdown to next prayer */}
            {nextInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>{t('next_prayer')} ·</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: goldLight }}>{PRAYER_ARABIC[nextInfo.key]} {prayerMeta[nextInfo.key].label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: gold, fontVariantNumeric: 'tabular-nums', background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.25)', borderRadius: 8, padding: '3px 10px' }}>
                  {padZ(cdownH)}:{padZ(cdownM)}:{padZ(cdownS)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DATE CARDS ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>

        {/* Gregorian */}
        <div className="card" style={{ ...glass({ padding: '20px 22px' }), position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'all 0.28s ease' }}>
          <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 6px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textLight, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><FaCalendarAlt /> {t('horaires_extra.gregorian_date')}</p>
            <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800, color: C.textDark, lineHeight: 1 }}>{gregorianRaw}</p>
            <p style={{ margin: 0, fontSize: 11.5, color: C.textMid }}>{t(WEEKDAY_I18N_KEY[weekday] || 'days.monday') || weekday}</p>
          </div>
        </div>

        {/* Hijri */}
        <div className="card" style={{ ...glass({ padding: '20px 22px' }), position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'all 0.28s ease' }}>
          <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 6px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textLight, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><BsMoonStars /> {t('horaires_extra.hijri_date')}</p>
            <p style={{ margin: '0 0 2px', textAlign: 'right', direction: 'rtl', fontSize: 20, color: isDark ? goldLight : '#1B3022', lineHeight: 1.3 }}>{hijriAr}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.textMid }}>{hijriLat}</p>
          </div>
        </div>

        {/* Localisation réelle */}
        <div className="card" style={{
          padding: '20px 22px', borderRadius: 22,
          background: `linear-gradient(135deg, ${gold}, #A8882A)`,
          position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.28s ease',
        }}
          onClick={requestLocation}
          title="Cliquer pour relancer la localisation"
        >
          <IslamicPattern opacity={0.12} color="#fff" />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 6px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              <FaMapMarkerAlt /> {t('horaires_extra.my_location')}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>{geo.city || '—'}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
              {geo.status === 'denied' ? t('horaires_extra.permission_denied') : `${geo.lat.toFixed(3)}°, ${geo.lng.toFixed(3)}°`}
            </p>
          </div>
        </div>
      </div>

      {/* ── PRAYER TIME CARDS ─────────────────────────────────────────────────── */}
      <div style={{ ...glass({ marginBottom: 20, overflow: 'hidden', padding: '0' }), position: 'relative' }}>
        <IslamicPattern opacity={isDark ? 0.04 : 0.025} />

        <div style={{ padding: '18px 28px 0', borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.10)' : 'rgba(200,168,75,0.15)'}`, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="11" height="11" viewBox="0 0 20 20"><polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} /></svg>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>{t('horaires_extra.today_label')} · {locLabel}</h2>
            </div>
            <span style={{ fontSize: 11, color: C.textMid, fontVariantNumeric: 'tabular-nums' }}>
              {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* 5 Prayer columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0 12px 20px', position: 'relative', gap: 4 }}>
          {PRAYERS.map((key) => {
            const isActive  = currentPrayer === key;
            const isNext    = nextInfo?.key === key && !isActive;
            const isHovered = hoveredPrayer === key;
            const time      = todayTimings[key] || '--:--';
            const meta      = prayerMeta[key];
            return (
              <div
                key={key}
                onMouseEnter={() => setHoveredPrayer(key)}
                onMouseLeave={() => setHoveredPrayer(null)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '20px 8px', marginTop: 14, borderRadius: 18,
                  background: isActive
                    ? `linear-gradient(145deg, ${gold}28, ${gold}10)`
                    : isHovered
                    ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(200,168,75,0.05)')
                    : 'transparent',
                  border: isActive ? `1.5px solid ${gold}55` : isNext ? `1.5px dashed ${gold}40` : '1.5px solid transparent',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  transform: isHovered && !isActive ? 'translateY(-4px) scale(1.03)' : 'none',
                  cursor: 'default',
                  boxShadow: isActive ? `0 4px 20px ${gold}20` : 'none',
                  position: 'relative', overflow: 'hidden',
                }}>

                {/* Emoji icon */}
                <span style={{ fontSize: 20, marginBottom: 6, filter: isActive ? 'drop-shadow(0 0 8px rgba(200,168,75,0.6))' : 'none', transition: 'filter 0.3s' }}>
                  {PRAYER_ICON[key]}
                </span>

                {/* Arabic name */}
                <p style={{ margin: '0 0 2px', fontSize: 20, color: isActive ? gold : C.textDark, direction: 'rtl', lineHeight: 1.4, fontWeight: isActive ? 700 : 400 }}>
                  {PRAYER_ARABIC[key]}
                </p>

                {/* Latin name */}
                <p style={{ margin: '0 0 2px', fontSize: 11.5, fontWeight: 700, color: isActive ? gold : C.textDark }}>
                  {meta.label}
                </p>
                <p style={{ margin: '0 0 12px', fontSize: 9, color: isActive ? `rgba(200,168,75,0.7)` : C.textLight, letterSpacing: '0.06em' }}>
                  {meta.sub}
                </p>

                {/* Time */}
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, lineHeight: 1, color: isActive ? gold : C.green, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em' }}>
                  {time}
                </p>

                {isActive && (
                  <span style={{ marginTop: 6, fontSize: 8.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, fontWeight: 700, background: `${gold}18`, borderRadius: 6, padding: '2px 7px' }}>
                    {t('horaires_extra.in_progress')}
                  </span>
                )}
                {isNext && !isActive && (
                  <span style={{ marginTop: 6, fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,168,75,0.6)', fontWeight: 600 }}>
                    {t('horaires_extra.next')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── COUNTDOWN BANNER ─────────────────────────────────────────────────── */}
      {nextInfo && (
        <div style={{
          ...glass({ padding: '18px 26px', marginBottom: 20 }),
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderLeft: `3px solid ${gold}`,
          animation: 'fadeInUp 0.5s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 26 }}>{PRAYER_ICON[nextInfo.key]}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 10, color: gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {t('horaires_extra.next_prayer_in')}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: C.textDark, fontWeight: 600 }}>
                {PRAYER_ARABIC[nextInfo.key]} · {prayerMeta[nextInfo.key].label} · {todayTimings[nextInfo.key]}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              margin: 0, fontSize: 28, fontWeight: 900, color: gold,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em',
              textShadow: `0 0 20px ${gold}55`,
            }}>
              {padZ(cdownH)}:{padZ(cdownM)}:{padZ(cdownS)}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>{t('horaires_extra.hours_mins_secs')}</p>
          </div>
        </div>
      )}

      {/* ── MONTHLY TABLE ─────────────────────────────────────────────────────── */}
      <div style={{
        background: isDark ? 'rgba(12,18,32,0.90)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(200,168,75,0.13)' : '#e8e2d4'}`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 16px rgba(27,48,34,0.06)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '18px 24px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0ece0'}`,
        }}>
          <div>
            <h2 style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
              {t('horaires_extra.month_schedule')}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: C.textMid, textTransform: 'capitalize', fontFamily: "'Cairo', sans-serif" }}>
              {viewMonthLabel}
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={goPrevMonth}
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0'}`, background: isDark ? 'rgba(255,255,255,0.04)' : '#faf8f3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid, fontSize: 16, fontWeight: 600, transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0'; e.currentTarget.style.color = C.textMid; }}
            >‹</button>

            <button
              onClick={goToday}
              style={{
                padding: '7px 16px', borderRadius: 10,
                border: `1px solid ${isCurrentMonthView ? gold : (isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0')}`,
                background: isCurrentMonthView ? (isDark ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.08)') : (isDark ? 'rgba(255,255,255,0.04)' : '#faf8f3'),
                color: isCurrentMonthView ? gold : C.textDark,
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif", transition: 'all 0.18s',
              }}
            >
              {t('horaires_extra.today') || "Aujourd'hui"}
            </button>

            <button
              onClick={goNextMonth}
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0'}`, background: isDark ? 'rgba(255,255,255,0.04)' : '#faf8f3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid, fontSize: 16, fontWeight: 600, transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0'; e.currentTarget.style.color = C.textMid; }}
            >›</button>

            <div style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e0dbd0'}`, background: isDark ? 'rgba(255,255,255,0.04)' : '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMid }}>
              <FaCalendarAlt style={{ fontSize: 13 }} />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: 'auto' }}>
          {loadingMonthView ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: `2px solid rgba(200,168,75,0.2)`, borderTopColor: gold, borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto' }} />
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0ece0'}` }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 600, color: C.textMid, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Cairo', sans-serif" }}>
                    {t('horaires.day')}
                  </th>
                  {PRAYERS.map(p => (
                    <th key={p} style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: C.textMid, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Cairo', sans-serif" }}>
                      <span style={{ fontSize: 17, display: 'block', marginBottom: 3, color: p === 'Isha' ? (isDark ? '#7ea8d4' : '#5b7ba8') : (isDark ? goldLight : '#b8943a') }}>
                        {PRAYER_ICON[p]}
                      </span>
                      {prayerMeta[p].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDays.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: C.textLight, fontSize: 13 }}>Aucune donnée disponible</td></tr>
                ) : visibleDays.map((day) => {
                  const gDate  = day.gregorian?.date || '';
                  const dayNum = parseInt(gDate.split('-')[0] || '0', 10);
                  const isToday = isCurrentMonthView && dayNum === todayNum;
                  const dayName = t(WEEKDAY_I18N_KEY[day.gregorian?.weekday?.en || ''] || 'days.monday') || '';
                  const isFri  = day.gregorian?.weekday?.en === 'Friday';
                  const shortMonth = new Date(viewYear, viewMonth - 1, 1)
                    .toLocaleString('fr-FR', { month: 'short' });
                  return (
                    <tr key={gDate} style={{
                      background: isToday
                        ? (isDark ? 'rgba(200,168,75,0.07)' : '#f5f3ee')
                        : 'transparent',
                      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f4f0e6'}`,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isToday) (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : '#faf9f5'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isToday ? (isDark ? 'rgba(200,168,75,0.07)' : '#f5f3ee') : 'transparent'; }}
                    >
                      <td style={{ padding: '13px 24px' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: isToday ? 700 : 500, color: isToday ? gold : C.textDark, fontFamily: "'Cairo', sans-serif" }}>
                          {dayNum} {shortMonth.charAt(0).toUpperCase() + shortMonth.slice(1)}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: isFri ? C.green : C.textLight, fontWeight: isFri ? 600 : 400, fontFamily: "'Cairo', sans-serif" }}>
                          {dayName}
                        </p>
                      </td>
                      {PRAYERS.map(p => (
                        <td key={p} style={{
                          padding: '13px 16px', textAlign: 'center',
                          fontFamily: "'Cairo', sans-serif",
                          fontSize: 13.5, fontVariantNumeric: 'tabular-nums',
                          color: isToday ? C.textDark : C.textMid,
                          fontWeight: isToday ? 600 : 400,
                        }}>
                          {(day.timings?.[p] || '--:--').substring(0, 5)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Show more button ── */}
        <div style={{ padding: '14px', textAlign: 'center', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0ece0'}` }}>
          <button
            onClick={() => setShowFullMonth(v => !v)}
            style={{
              background: 'none',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : '#dedad0'}`,
              borderRadius: 20, padding: '8px 28px',
              color: C.textDark, fontSize: 13, cursor: 'pointer',
              fontWeight: 500, fontFamily: "'Cairo', sans-serif",
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.14)' : '#dedad0'; e.currentTarget.style.color = C.textDark; }}
          >
            {showFullMonth
              ? <>{t('horaires_extra.show_less')} <span style={{ fontSize: 11 }}>∧</span></>
              : <>{t('horaires_extra.show_month')} <span style={{ fontSize: 11 }}>∨</span></>}
          </button>
        </div>
      </div>

      {/* ── Info bar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 18px', marginTop: 12,
        background: isDark ? 'rgba(255,255,255,0.025)' : '#faf8f3',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#ede8db'}`,
        borderRadius: 12,
      }}>
        <p style={{ margin: 0, fontSize: 11, color: C.textLight, display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'Cairo', sans-serif" }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>ⓘ</span>
          {t('horaires_extra.footer')}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 16 }}>
          <span style={{ fontSize: 11, color: C.textMid, fontFamily: "'Cairo', sans-serif" }}>Méthode de calcul</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: gold, fontFamily: "'Cairo', sans-serif" }}>MWL</span>
          <FaSyncAlt
            onClick={requestLocation}
            title="Actualiser"
            style={{ fontSize: 12, color: C.textLight, cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e: React.MouseEvent<SVGElement>) => (e.currentTarget.style.color = gold)}
            onMouseLeave={(e: React.MouseEvent<SVGElement>) => (e.currentTarget.style.color = C.textLight)}
          />
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default Horaires;
