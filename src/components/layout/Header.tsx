import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';
import { FaMoon, FaSun, FaUserCircle, FaBars } from 'react-icons/fa';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;

  return (
    <header style={{
      backgroundColor: C.headerBg,
      color: C.textDark,
      padding: '0.6rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${C.border}`,
      boxShadow: theme === 'light' ? '0 1px 6px rgba(0,0,0,0.04)' : 'none',
      gap: 10,
      flexWrap: 'wrap',
    }}>
      {/* Left: hamburger (mobile only) + NOUR brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          style={{ color: C.textDark, fontSize: 18 }}
          aria-label="Menu"
        >
          <FaBars />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Inline SVG Islamic star */}
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="hdrGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F0D070" />
                <stop offset="100%" stopColor="#B8922A" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="17" fill="rgba(184,146,42,0.12)" stroke="rgba(240,208,112,0.5)" strokeWidth="1" />
            <polygon
              points="18,5 20.1,12.9 27.2,8.8 23.1,15.9 31,18 23.1,20.1 27.2,27.2 20.1,23.1 18,31 15.9,23.1 8.8,27.2 12.9,20.1 5,18 12.9,15.9 8.8,8.8 15.9,12.9"
              fill="url(#hdrGrad)"
            />
            <circle cx="18" cy="18" r="4.5" fill={C.headerBg} />
            <circle cx="18" cy="18" r="2" fill="url(#hdrGrad)" />
          </svg>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.05em', color: C.textDark }}>
            NOUR
          </h1>
        </div>
      </div>

      {/* Right: language + theme + user */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['fr', 'en', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                background: language === lang ? C.green : 'transparent',
                color: language === lang ? '#FFF' : C.textMid,
                border: `1px solid ${language === lang ? C.green : C.border}`,
                borderRadius: 30,
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: 11.5,
                fontWeight: language === lang ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {lang === 'fr' ? 'FR' : lang === 'en' ? 'EN' : 'عربي'}
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 30,
            padding: '5px 11px',
            cursor: 'pointer',
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            color: C.textDark,
            transition: 'all 0.2s',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon style={{ color: C.green }} /> : <FaSun style={{ color: C.gold }} />}
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '4px 12px 4px 8px',
          background: C.cardBg2, borderRadius: 30,
          border: `1px solid ${C.border}`,
        }}>
          <FaUserCircle style={{ fontSize: 19, color: C.green }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: C.textDark }}>Mohamed</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
