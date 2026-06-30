import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import PageBanner from '../components/layout/PageBanner';
import { useNavigatePage } from '../context/NavigationContext';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
ChartJS.defaults.font.family = "'Cairo', sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────

type PrayerStatus = 'done' | 'missed' | 'pending';
type DayRecord = Record<string, PrayerStatus>;
type History = Record<string, DayRecord>;
type SunnahKey = 'Tahajjud' | 'Duha' | 'Witr';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerName = typeof PRAYERS[number];

const PRAYER_ARABIC: Record<PrayerName, string> = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};

// Sub-labels resolved at render time via t() in the component

const SUNNAH_PRAYERS: { key: SunnahKey; label: string; arabic: string; total: number }[] = [
  { key: 'Tahajjud', label: 'Tahajjud', arabic: 'التهجد', total: 8 },
  { key: 'Duha',     label: 'Duha',     arabic: 'الضحى',  total: 9 },
  { key: 'Witr',     label: 'Witr',     arabic: 'الوتر',  total: 7 },
];

const BADGES: { id: string; labelKey: string; descKey: string; symbol: string; threshold: number }[] = [
  { id: 'dawn',      labelKey: 'salat_extra.badge_dawn_label',      descKey: 'salat_extra.badge_dawn_desc',      symbol: '◇', threshold: 7  },
  { id: 'assidu',    labelKey: 'salat_extra.badge_assidu_label',    descKey: 'salat_extra.badge_assidu_desc',    symbol: '◆', threshold: 10 },
  { id: 'persevere', labelKey: 'salat_extra.badge_persevere_label', descKey: 'salat_extra.badge_persevere_desc', symbol: '▲', threshold: 14 },
  { id: 'perfect',   labelKey: 'salat_extra.badge_perfect_label',  descKey: 'salat_extra.badge_perfect_desc',  symbol: '★', threshold: 30 },
];

const DAYS_I18N_SHORT = ['days.sunday', 'days.monday', 'days.tuesday', 'days.wednesday', 'days.thursday', 'days.friday', 'days.saturday'];

const gold = '#C8A84B';
const goldLight = '#E0C870';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10); }
function dateStr(d: Date) { return d.toISOString().slice(0, 10); }
function parseTimeMins(t: string): number { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

function getCurrentPrayer(timings: Record<string, string>): PrayerName {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  let cur: PrayerName = 'Isha';
  for (const p of PRAYERS) { if (timings[p] && parseTimeMins(timings[p]) <= mins) cur = p; }
  return cur;
}

function loadHistory(): History {
  try { return JSON.parse(localStorage.getItem('salatHistory') || '{}'); } catch { return {}; }
}

function saveHistory(h: History) { localStorage.setItem('salatHistory', JSON.stringify(h)); }

function calcStreak(history: History): number {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = dateStr(d);
    const done = PRAYERS.filter(p => history[key]?.[p] === 'done').length;
    if (done === 5) { streak++; d.setDate(d.getDate() - 1); }
    else if (i === 0) { d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

function calcBestStreak(history: History): number {
  let best = 0, cur = 0;
  for (const key of Object.keys(history).sort()) {
    const done = PRAYERS.filter(p => history[key]?.[p] === 'done').length;
    if (done === 5) { cur++; if (cur > best) best = cur; } else cur = 0;
  }
  return best;
}

// ─── Islamic pattern ──────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06 }: { opacity?: number }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="ip-salat" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity} />
        <rect x="8" y="8" width="48" height="48" fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity} transform="rotate(45 32 32)" />
        <circle cx="32" cy="32" r="10" fill="none" stroke={gold} strokeWidth="0.4" opacity={opacity * 0.7} />
        <circle cx="32" cy="32" r="2" fill={gold} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-salat)" />
  </svg>
);

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ value, total, color, size = 130, days = '' }: { value: number; total: number; color: string; size?: number; days?: string }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(200,168,75,0.12)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={8} strokeDasharray={`${circ*pct} ${circ}`}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }} />
      <defs>
        <linearGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="100%" stopColor={gold} />
        </linearGradient>
      </defs>
      <text x={size/2} y={size/2-10} textAnchor="middle" fill={gold} fontSize={26} fontWeight={800} fontFamily="'Cairo', sans-serif">{value}</text>
      <text x={size/2} y={size/2+10} textAnchor="middle" fill="rgba(200,168,75,0.6)" fontSize={11}>{days}</text>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalatTracker() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';
  const navigate = useNavigatePage();

  const PRAYER_SUBTITLES: Record<PrayerName, string> = {
    Fajr: t('salat_extra.fajr_sub'), Dhuhr: t('salat_extra.dhuhr_sub'),
    Asr: t('salat_extra.asr_sub'), Maghrib: t('salat_extra.maghrib_sub'), Isha: t('salat_extra.isha_sub'),
  };

  const [apiTimings, setApiTimings] = useState<Record<string, string> | null>(null);
  const [history, setHistory] = useState<History>(loadHistory);
  const [sunnahDone, setSunnahDone] = useState<Record<SunnahKey, number>>(() => {
    try { return JSON.parse(localStorage.getItem('sunnahDone_' + todayStr()) || '{"Tahajjud":0,"Duha":0,"Witr":0}'); }
    catch { return { Tahajjud: 0, Duha: 0, Witr: 0 }; }
  });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    axios.get('https://api.aladhan.com/v1/timingsByCity?city=Berrechid&country=MA&method=4')
      .then(r => setApiTimings(r.data.data.timings))
      .catch(() => {});
  }, []);

  useEffect(() => { saveHistory(history); }, [history]);
  useEffect(() => {
    localStorage.setItem('sunnahDone_' + todayStr(), JSON.stringify(sunnahDone));
  }, [sunnahDone]);

  const today = todayStr();
  const todayRecord: DayRecord = history[today] || {};
  const currentPrayer = useMemo(() => apiTimings ? getCurrentPrayer(apiTimings) : null, [apiTimings, now]);
  const completedCount = PRAYERS.filter(p => todayRecord[p] === 'done').length;
  const streak = useMemo(() => calcStreak(history), [history]);
  const bestStreak = useMemo(() => calcBestStreak(history), [history]);

  const togglePrayer = useCallback((name: PrayerName) => {
    setHistory(prev => {
      const day = prev[today] || {};
      const cur = day[name];
      const next: PrayerStatus = cur === 'done' ? 'missed' : cur === 'missed' ? 'pending' : 'done';
      const updated = { ...prev, [today]: { ...day, [name]: next } };
      if (next === 'pending') delete updated[today][name];
      return updated;
    });
  }, [today]);

  const weeklyData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = dateStr(d);
    const done = PRAYERS.filter(p => history[key]?.[p] === 'done').length;
    return { label: t(DAYS_I18N_SHORT[d.getDay()]).slice(0, 3), value: Math.round((done / 5) * 100) };
  }), [history]);

  const monthlyData = useMemo(() => {
    const d = new Date(); d.setDate(1);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dd = new Date(d); dd.setDate(i + 1);
      const key = dateStr(dd);
      const done = PRAYERS.filter(p => history[key]?.[p] === 'done').length;
      return { day: i + 1, done, isFuture: dd > new Date() };
    });
  }, [history]);

  // ── Shared styles ──────────────────────────────────────────────────────────

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

  const heatColor = (done: number, isFuture: boolean) => {
    if (isFuture) return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    if (done === 0) return isDark ? 'rgba(200,168,75,0.06)' : 'rgba(200,168,75,0.08)';
    if (done < 3) return isDark ? 'rgba(46,100,67,0.3)' : 'rgba(46,100,67,0.2)';
    if (done < 5) return isDark ? 'rgba(46,100,67,0.55)' : 'rgba(46,100,67,0.4)';
    return C.green;
  };

  const statusStyle = (status: PrayerStatus, isNext: boolean): React.CSSProperties => {
    if (status === 'done') return { background: `${C.green}22`, border: `1.5px solid ${C.green}66`, color: C.green };
    if (status === 'missed') return { background: 'rgba(220,53,69,0.08)', border: '1.5px solid rgba(220,53,69,0.3)', color: '#dc3545' };
    if (isNext) return { background: `rgba(200,168,75,0.12)`, border: `1.5px solid ${gold}44`, color: gold };
    return { background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMid };
  };

  return (
    <div style={{ paddingBottom: 48, fontFamily: "'Cairo', sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageBanner
        eyebrow={t('salat_extra.prophet_said')}
        title="Salat Tracker"
        subtitle={t('salat_extra.hadith_text')}
      />

      <div>
      {/* ── TODAY + STREAK ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 16, marginBottom: 16 }}>

        {/* Today's prayers */}
        <div style={glass({ padding: '24px 26px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
                {t('salat_extra.today_label')}
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800, color: gold, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>
                {completedCount}/5
              </p>
              <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>{t('salat_extra.completed_count')}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ height: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 4 }}>
              <div style={{
                width: `${(completedCount / 5) * 100}%`, height: '100%',
                background: `linear-gradient(90deg, ${gold}, ${C.green})`,
                borderRadius: 4, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

          {/* Prayer rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {PRAYERS.map((name) => {
              const time = apiTimings?.[name] ?? '--:--';
              const recorded = todayRecord[name];
              const displayStatus: PrayerStatus = recorded || 'pending';
              const isCurrent = currentPrayer === name && !recorded;
              const ss = statusStyle(displayStatus, isCurrent);

              return (
                <div key={name} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                  borderRadius: 14,
                  background: isCurrent
                    ? (isDark ? 'rgba(200,168,75,0.07)' : 'rgba(200,168,75,0.05)')
                    : (isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.018)'),
                  border: `1px solid ${isCurrent ? gold + '33' : C.border}`,
                  transition: 'all 0.2s',
                }}>
                  {/* Arabic name */}
                  <p style={{
                    margin: 0, width: 52, fontFamily: "'Cairo', sans-serif",
                    fontSize: 22, color: isCurrent ? gold : C.textDark, lineHeight: 1, textAlign: 'right',
                  }}>
                    {PRAYER_ARABIC[name]}
                  </p>

                  {/* Latin name */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
                        {name}
                      </p>
                      {isCurrent && (
                        <span style={{
                          fontSize: 9, background: gold, color: '#0D1810',
                          padding: '2px 8px', borderRadius: 30, fontWeight: 800, letterSpacing: '0.08em',
                        }}>
                          {t('salat_extra.in_progress')}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: 10.5, color: C.textLight }}>{PRAYER_SUBTITLES[name]}</p>
                  </div>

                  {/* Time */}
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isCurrent ? gold : C.textDark, fontVariantNumeric: 'tabular-nums', minWidth: 44 }}>
                    {time}
                  </p>

                  {/* Status toggle */}
                  <button
                    onClick={() => togglePrayer(name)}
                    style={{
                      padding: '6px 13px', borderRadius: 30, cursor: 'pointer',
                      fontSize: 11, fontWeight: 700, transition: 'all 0.2s', whiteSpace: 'nowrap',
                      minWidth: 90, textAlign: 'center', ...ss,
                    }}
                  >
                    {displayStatus === 'done' ? t('salat_extra.done') : displayStatus === 'missed' ? t('salat_extra.missed_status') : t('salat_extra.pending')}
                  </button>
                </div>
              );
            })}
          </div>

          <p style={{ margin: '14px 0 0', fontSize: 11, color: C.textLight, textAlign: 'right' }}>
            {now.getHours().toString().padStart(2,'0')}:{now.getMinutes().toString().padStart(2,'0')}
            <span onClick={() => navigate('horaires')} style={{ marginLeft: 12, color: gold, cursor: 'pointer', fontWeight: 600 }}>
              {t('salat_extra.see_schedules')}
            </span>
          </p>
        </div>

        {/* Streak card */}
        <div style={{ ...glass({ padding: '26px 22px' }), display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={0.05} />
          <div style={{ position: 'relative', width: '100%' }}>
            <p style={{ margin: '0 0 16px', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.textLight, fontWeight: 700 }}>
              {t('salat_extra.my_streak')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <ProgressRing value={streak} total={Math.max(streak, 30)} color={gold} size={130} days={t('salat_extra.days_label')} />
            </div>

            {/* Verse */}
            <p style={{
              margin: '0 0 4px', textAlign: 'center',
              fontFamily: "'Cairo', sans-serif", fontSize: 16,
              color: isDark ? goldLight : '#1B3022', direction: 'rtl',
            }}>
              وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 10.5, color: C.textMid, textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
              {t('salat_extra.verse_patience')}
            </p>

            <div style={{ width: '100%', height: 1, background: isDark ? 'rgba(200,168,75,0.1)' : 'rgba(200,168,75,0.2)', margin: '0 0 14px' }} />

            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '10px 14px',
              background: isDark ? 'rgba(200,168,75,0.05)' : 'rgba(200,168,75,0.06)',
              border: `1px solid rgba(200,168,75,0.15)`, borderRadius: 12,
            }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textLight, fontWeight: 700 }}>{t('salat_extra.best_record')}</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: gold, fontFamily: "'Cairo', sans-serif" }}>
                  {bestStreak} <span style={{ fontSize: 12, fontWeight: 400 }}>{t('salat_extra.days_label')}</span>
                </p>
              </div>
              <svg width="28" height="28" viewBox="0 0 20 20">
                <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Weekly bar chart */}
        <div style={glass({ padding: '22px 24px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
              {t('salat_extra.weekly_title')}
            </h3>
            <span style={{ fontSize: 10.5, color: C.textLight }}>{t('salat_extra.percent_prayers')}</span>
          </div>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <Bar
              data={{
                labels: weeklyData.map(d => d.label),
                datasets: [{
                  data: weeklyData.map(d => d.value),
                  backgroundColor: weeklyData.map(d =>
                    d.value === 100 ? gold : d.value >= 60 ? C.green : (isDark ? 'rgba(200,168,75,0.15)' : 'rgba(200,168,75,0.2)')
                  ),
                  borderRadius: 8, borderSkipped: false,
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } } },
                scales: {
                  y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%`, color: C.textLight, font: { family: "'Cairo', sans-serif", size: 10 } }, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' } },
                  x: { ticks: { color: C.textMid, font: { family: "'Cairo', sans-serif", size: 11 } }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Monthly heatmap */}
        <div style={glass({ padding: '22px 24px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
              {t('salat_extra.month_overview')}
            </h3>
            <span style={{ fontSize: 10.5, color: C.textLight }}>
              {new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 5 }}>
            {['L','M','M','J','V','S','D'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 9.5, color: C.textLight, fontWeight: 600 }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {Array.from({ length: (new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() + 6) % 7 }).map((_, i) => (
              <div key={`off-${i}`} />
            ))}
            {monthlyData.map(({ day, done, isFuture }) => (
              <div key={day} title={isFuture ? '' : `${day}: ${done}/5`} style={{
                aspectRatio: '1', borderRadius: 4,
                background: heatColor(done, isFuture),
                border: `1px solid ${isDark ? 'rgba(200,168,75,0.06)' : 'rgba(200,168,75,0.08)'}`,
                opacity: isFuture ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 600,
                color: done >= 3 && !isFuture ? 'rgba(255,255,255,0.85)' : C.textLight,
                cursor: isFuture ? 'default' : 'pointer',
                transition: 'transform 0.15s',
              }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { color: heatColor(0, false), label: t('salat_extra.legend_none') },
              { color: heatColor(2, false), label: t('salat_extra.legend_partial') },
              { color: heatColor(4, false), label: t('salat_extra.legend_good') },
              { color: C.green,              label: t('salat_extra.legend_complete') },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: `1px solid rgba(200,168,75,0.1)` }} />
                <span style={{ fontSize: 9.5, color: C.textLight }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SUNNAH ──────────────────────────────────────────────── */}
      <div style={glass({ padding: '22px 24px', fontFamily: "'Cairo', sans-serif" })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <svg width="12" height="12" viewBox="0 0 20 20">
            <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
          </svg>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
            {t('salat_extra.sunnah_title')}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {SUNNAH_PRAYERS.map(({ key, label, arabic, total }) => {
            const done = sunnahDone[key];
            const pct = Math.round((done / total) * 100);
            return (
              <div key={key} style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : '#faf8f3',
                border: `1px solid ${C.border}`, borderRadius: 16,
                padding: '20px 18px', textAlign: 'center',
                fontFamily: "'Cairo', sans-serif",
              }}>
                <p style={{ margin: '0 0 2px', fontFamily: "'Cairo', sans-serif", fontSize: 22, color: isDark ? goldLight : '#1B3022', direction: 'rtl' }}>
                  {arabic}
                </p>
                <p style={{ margin: '0 0 2px', fontSize: 12.5, fontWeight: 600, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>{label}</p>
                <p style={{ margin: '0 0 14px', fontSize: 10.5, color: C.textLight, fontFamily: "'Cairo', sans-serif" }}>{done}/{total} {t('salat_extra.completed_plural')}</p>

                <div style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${gold}, ${C.green})`, borderRadius: 3, transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: gold, fontFamily: "'Cairo', sans-serif" }}>{pct}%</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <button
                    onClick={() => setSunnahDone(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }))}
                    disabled={done === 0}
                    style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${C.border}`, background: 'transparent', cursor: done === 0 ? 'not-allowed' : 'pointer', color: C.textMid, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: done === 0 ? 0.4 : 1 }}>
                    −
                  </button>
                  <button
                    onClick={() => setSunnahDone(p => ({ ...p, [key]: Math.min(total, p[key] + 1) }))}
                    disabled={done === total}
                    style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: `linear-gradient(135deg, ${gold}, #A8882A)`, cursor: done === total ? 'not-allowed' : 'pointer', color: '#0D1810', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: done === total ? 0.5 : 1, fontWeight: 700 }}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
