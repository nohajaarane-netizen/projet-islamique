import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

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

// ─── Constants & Helpers ─────────────────────────────────────────────────────

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerKey = typeof PRAYERS[number];

const PRAYER_ARABIC: Record<PrayerKey, string> = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};

const gold = '#C8A84B';
const goldLight = '#E0C870';

function getCurrentPrayer(timings: PrayerTimings): PrayerKey {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const times = PRAYERS.map(p => { const [h, m] = (timings[p] || '00:00').split(':').map(Number); return h * 60 + m; });
  let current: PrayerKey = 'Isha';
  for (let i = 0; i < PRAYERS.length; i++) { if (mins >= times[i]) current = PRAYERS[i]; }
  return current;
}

function parseHijriDate(raw: string) {
  const parts = raw.split('-');
  return { day: parts[2] || '', month: parts[1] || '', year: parts[0] || '' };
}

const HIJRI_MONTHS: Record<string, string> = {
  '01':'Muharram','02':'Safar','03':"Rabi' al-Awwal",'04':"Rabi' al-Thani",
  '05':'Jumada al-Awwal','06':'Jumada al-Thani','07':'Rajab','08':"Sha'ban",
  '09':'Ramadan','10':'Shawwal','11':"Dhu al-Qi'dah",'12':'Dhu al-Hijjah',
};

const HIJRI_MONTHS_AR: Record<string, string> = {
  '01':'مُحَرَّم','02':'صَفَر','03':'رَبِيعُ الْأَوَّل','04':'رَبِيعُ الثَّانِي',
  '05':'جُمَادَى الأُولَى','06':'جُمَادَى الآخِرَة','07':'رَجَب','08':'شَعْبَان',
  '09':'رَمَضَان','10':'شَوَّال','11':'ذُو الْقَعْدَة','12':'ذُو الْحِجَّة',
};

const WEEKDAYS_FR: Record<string, string> = {
  Monday:'Lundi', Tuesday:'Mardi', Wednesday:'Mercredi', Thursday:'Jeudi',
  Friday:'Vendredi', Saturday:'Samedi', Sunday:'Dimanche',
};

// ─── Islamic Pattern ─────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06 }: { opacity?: number }) => (
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

// ─── Component ────────────────────────────────────────────────────────────────

const Horaires: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [todayTimings, setTodayTimings] = useState<PrayerTimings | null>(null);
  const [hijriRaw, setHijriRaw] = useState('');
  const [gregorianRaw, setGregorianRaw] = useState('');
  const [weekday, setWeekday] = useState('');
  const [monthData, setMonthData] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullMonth, setShowFullMonth] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const currentPrayer = useMemo(
    () => (todayTimings ? getCurrentPrayer(todayTimings) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayTimings, now]
  );

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const today = new Date();
        const [todayRes, monthRes] = await Promise.all([
          axios.get('https://api.aladhan.com/v1/timingsByCity?city=Berrechid&country=MA&method=4'),
          axios.get(`https://api.aladhan.com/v1/calendarByCity/${today.getFullYear()}/${today.getMonth()+1}?city=Berrechid&country=MA&method=4`),
        ]);
        if (!ignore) {
          setTodayTimings(todayRes.data.data.timings);
          setHijriRaw(todayRes.data.data.date.hijri.date);
          setGregorianRaw(todayRes.data.data.date.gregorian.date);
          setWeekday(todayRes.data.data.date.gregorian.weekday.en);
          setMonthData(monthRes.data.data || []);
        }
      } catch {
        if (!ignore) setError(t('horaires.error') || 'Impossible de récupérer les horaires');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [t]);

  // ── Shared styles ─────────────────────────────────────────────────────────

  const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: isDark ? 'rgba(14,22,16,0.88)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${isDark ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.18)'}`,
    borderRadius: 22,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 6px 28px rgba(27,48,34,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
    ...extra,
  });

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `2px solid rgba(200,168,75,0.2)`, borderTop: `2px solid ${gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: C.textMid, fontSize: 13 }}>{t('horaires.loading') || 'Chargement...'}</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ ...glass({ padding: '36px 40px', textAlign: 'center', maxWidth: 380 }) }}>
        <p style={{ fontSize: 13, color: '#c0392b', marginBottom: 16 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '9px 22px', background: `linear-gradient(135deg,${gold},#A8882A)`, border: 'none', borderRadius: 10, color: '#0D1810', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          Réessayer
        </button>
      </div>
    </div>
  );

  const hijri = parseHijriDate(hijriRaw);
  const hijriMonthName = HIJRI_MONTHS[hijri.month] || '';
  const hijriMonthNameAr = HIJRI_MONTHS_AR[hijri.month] || '';
  const todayDateNum = now.getDate();
  const visibleDays = showFullMonth ? monthData : monthData.slice(0, 7);

  const prayerMeta: Record<PrayerKey, { label: string; sub: string }> = {
    Fajr:    { label: t('horaires.fajr')    || 'Fajr',    sub: t('horaires.fajr_sub')    || 'Aube'        },
    Dhuhr:   { label: t('horaires.dhuhr')   || 'Dhuhr',   sub: t('horaires.dhuhr_sub')   || 'Zénith'      },
    Asr:     { label: t('horaires.asr')     || 'Asr',     sub: t('horaires.asr_sub')     || 'Après-midi'  },
    Maghrib: { label: t('horaires.maghrib') || 'Maghrib', sub: t('horaires.maghrib_sub') || 'Coucher'     },
    Isha:    { label: t('horaires.isha')    || 'Isha',    sub: t('horaires.isha_sub')    || 'Nuit'        },
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 48 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 26, overflow: 'hidden', marginBottom: 20, position: 'relative',
        backgroundImage: `linear-gradient(145deg, rgba(6,15,10,0.95) 0%, rgba(18,48,30,0.88) 55%, rgba(8,20,14,0.78) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center 25%', minHeight: 220,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px 36px 32px',
      }}>
        <IslamicPattern opacity={0.08} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

        {/* Arabic Quranic verse */}
        <p style={{
          position: 'absolute', top: 20, right: 32, margin: 0, pointerEvents: 'none',
          fontFamily: "'Scheherazade New', serif", fontSize: 20,
          color: 'rgba(200,168,75,0.18)', direction: 'rtl',
        }}>
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
        </p>

        <div style={{ position: 'relative' }}>
          <p style={{ margin: '0 0 8px', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(224,200,112,0.8)', fontWeight: 600 }}>
            {WEEKDAYS_FR[weekday] || weekday} · Berrechid, Maroc
          </p>
          <h1 style={{
            margin: '0 0 6px', fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: '#FFF',
            fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em',
          }}>
            {t('horaires.title') || 'Horaires de Prière'}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            {t('horaires.subtitle') || 'Planifiez votre journée autour des heures de prière'}
          </p>
        </div>
      </div>

      {/* ── DATE CARDS ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>

        {/* Gregorian */}
        <div style={{ ...glass({ padding: '20px 22px' }), position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 4px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textLight, fontWeight: 700 }}>
              Date grégorienne
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: C.textDark, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {gregorianRaw}
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: C.textMid }}>{WEEKDAYS_FR[weekday] || weekday}</p>
          </div>
        </div>

        {/* Hijri */}
        <div style={{ ...glass({ padding: '20px 22px' }), position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 4px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textLight, fontWeight: 700 }}>
              Date hijri
            </p>
            <p style={{
              margin: '0 0 2px', textAlign: 'right', direction: 'rtl',
              fontFamily: "'Scheherazade New', serif", fontSize: 22, color: isDark ? goldLight : '#1B3022', lineHeight: 1.3,
            }}>
              {hijri.day} {hijriMonthNameAr}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: C.textMid }}>{hijri.day} {hijriMonthName} · {hijri.year} H</p>
          </div>
        </div>

        {/* Phase lunaire */}
        <div style={{
          padding: '20px 22px', borderRadius: 22,
          background: `linear-gradient(135deg, ${gold}, #A8882A)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <IslamicPattern opacity={0.12} color="#fff" />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 4px', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>
              Phase lunaire
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800, color: '#FFFFFF', fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>
              Premier croissant
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Méthode MWL</p>
          </div>
        </div>
      </div>

      {/* ── PRAYER TIME CARDS ─────────────────────────────────────────────── */}
      <div style={{ ...glass({ marginBottom: 20, overflow: 'hidden', padding: '0' }), position: 'relative' }}>
        <IslamicPattern opacity={isDark ? 0.04 : 0.025} />

        <div style={{ padding: '20px 28px 0', borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.1)' : 'rgba(200,168,75,0.15)'}`, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 20 20">
                <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
              </svg>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark, fontFamily: "'Playfair Display', serif" }}>
                Aujourd'hui
              </h2>
            </div>
            <span style={{ fontSize: 11, color: C.textMid }}>
              {WEEKDAYS_FR[weekday] || weekday} {todayDateNum} · {gregorianRaw}
            </span>
          </div>
        </div>

        {/* 5 Prayer columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0 16px 24px', position: 'relative' }}>
          {PRAYERS.map((key, idx) => {
            const isActive = currentPrayer === key;
            const time = todayTimings?.[key] || '--:--';
            const meta = prayerMeta[key];
            return (
              <div key={key} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '22px 10px', marginTop: 16, borderRadius: 18,
                background: isActive ? `linear-gradient(145deg, ${gold}22, ${gold}10)` : 'transparent',
                border: isActive ? `1px solid ${gold}44` : '1px solid transparent',
                position: 'relative', transition: 'all 0.3s ease',
                borderRight: idx < 4 ? `1px solid ${isActive ? 'transparent' : (isDark ? 'rgba(200,168,75,0.08)' : 'rgba(200,168,75,0.12)')}` : 'none',
              }}>
                {/* Arabic name */}
                <p style={{
                  margin: '0 0 4px',
                  fontFamily: "'Scheherazade New', serif",
                  fontSize: 24, color: isActive ? gold : C.textDark,
                  direction: 'rtl', lineHeight: 1.4,
                }}>
                  {PRAYER_ARABIC[key]}
                </p>

                {/* Latin name + subtitle */}
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: isActive ? gold : C.textDark, fontFamily: "'Playfair Display', serif" }}>
                  {meta.label}
                </p>
                <p style={{ margin: '0 0 14px', fontSize: 9.5, color: isActive ? `rgba(200,168,75,0.7)` : C.textLight, letterSpacing: '0.06em' }}>
                  {meta.sub}
                </p>

                {/* Time */}
                <p style={{
                  margin: 0, fontSize: 24, fontWeight: 800, lineHeight: 1,
                  color: isActive ? gold : C.green,
                  fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em',
                }}>
                  {time}
                </p>

                {isActive && (
                  <p style={{
                    margin: '8px 0 0', fontSize: 9, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: gold, fontWeight: 700,
                  }}>
                    Actuelle
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── NOTIFICATION BANNER ──────────────────────────────────────────── */}
      <div style={{
        ...glass({ padding: '16px 24px', marginBottom: 20 }),
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderLeft: `3px solid ${gold}`,
      }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 11, color: gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rappels de prière</p>
          <p style={{ margin: 0, fontSize: 12.5, color: C.textMid }}>
            Activez les notifications pour ne jamais manquer l'appel à la prière.
          </p>
        </div>
        <button style={{
          padding: '9px 18px', background: 'transparent',
          border: `1px solid rgba(200,168,75,0.35)`,
          borderRadius: 11, color: gold, fontSize: 12, cursor: 'pointer',
          fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 16,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Gérer les notifications
        </button>
      </div>

      {/* ── MONTHLY TABLE ─────────────────────────────────────────────────── */}
      <div style={{ ...glass({ overflow: 'hidden' }), position: 'relative' }}>
        <IslamicPattern opacity={isDark ? 0.03 : 0.02} />

        <div style={{ padding: '20px 26px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.08)' : 'rgba(200,168,75,0.12)'}`, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="11" height="11" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <div>
              <h2 style={{ margin: '0 0 1px', fontSize: 15, fontWeight: 700, color: C.textDark, fontFamily: "'Playfair Display', serif" }}>
                Horaires du mois
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: C.textMid }}>
                {new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} style={{
            background: 'none', border: `1px solid rgba(200,168,75,0.25)`, borderRadius: 9,
            padding: '6px 14px', fontSize: 11, color: gold, cursor: 'pointer', fontWeight: 600,
            transition: 'all 0.2s',
          }}>
            Actualiser
          </button>
        </div>

        <div style={{ overflowX: 'auto', position: 'relative' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(200,168,75,0.04)' : 'rgba(200,168,75,0.03)' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, color: C.textMid, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.08)' : 'rgba(200,168,75,0.12)'}` }}>Date</th>
                {PRAYERS.map(p => (
                  <th key={p} style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: C.textMid, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.08)' : 'rgba(200,168,75,0.12)'}` }}>
                    <span style={{ fontFamily: "'Scheherazade New', serif", fontSize: 16, display: 'block', color: isDark ? goldLight : '#1B3022', marginBottom: 2 }}>
                      {PRAYER_ARABIC[p]}
                    </span>
                    {prayerMeta[p].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleDays.map((day, idx) => {
                const gDate = day.gregorian?.date || '';
                const dayNum = parseInt(gDate.split('-')[2] || '0', 10);
                const isToday = dayNum === todayDateNum;
                const dayName = WEEKDAYS_FR[day.gregorian?.weekday?.en || ''] || '';
                const isFriday = day.gregorian?.weekday?.en === 'Friday';
                return (
                  <tr key={gDate} style={{
                    background: isToday
                      ? (isDark ? 'rgba(200,168,75,0.06)' : 'rgba(200,168,75,0.04)')
                      : isFriday
                      ? (isDark ? 'rgba(46,100,67,0.06)' : 'rgba(46,100,67,0.03)')
                      : idx % 2 === 0 ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.012)'),
                    borderBottom: `1px solid ${isDark ? 'rgba(200,168,75,0.06)' : 'rgba(200,168,75,0.08)'}`,
                    borderLeft: isToday ? `3px solid ${gold}` : '3px solid transparent',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: '10px 20px' }}>
                      <p style={{ margin: '0 0 1px', fontSize: 13, fontWeight: isToday ? 800 : 500, color: isToday ? gold : C.textDark, fontFamily: isToday ? "'Playfair Display', serif" : 'inherit' }}>
                        {dayNum} {new Date().toLocaleString('fr-FR', { month: 'short' })}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: isFriday ? C.green : C.textLight, fontWeight: isFriday ? 600 : 400 }}>{dayName}</p>
                    </td>
                    {PRAYERS.map(p => (
                      <td key={p} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: isToday ? 700 : 400, color: isToday ? gold : C.textDark, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                        {day.timings?.[p] || '--:--'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '14px', textAlign: 'center', borderTop: `1px solid ${isDark ? 'rgba(200,168,75,0.08)' : 'rgba(200,168,75,0.1)'}` }}>
          <button
            onClick={() => setShowFullMonth(v => !v)}
            style={{ background: 'none', border: 'none', color: gold, fontSize: 12.5, cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {showFullMonth ? 'Réduire' : 'Voir tout le mois'} {showFullMonth ? '∧' : '∨'}
          </button>
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <p style={{ margin: 0, fontSize: 10.5, color: C.textLight }}>
          Horaires calculés automatiquement · peuvent légèrement varier selon la position exacte.
        </p>
        <p style={{ margin: 0, fontSize: 10.5, color: gold, fontWeight: 600 }}>Méthode : MWL</p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Horaires;
