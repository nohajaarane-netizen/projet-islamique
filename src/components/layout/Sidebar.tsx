import { JSX } from 'react';
import { NAV_ITEMS } from '../../data/navItems';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';
import {
  FaHome, FaClock, FaCheckSquare, FaCompass, FaBookOpen,
  FaLeaf, FaHeart, FaCloudSun, FaCalendarAlt,
  FaCog,
} from 'react-icons/fa';
import { GiPrayerBeads } from 'react-icons/gi';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS: Record<string, JSX.Element> = {
  accueil:       <FaHome />,
  horaires:      <FaClock />,
  salat:         <FaCheckSquare />,
  qibla:         <FaCompass />,
  asma:          <FaBookOpen />,
  hadith:        <FaBookOpen />,
  alhamdulillah: <FaLeaf />,
  tasbih:        <GiPrayerBeads />,
  meteo:         <FaCloudSun />,
  favoris:       <FaHeart />,
  evenements:    <FaCalendarAlt />,
  reglages:      <FaCog />,
};

// ─── Labels per language ──────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  accueil:       { fr: 'Accueil',       en: 'Home',          ar: 'الرئيسية'     },
  horaires:      { fr: 'Horaires',      en: 'Prayer Times',  ar: 'الأوقات'      },
  salat:         { fr: 'SalatTracker',  en: 'SalatTracker',  ar: 'متابعة الصلاة' },
  qibla:         { fr: 'Qibla',         en: 'Qibla',         ar: 'القبلة'       },
  asma:          { fr: 'AsmaUlHusna',   en: 'AsmaUlHusna',   ar: 'الأسماء الحسنى'},
  hadith:        { fr: "Hadith & Du'a", en: "Hadith & Du'a", ar: 'الحديث والدعاء'},
  alhamdulillah: { fr: 'Alhamdulillah', en: 'Alhamdulillah', ar: 'الحمد لله'    },
  tasbih:        { fr: 'Tasbih',        en: 'Tasbih',        ar: 'التسبيح'      },
  meteo:         { fr: 'Météo',         en: 'Weather',       ar: 'الطقس'        },
  favoris:       { fr: 'Mes favoris',   en: 'Favorites',     ar: 'المفضلة'      },
  evenements:    { fr: 'Événements',    en: 'Events',        ar: 'المناسبات'    },
  reglages:      { fr: 'Réglages',      en: 'Settings',      ar: 'الإعدادات'    },
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
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;

  const reminderText: Record<string, string> = {
    fr: '« Allah a 99 noms, celui qui les connaît entrera au Paradis. »',
    en: '« Allah has 99 names, whoever memorizes them will enter Paradise. »',
    ar: '« إن لله تسعة وتسعين اسما، من أحصاها دخل الجنة »',
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* SVG 8-pointed Islamic star */}
          <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="sidebarStarGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F0D070" />
                <stop offset="100%" stopColor="#B8902A" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="17" fill="rgba(200,165,40,0.1)" stroke="rgba(240,208,100,0.35)" strokeWidth="1" />
            <polygon
              points="18,5 20.1,12.9 27.2,8.8 23.1,15.9 31,18 23.1,20.1 27.2,27.2 20.1,23.1 18,31 15.9,23.1 8.8,27.2 12.9,20.1 5,18 12.9,15.9 8.8,8.8 15.9,12.9"
              fill="url(#sidebarStarGrad)"
              opacity="0.88"
            />
            <circle cx="18" cy="18" r="4.5" fill={C.sidebar} />
            <circle cx="18" cy="18" r="2" fill="url(#sidebarStarGrad)" />
          </svg>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.06em', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>NOUR</div>
            <div style={{ fontSize: 12, color: C.gold, fontFamily: "'Amiri', serif", lineHeight: 1.3, opacity: 0.85 }}>نور</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        {NAV_ITEMS.map(({ id }) => {
          const active = activePage === id;
          const label  = LABELS[id]?.[language] ?? id;
          const icon   = ICONS[id];

          return (
            <div key={id}>
              <button
                onClick={() => onNavigate(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '9px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                  borderLeft: `3px solid ${active ? C.gold : 'transparent'}`,
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
          {language === 'ar' ? 'تذكير اليوم' : language === 'en' ? "Today's Reminder" : 'Rappel du jour'}
        </p>
        <p style={{ margin: '0 0 5px', fontSize: 11, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', lineHeight: 1.55 }}>
          {reminderText[language] ?? reminderText.fr}
        </p>
        <p style={{ margin: 0, fontSize: 10, color: C.textSidebar }}>Sahih Muslim (2677)</p>
      </div>

      {/* Donate */}
      <button style={{
        margin: '0 12px 18px', padding: '8px', background: 'rgba(255,255,255,0.07)',
        border: `1px solid ${C.sidebarBorder}`, borderRadius: 8,
        color: C.textSidebar, fontSize: 11.5, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      }}>
        <FaHeart style={{ fontSize: 11 }} />
        {language === 'ar' ? 'تبرع' : language === 'en' ? 'Donate' : 'Faire un don'}
      </button>
    </aside>
  );
}
