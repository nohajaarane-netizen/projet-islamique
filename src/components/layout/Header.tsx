import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';

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
    }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem' }}>🕌 Guide Islamique</h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['fr', 'en', 'ar'] as const).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} style={{
              background: language === lang ? C.green : 'transparent',
              color: language === lang ? 'white' : C.textDark,
              border: `1px solid ${C.border}`,
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: language === lang ? 600 : 400
            }}>
              {lang === 'fr' ? 'FR' : lang === 'en' ? 'EN' : 'عربي'}
            </button>
          ))}
        </div>
        <button onClick={toggleTheme} style={{
          background: C.cardBg,
          color: C.textDark,
          border: `1px solid ${C.border}`,
          borderRadius: '30px',
          padding: '6px 16px',
          cursor: 'pointer',
          fontSize: '14px',
        }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;