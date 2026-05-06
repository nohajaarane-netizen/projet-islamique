
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme, darkTheme } from '../../theme/colors';

const QiblaCompass: React.FC = () => {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [direction, setDirection] = useState<number | null>(null);

  useEffect(() => {
    if ('deviceorientation' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDirection(event.alpha);
        }
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  return (
    <div style={{
      background: C.cardBg,
      color: C.textDark,
      padding: '1rem',
      borderRadius: '12px',
      textAlign: 'center',
      border: `1px solid ${C.border}`
    }}>
      <h3>🧭 Qibla</h3>
      {direction !== null ? (
        <p>Direction : {Math.round(direction)}°</p>
      ) : (
        <p>🌐 Orientation non disponible</p>
      )}
      <div style={{ fontSize: '3rem' }}>🕋</div>
    </div>
  );
};

export default QiblaCompass;