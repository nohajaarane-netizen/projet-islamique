import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { QiblaCompass as CompassIcon } from '../components/layout/QiblaCompass';

export default function Qibla() {
    const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [azimuth, setAzimuth] = useState(245); // direction fixe pour démo
  const [heading, setHeading] = useState(0);
  const [support, setSupport] = useState(true);

  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      setSupport(false);
    }
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.webkitCompassHeading !== undefined) {
      setHeading(event.webkitCompassHeading);
    } else if (event.alpha) {
      setHeading(360 - event.alpha);
    }
  };

  const diff = (azimuth - heading + 360) % 360;
  const direction = diff < 22.5 ? '⬆️ Nord' : diff < 67.5 ? '↗️ Nord-Est' : diff < 112.5 ? '➡️ Est' : diff < 157.5 ? '↘️ Sud-Est' : diff < 202.5 ? '⬇️ Sud' : diff < 247.5 ? '↙️ Sud-Ouest' : diff < 292.5 ? '⬅️ Ouest' : diff < 337.5 ? '↖️ Nord-Ouest' : '⬆️ Nord';

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>Boussole Qibla</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Trouvez la direction de la Kaaba.</p>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <CompassIcon />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(diff)}°</p>
          <p style={{ fontSize: 18, color: C.green }}>{direction}</p>
        </div>

        <p style={{ fontSize: 12, color: C.textLight }}>Tournez votre appareil pour que l'aiguille verte pointe vers le sud-ouest (245°).</p>
        {!support && <p style={{ color: 'red' }}>Orientation non supportée sur ce navigateur.</p>}
      </div>
    </div>
  );
}