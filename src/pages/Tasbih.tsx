import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

export default function Tasbih() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [count, setCount] = useState(0);

  // Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasbih-count');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(parseInt(saved));
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('tasbih-count', count.toString());
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  // Animation du bouton +1
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleIncrement = () => {
    increment();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  // Textes selon la langue
  const texts = {
    fr: {
      title: '📿 Tasbih',
      subtitle: 'Compteur de dhikr',
      counter: 'COMPTEUR',
      increment: '+1',
      decrement: '-1',
      reset: 'Remettre à zéro',
      reminder: '💡 Subhanallah (33x) · Alhamdulillah (33x) · Allahu Akbar (34x)'
    },
    en: {
      title: '📿 Tasbih',
      subtitle: 'Dhikr counter',
      counter: 'COUNTER',
      increment: '+1',
      decrement: '-1',
      reset: 'Reset',
      reminder: '💡 Subhanallah (33x) · Alhamdulillah (33x) · Allahu Akbar (34x)'
    },
    ar: {
      title: '📿 التسبيح',
      subtitle: 'عداد الأذكار',
      counter: 'العداد',
      increment: '+١',
      decrement: '-١',
      reset: 'إعادة ضبط',
      reminder: '💡 سبحان الله (٣٣) · الحمد لله (٣٣) · الله أكبر (٣٤)'
    }
  };

  const t = texts[language];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: theme === 'light' 
        ? 'radial-gradient(circle at 10% 20%, rgba(255,255,255,1) 0%, rgba(245,250,240,1) 50%, rgba(235,245,230,1) 100%)'
        : 'radial-gradient(circle at 10% 20%, #1a2a1a 0%, #0d1a0d 50%, #0a150a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Motifs décoratifs en arrière-plan */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme === 'light' ? 0.4 : 0.1,
        pointerEvents: 'none'
      }}>
        {/* Motif de losanges/carreaux islamiques */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamicPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#8FBC6E" strokeWidth="0.8" opacity="0.3"/>
              <circle cx="30" cy="30" r="8" fill="#8FBC6E" opacity="0.15"/>
              <circle cx="0" cy="0" r="4" fill="#6B8E4E" opacity="0.1"/>
              <circle cx="60" cy="0" r="4" fill="#6B8E4E" opacity="0.1"/>
              <circle cx="0" cy="60" r="4" fill="#6B8E4E" opacity="0.1"/>
              <circle cx="60" cy="60" r="4" fill="#6B8E4E" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicPattern)" />
        </svg>
      </div>

      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Titre de la page */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: theme === 'light' ? '#5A7A3A' : '#9BC47A',
            margin: 0,
            letterSpacing: '1px',
            textShadow: theme === 'light' ? 'none' : '0 0 10px rgba(155,196,122,0.3)'
          }}>
            {t.title}
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: theme === 'light' ? '#6B8E4E' : '#8FBC6E',
            marginTop: '8px',
            marginBottom: 0
          }}>
            {t.subtitle}
          </p>
          <div style={{
            width: '60px',
            height: '3px',
            background: `linear-gradient(90deg, ${theme === 'light' ? '#8FBC6E' : '#6B8E4E'}, ${theme === 'light' ? '#5A7A3A' : '#9BC47A'})`,
            margin: '12px auto 0',
            borderRadius: '3px'
          }} />
        </div>

        {/* Carte principale */}
        <div style={{
          background: theme === 'light' 
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(26,42,26,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '32px',
          border: `1px solid ${theme === 'light' ? 'rgba(143,188,110,0.3)' : 'rgba(107,142,78,0.3)'}`,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: theme === 'light' 
            ? '0 20px 40px rgba(90,122,58,0.15), 0 0 0 1px rgba(143,188,110,0.1)'
            : '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(107,142,78,0.2)',
          transition: 'transform 0.2s'
        }}>
          {/* Label du compteur */}
          <p style={{
            fontSize: '11px',
            color: theme === 'light' ? '#8FBC6E' : '#9BC47A',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '20px',
            fontWeight: 600
          }}>
            {t.counter}
          </p>

          {/* Chiffre avec animation */}
          <div style={{
            fontSize: '110px',
            fontWeight: 'bold',
            color: theme === 'light' ? '#5A7A3A' : '#D4E8C0',
            marginBottom: '40px',
            fontFamily: 'monospace',
            textShadow: theme === 'light' 
              ? '2px 2px 10px rgba(90,122,58,0.2)' 
              : '0 0 20px rgba(155,196,122,0.3)',
            transition: 'all 0.2s ease',
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)'
          }}>
            {count}
          </div>

          {/* Boutons +1 et -1 */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleIncrement}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(135deg, #8FBC6E 0%, #5A7A3A 100%)'
                  : 'linear-gradient(135deg, #6B8E4E 0%, #3D5A2B 100%)',
                border: 'none',
                borderRadius: '60px',
                padding: '16px 36px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                cursor: 'pointer',
                minWidth: '130px',
                transition: 'all 0.2s',
                boxShadow: theme === 'light'
                  ? '0 4px 15px rgba(143,188,110,0.4)'
                  : '0 4px 15px rgba(107,142,78,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(143,188,110,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme === 'light'
                  ? '0 4px 15px rgba(143,188,110,0.4)'
                  : '0 4px 15px rgba(107,142,78,0.3)';
              }}
            >
              {t.increment}
            </button>
            <button
              onClick={decrement}
              style={{
                background: theme === 'light'
                  ? 'rgba(143,188,110,0.15)'
                  : 'rgba(107,142,78,0.2)',
                border: `1px solid ${theme === 'light' ? '#8FBC6E' : '#6B8E4E'}`,
                borderRadius: '60px',
                padding: '16px 36px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: theme === 'light' ? '#5A7A3A' : '#D4E8C0',
                cursor: 'pointer',
                minWidth: '130px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'light'
                  ? 'rgba(143,188,110,0.25)'
                  : 'rgba(107,142,78,0.35)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme === 'light'
                  ? 'rgba(143,188,110,0.15)'
                  : 'rgba(107,142,78,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t.decrement}
            </button>
          </div>

          {/* Bouton Reset */}
          <button
            onClick={reset}
            style={{
              background: 'transparent',
              border: `1px solid ${theme === 'light' ? 'rgba(143,188,110,0.5)' : 'rgba(107,142,78,0.5)'}`,
              borderRadius: '40px',
              padding: '12px 24px',
              fontSize: '13px',
              color: theme === 'light' ? '#6B8E4E' : '#9BC47A',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme === 'light'
                ? 'rgba(143,188,110,0.1)'
                : 'rgba(107,142,78,0.15)';
              e.currentTarget.style.borderColor = theme === 'light' ? '#8FBC6E' : '#6B8E4E';
              e.currentTarget.style.color = theme === 'light' ? '#5A7A3A' : '#D4E8C0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = theme === 'light' ? 'rgba(143,188,110,0.5)' : 'rgba(107,142,78,0.5)';
              e.currentTarget.style.color = theme === 'light' ? '#6B8E4E' : '#9BC47A';
            }}
          >
            🔄 {t.reset}
          </button>
        </div>

        {/* Petit rappel décoré */}
        <div style={{
          marginTop: '24px',
          padding: '14px 20px',
          background: theme === 'light'
            ? 'linear-gradient(135deg, rgba(143,188,110,0.1) 0%, rgba(143,188,110,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(107,142,78,0.1) 0%, rgba(107,142,78,0.03) 100%)',
          borderRadius: '20px',
          borderLeft: `3px solid ${theme === 'light' ? '#8FBC6E' : '#6B8E4E'}`,
          textAlign: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <p style={{
            fontSize: '12px',
            color: theme === 'light' ? '#5A7A3A' : '#B8D4A0',
            margin: 0,
            lineHeight: 1.5
          }}>
            {t.reminder}
          </p>
        </div>

        {/* Petit conseil */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p style={{
            fontSize: '10px',
            color: theme === 'light' ? '#8FBC6E' : '#6B8E4E',
            margin: 0,
            opacity: 0.7
          }}>
            {language === 'fr' ? '🌟 Cliquez plusieurs fois pour compter vos dhikr' : 
             language === 'en' ? '🌟 Click multiple times to count your dhikr' : 
             '🌟 انقر عدة مرات لحساب أذكارك'}
          </p>
        </div>
      </div>
    </div>
  );
}