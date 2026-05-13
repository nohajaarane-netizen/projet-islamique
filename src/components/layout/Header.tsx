import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';
import { FaUserCircle, FaBars, FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const LANGS = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'عربي' },
] as const;

const IconSun = ({ color, size = 16 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" fill={color} />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="23" />
    <line x1="1" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="23" y2="12" />
    <line x1="4.2" y1="4.2" x2="6.5" y2="6.5" />
    <line x1="17.5" y1="17.5" x2="19.8" y2="19.8" />
    <line x1="4.2" y1="19.8" x2="6.5" y2="17.5" />
    <line x1="17.5" y1="6.5" x2="19.8" y2="4.2" />
  </svg>
);

const IconMoon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" fill={color} />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userName = localStorage.getItem('userName') || 'User';

  const currentLang = LANGS.find(l => l.code === language) ?? LANGS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      backgroundColor: C.headerBg,
      color: C.textDark,
      padding: '0 1.5rem',
      height: 58,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${C.border}`,
      boxShadow: isDark
        ? '0 1px 0 rgba(100,160,255,0.06), 0 4px 24px rgba(0,0,0,0.35)'
        : '0 1px 6px rgba(0,0,0,0.06)',
      gap: 10,
      position: 'sticky',
      top: 0,
      zIndex: 200,
      backdropFilter: 'blur(12px)',
      fontFamily: "'Cairo', sans-serif",
    }}>

      {/* Left: hamburger only */}
      <button
        type="button"
        className="hamburger-btn"
        onClick={onMenuToggle}
        style={{
          color: C.textDark,
          fontSize: 19,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        aria-label="Menu"
      >
        <FaBars />
      </button>

      {/* Right: language dropdown + theme + user */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setLangOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: isDark ? 'rgba(52,88,63,0.08)' : 'rgba(40,100,68,0.05)',
              border: `1px solid ${C.border}`,
              borderRadius: 30,
              padding: '6px 14px 6px 10px',
              cursor: 'pointer',
              color: C.textDark,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Cairo', sans-serif",
              transition: 'all 0.22s',
              outline: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.green;
              e.currentTarget.style.background = isDark ? 'rgba(52,88,63,0.16)' : 'rgba(40,100,68,0.10)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.background = isDark ? 'rgba(52,88,63,0.08)' : 'rgba(40,100,68,0.05)';
            }}
          >
            <FaGlobe style={{ color: C.green, fontSize: 13 }} />
            <span>{currentLang.short}</span>
            <FaChevronDown style={{
              fontSize: 9,
              color: C.textMid,
              transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.22s',
            }} />
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: isDark ? C.cardBg : '#FFFFFF',
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              boxShadow: isDark
                ? '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,88,63,0.12)'
                : '0 8px 32px rgba(0,0,0,0.12)',
              minWidth: 170,
              zIndex: 999,
              overflow: 'hidden',
              animation: 'scaleIn 0.18s ease',
            }}>
              {LANGS.map((lang, i) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 16px',
                    background: language === lang.code
                      ? (isDark ? 'rgba(52,88,63,0.16)' : 'rgba(40,100,68,0.07)')
                      : 'transparent',
                    border: 'none',
                    borderBottom: i < LANGS.length - 1 ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer',
                    color: language === lang.code ? C.green : C.textDark,
                    fontSize: 13.5,
                    fontWeight: language === lang.code ? 700 : 500,
                    fontFamily: "'Cairo', sans-serif",
                    textAlign: 'left',
                    transition: 'background 0.15s',
                    letterSpacing: lang.code === 'ar' ? '0.01em' : undefined,
                  }}
                  onMouseEnter={e => {
                    if (language !== lang.code)
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                  }}
                  onMouseLeave={e => {
                    if (language !== lang.code)
                      e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <FaCheck style={{ marginLeft: 'auto', color: C.green, fontSize: 11 }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: isDark ? 'rgba(52,88,63,0.12)' : 'rgba(201,160,61,0.12)',
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: '10px 14px',
            cursor: 'pointer',
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            color: C.textDark,
            transition: 'all 0.25s',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.16)' : '0 4px 20px rgba(200,160,60,0.12)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = C.green;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <IconMoon color={C.greenLight} />
            : <IconSun color={C.gold} />}
        </button>

        {/* User */}
        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 14px 5px 9px',
            background: isDark ? 'rgba(100,160,255,0.06)' : C.cardBg2,
            borderRadius: 30,
            border: `1px solid ${C.border}`,
            cursor: 'pointer',
            transition: 'all 0.22s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
          aria-label="User profile"
        >
          <FaUserCircle style={{ fontSize: 19, color: C.green }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
            {userName}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
