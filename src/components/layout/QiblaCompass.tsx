import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme, darkTheme } from '../../theme/colors';

// Minimal inline compass used in the Accueil dashboard widget
const QiblaCompass: React.FC = () => {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!('deviceorientation' in window)) return;
    const handler = (e: DeviceOrientationEvent) => {
      const h = (e as any).webkitCompassHeading ?? (e.alpha !== null ? 360 - e.alpha : null);
      if (h !== null) setHeading(h);
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  const QIBLA = 245;
  const needle = heading !== null ? (QIBLA - heading + 360) % 360 : QIBLA;
  const cx = 50, cy = 50, r = 42;

  return (
    <svg width={90} height={90} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill={C.cardBg2} stroke={C.border} strokeWidth={1.5} />
      {['N','E','S','W'].map((l, i) => {
        const a = i * 90 * Math.PI / 180;
        return (
          <text key={l}
            x={cx + 30 * Math.sin(a)} y={cy - 30 * Math.cos(a) + 4}
            textAnchor="middle" fontSize={8} fontWeight={700}
            fill={l === 'N' ? '#c0392b' : C.textLight}
          >{l}</text>
        );
      })}
      {/* Gold needle */}
      <line
        x1={cx} y1={cy}
        x2={cx + 28 * Math.sin(needle * Math.PI / 180)}
        y2={cy - 28 * Math.cos(needle * Math.PI / 180)}
        stroke={C.gold} strokeWidth={2} strokeLinecap="round"
        style={{ transition: 'all 0.2s ease' }}
      />
      <circle cx={cx} cy={cy} r={4} fill={C.green} />
    </svg>
  );
};

export default QiblaCompass;
