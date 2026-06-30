import { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { lightTheme, darkTheme } from '../theme/colors';
import PageBanner from '../components/layout/PageBanner';

type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
const PRAYERS: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PRAYER_ARABIC: Record<PrayerKey, string> = {
  Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};

const PRAYER_EN: Record<PrayerKey, string> = {
  Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha',
};

function IslamicPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip-regl" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,2 38,18 56,18 42,30 48,48 30,38 12,48 18,30 4,18 22,18" fill="none" stroke="#C8A84B" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip-regl)" />
    </svg>
  );
}

function SvgGlobe({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function SvgBell({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function SvgMoon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function SvgSun({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function SvgDatabase({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function Toggle({ checked, onChange, green }: { checked: boolean; onChange: () => void; green: string }) {
  return (
    <div role="switch" aria-checked={checked} onClick={onChange}
      style={{ width: 48, height: 26, borderRadius: 13, background: checked ? green : '#c5c5c5', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.25s' }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s' }} />
    </div>
  );
}

export default function Reglages() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isAr = language === 'ar';

  const [name, setName]       = useState(() => localStorage.getItem('userName') || '');
  const [email, setEmail]     = useState(() => localStorage.getItem('userEmail') || '');
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('fontSize') || 16));
  const [prayerNotifs, setPrayerNotifs] = useState<Record<PrayerKey, boolean>>(() => {
    const result = {} as Record<PrayerKey, boolean>;
    PRAYERS.forEach((p) => { result[p] = localStorage.getItem(`notif_${p}`) !== 'false'; });
    return result;
  });

  useEffect(() => { localStorage.setItem('userName', name); }, [name]);
  useEffect(() => { localStorage.setItem('userEmail', email); }, [email]);
  useEffect(() => {
    localStorage.setItem('fontSize', String(fontSize));
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const togglePrayer = (prayer: PrayerKey) => {
    const next = { ...prayerNotifs, [prayer]: !prayerNotifs[prayer] };
    setPrayerNotifs(next);
    localStorage.setItem(`notif_${prayer}`, String(next[prayer]));
  };

  const handleReset = () => {
    const confirmed = window.confirm(t('reglages.reset_confirm'));
    if (confirmed) { localStorage.clear(); window.location.reload(); }
  };

  const getPrayerLabel = (p: PrayerKey) => isAr ? PRAYER_ARABIC[p] : language === 'en' ? PRAYER_EN[p] : p;

  const card = (extra?: CSSProperties): CSSProperties => ({
    background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 20,
    boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.32)',
    padding: '28px 28px', marginBottom: 18, ...extra,
  });

  const sectionLabel = (alignRight = false): CSSProperties => ({
    fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 1.8,
    color: C.gold, fontWeight: 700, marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 8,
    justifyContent: alignRight ? 'flex-end' : 'flex-start',
    textAlign: alignRight ? 'right' : 'left',
  });

  const inputStyle: CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12, border: `1px solid ${C.border}`,
    background: C.cardBg2, color: C.textDark, fontSize: 15,
    fontFamily: "'Cairo', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <PageBanner
        title={t('reglages.title')}
        subtitle={t('reglages.personalize')}
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '8px 0 40px' }}>

        {/* ── PROFIL ───────────────────────────────────────────────────────── */}
        <div className="interactive-card" style={card()}>
          <div style={sectionLabel(true)}>
            {t('reglages.profile')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22 }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, #4A9468)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
              fontFamily: "'Cairo', sans-serif", letterSpacing: 1, boxShadow: `0 4px 16px ${C.green}44`,
            }}>{initials || 'U'}</div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {t('reglages.name_label')}
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" style={inputStyle} />
          </div>
        </div>

        {/* ── LANGUE ───────────────────────────────────────────────────────── */}
        <div className="interactive-card" style={card()}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: C.gold, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SvgGlobe color={C.gold} size={14} />
            {t('reglages.language')}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['fr', 'en', 'ar'] as const).map((lang) => {
              const active = language === lang;
              return (
                <button key={lang} onClick={() => setLanguage(lang)}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 14,
                    border: `2px solid ${active ? C.green : C.border}`,
                    background: active ? `${C.green}1a` : C.cardBg2,
                    color: active ? C.green : C.textMid,
                    fontWeight: active ? 700 : 500,
                    fontSize: lang === 'ar' ? 16 : 14,
                    cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── NOTIFICATIONS ────────────────────────────────────────────────── */}
        <div className="interactive-card" style={card()}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: C.gold, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SvgBell color={C.gold} size={14} />
            {t('reglages.prayer_notifs')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PRAYERS.map((prayer, idx) => (
              <div key={prayer} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: idx < PRAYERS.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <span style={{
                  color: C.textDark, fontSize: isAr ? 18 : 15, fontWeight: 500,
                  fontFamily: "'Cairo', sans-serif",
                }}>
                  {getPrayerLabel(prayer)}
                </span>
                <Toggle checked={prayerNotifs[prayer]} onChange={() => togglePrayer(prayer)} green={C.green} />
              </div>
            ))}
          </div>
        </div>

        {/* ── APPARENCE ────────────────────────────────────────────────────── */}
        <div className="interactive-card" style={card()}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: C.gold, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            {theme === 'dark' ? <SvgMoon color={C.gold} size={14} /> : <SvgSun color={C.gold} size={14} />}
            {t('reglages.appearance')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
            <div>
              <p style={{ margin: '0 0 2px', color: C.textDark, fontWeight: 500, fontSize: 15 }}>
                {t('reglages.dark_mode_label')}
              </p>
              <p style={{ margin: 0, color: C.textLight, fontSize: 13 }}>
                {theme === 'dark' ? t('reglages.dark_mode_on') : t('reglages.dark_mode_off')}
              </p>
            </div>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} green={C.green} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ margin: 0, color: C.textDark, fontWeight: 500, fontSize: 15 }}>
                {t('reglages.text_size')}
              </p>
              <span style={{ fontSize: 13, color: C.textMid, background: C.cardBg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '3px 10px' }}>
                {fontSize}px
              </span>
            </div>
            <input type="range" min={13} max={20} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.green, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textLight, marginTop: 4 }}>
              <span>{t('reglages.text_small')}</span>
              <span>{t('reglages.text_large')}</span>
            </div>
          </div>
        </div>

        {/* ── DONNÉES ──────────────────────────────────────────────────────── */}
        <div className="interactive-card" style={card()}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: C.gold, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SvgDatabase color={C.gold} size={14} />
            {t('reglages.data')}
          </div>
          <p style={{ color: C.textMid, fontSize: 14, margin: '0 0 20px', lineHeight: 1.7 }}>
            {t('reglages.data_desc')}
          </p>
          <button onClick={handleReset}
            style={{
              background: 'linear-gradient(135deg, #c0392b, #e74c3c)', border: 'none', borderRadius: 12,
              padding: '13px 24px', color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
              width: '100%', letterSpacing: 0.3, transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e)  => (e.currentTarget.style.opacity = '1')}
          >
            {t('reglages.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}
