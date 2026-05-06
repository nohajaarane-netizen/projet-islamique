import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme, darkTheme } from '../../theme/colors';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme() as { 
    theme: 'light' | 'dark'; 
    toggleTheme: () => void;
  };
  const C = theme === 'light' ? lightTheme : darkTheme;

  return (
    <header style={{ 
      backgroundColor: C.cardBg,
      color: C.textDark,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem' }}>🕌 Guide Islamique</h1>
      
      <button
        onClick={toggleTheme}
        style={{
          background: C.cardBg,
          color: C.textDark,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
      </button>
    </header>
  );
};

export default Header;