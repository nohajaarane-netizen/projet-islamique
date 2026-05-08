import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';
import { FaMoon, FaSun, FaMosque, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;

  return (
    <header style={{ 
      backgroundColor: C.headerBg,
      color: C.textDark,
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${C.border}`,
      boxShadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FaMosque style={{ fontSize: '22px', color: C.gold }} />
        <h1 style={{ margin: 0, fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: '-0.5px' }}>NOUR</h1>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['fr', 'en', 'ar'] as const).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} style={{
              background: language === lang ? C.green : 'transparent',
              color: language === lang ? 'white' : C.textDark,
              border: `1px solid ${C.border}`,
              borderRadius: '30px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: language === lang ? 600 : 400,
              transition: 'all 0.2s'
            }}>
              {lang === 'fr' ? 'FR' : lang === 'en' ? 'EN' : 'عربي'}
            </button>
          ))}
        </div>
        <button onClick={toggleTheme} style={{
          background: 'transparent',
          border: `1px solid ${C.border}`,
          borderRadius: '30px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          color: C.textDark
        }}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 8px', background: C.cardBg2, borderRadius: '30px', border: `1px solid ${C.border}` }}>
          <FaUserCircle style={{ fontSize: '20px', color: C.green }} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Mohamed</span>
        </div>
      </div>
    </header>
  );
};

export default Header;