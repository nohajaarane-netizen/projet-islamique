import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { lightTheme, darkTheme } from '../theme/colors';
import CompassIcon from '../components/layout/QiblaCompass';

export default function Qibla() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [azimuth] = useState(245);
  const [heading, setHeading] = useState(0);
  const [support] = useState(() => !!window.DeviceOrientationEvent);

  useEffect(() => {
    if (!support) return;
    const handleOrientation = (event: Event) => {
      const e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (e.webkitCompassHeading !== undefined) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha) {
        setHeading(360 - e.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [support]);

  const diff = (azimuth - heading + 360) % 360;
  const direction =
    diff < 22.5 ? t('qibla.north') :
    diff < 67.5 ? t('qibla.north_east') :
    diff < 112.5 ? t('qibla.east') :
    diff < 157.5 ? t('qibla.south_east') :
    diff < 202.5 ? t('qibla.south') :
    diff < 247.5 ? t('qibla.south_west') :
    diff < 292.5 ? t('qibla.west') :
    diff < 337.5 ? t('qibla.north_west') : t('qibla.north');

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('qibla.title')}</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{t('qibla.subtitle')}</p>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <CompassIcon />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: C.textDark }}>{Math.round(diff)}°</p>
          <p style={{ fontSize: 18, color: C.green }}>{direction}</p>
        </div>
        <p style={{ fontSize: 12, color: C.textLight }}>{t('qibla.instruction')}</p>
        {!support && (
          <p style={{ color: 'red' }}>{t('qibla.unsupported')}</p>
        )}
      </div>
    </div>
  );
}