import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../../data/navItems';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../theme/colors';
import { useLanguage } from '../../hooks/useLanguage';
import {
  FaHome, FaClock, FaCheckSquare, FaCompass, FaBookOpen,
  FaLeaf, FaHeart, FaCloudSun, FaCalendarAlt,
  FaCog,
} from 'react-icons/fa';
import { GiPrayerBeads } from 'react-icons/gi';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const AllahIcon = () => (
  <span style={{
    fontFamily: "'Cairo', sans-serif",
    fontSize: '1.15em',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    الله
  </span>
);

const ICONS: Record<string, JSX.Element> = {
  accueil:       <FaHome />,
  horaires:      <FaClock />,
  salat:         <FaCheckSquare />,
  qibla:         <FaCompass />,
  asma:          <AllahIcon />,
  hadith:        <FaBookOpen />,
  alhamdulillah: <FaLeaf />,
  tasbih:        <GiPrayerBeads />,
  meteo:         <FaCloudSun />,
  favoris:       <FaHeart />,
  evenements:    <FaCalendarAlt />,
  reglages:      <FaCog />,
};

// ─── i18n key map for nav labels ──────────────────────────────────────────────

const NAV_I18N_KEYS: Record<string, string> = {
  accueil:       'nav_accueil',
  horaires:      'nav_horaires',
  salat:         'nav_salat',
  qibla:         'nav_qibla',
  asma:          'nav_asma',
  hadith:        'nav_hadith',
  alhamdulillah: 'nav_alhamdulillah',
  tasbih:        'nav_tasbih',
  meteo:         'nav_meteo',
  favoris:       'nav_favoris',
  evenements:    'nav_evenements',
  reglages:      'nav_reglages',
};

// ─── Sidebar separator after these ids ───────────────────────────────────────

const SEPARATORS_AFTER = new Set(['qibla', 'tasbih', 'evenements']);

// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const C = theme === 'light' ? lightTheme : darkTheme;


  return (
    <aside style={{
      width: 210,
      background: C.sidebar,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>

      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.06em', lineHeight: 1, fontFamily: "'Cairo', sans-serif" }}>NOUR</div>
            <div style={{ fontSize: 12, color: C.gold, fontFamily: "'Cairo', sans-serif", lineHeight: 1.3, opacity: 0.85 }}>نور</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        {NAV_ITEMS.map(({ id }) => {
          const active = activePage === id;
          const label  = NAV_I18N_KEYS[id] ? t(NAV_I18N_KEYS[id]) : id;
          const icon   = ICONS[id];

          return (
            <div key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                  ...(isRTL
                    ? { borderRight: `3px solid ${active ? C.gold : 'transparent'}`, borderLeft: 'none', textAlign: 'right' as const }
                    : { borderLeft: `3px solid ${active ? C.gold : 'transparent'}`, borderRight: 'none', textAlign: 'left' as const }
                  ),
                  color: active ? '#FFFFFF' : C.textSidebar,
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 400,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, opacity: active ? 1 : 0.75 }}>
                  {icon}
                </span>
                <span>{label}</span>
              </button>

              {SEPARATORS_AFTER.has(id) && (
                <div style={{ margin: '6px 16px', height: 1, background: C.sidebarBorder }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Rappel du jour */}
      <div style={{ margin: '0 12px 10px', padding: '12px 13px', background: 'rgba(255,255,255,0.06)', borderRadius: 9, border: `1px solid ${C.sidebarBorder}` }}>
        <p style={{ margin: '0 0 5px', fontSize: 9.5, color: C.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {t('common.daily_reminder')}
        </p>
        <p style={{ margin: '0 0 5px', fontSize: 11, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', lineHeight: 1.55 }}>
          {t('common.sidebar_reminder')}
        </p>
        <p style={{ margin: 0, fontSize: 10, color: C.textSidebar }}>Sahih Muslim (2677)</p>
      </div>

      {/* Donate */}
      <button
        type="button"
        onClick={() => {
          const message = language === 'ar'
            ? 'شكراً لدعمك NOUR!'
            : language === 'en'
              ? 'Thank you for supporting NOUR!'
              : 'Merci de soutenir NOUR!';
          window.alert(message);
        }}
        style={{
          margin: '0 12px 18px', padding: '8px', background: 'rgba(255,255,255,0.07)',
          border: `1px solid ${C.sidebarBorder}`, borderRadius: 8,
          color: C.textSidebar, fontSize: 11.5, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          transition: 'all 0.25s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <FaHeart style={{ fontSize: 11 }} />
        {t('common.donate')}
      </button>
    </aside>
  );
}
