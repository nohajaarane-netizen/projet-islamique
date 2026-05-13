import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { lightTheme, darkTheme } from '../theme/colors';

const KAABA = { lat: 21.3891, lon: 39.8579 };

function toRad(deg: number) { return deg * Math.PI / 180; }

function calcQibla(lat: number, lon: number): number {
  const φ1 = toRad(lat), φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function calcDistance(lat1: number, lon1: number): number {
  const R = 6371;
  const φ1 = toRad(lat1), φ2 = toRad(KAABA.lat);
  const Δφ = toRad(KAABA.lat - lat1), Δλ = toRad(KAABA.lon - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function cardinalName(deg: number, lang: string): string {
  const dirs_fr = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
  const dirs_en = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const dirs_ar = ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'];
  const dirs = lang === 'en' ? dirs_en : lang === 'ar' ? dirs_ar : dirs_fr;
  return dirs[Math.round(deg / 45) % 8];
}

function IslamicPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip-qibla" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,2 38,18 56,18 42,30 48,48 30,38 12,48 18,30 4,18 22,18" fill="none" stroke="#C8A84B" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip-qibla)" />
    </svg>
  );
}

function SvgPin({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function SvgArrow({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
function SvgRefresh({ color, size = 12, spinning = false }: { color: string; size?: number; spinning?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: spinning ? 'spin 1s linear infinite' : 'none' }}>
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function Compass({ qiblaAngle, heading, size = 280, C }: {
  qiblaAngle: number; heading: number | null; size?: number; C: typeof lightTheme;
}) {
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 4, faceR = outerR - 44;
  const needleDeg = heading !== null ? (qiblaAngle - heading + 360) % 360 : qiblaAngle;
  const needleRad = toRad(needleDeg);
  const tipLen = outerR - 48, tailLen = 28, wingW = 7;
  const tip  = { x: cx + tipLen  * Math.sin(needleRad), y: cy - tipLen  * Math.cos(needleRad) };
  const tail = { x: cx - tailLen * Math.sin(needleRad), y: cy + tailLen * Math.cos(needleRad) };
  const perp = { x: Math.cos(needleRad) * wingW, y: Math.sin(needleRad) * wingW };
  const ticks = [];
  for (let d = 0; d < 360; d += 5) {
    const isMaj = d % 30 === 0, isMid = d % 10 === 0;
    const len = isMaj ? 13 : isMid ? 8 : 4, r = toRad(d);
    ticks.push(<line key={d} x1={cx + outerR * Math.sin(r)} y1={cy - outerR * Math.cos(r)} x2={cx + (outerR - len) * Math.sin(r)} y2={cy - (outerR - len) * Math.cos(r)} stroke={isMaj ? C.gold : C.border} strokeWidth={isMaj ? 1.5 : 0.8} opacity={isMaj ? 1 : 0.6} />);
  }
  const cardinals = [{ l: 'N', d: 0, c: '#c0392b', fs: 14 }, { l: 'E', d: 90, c: C.textMid, fs: 12 }, { l: 'S', d: 180, c: C.textMid, fs: 12 }, { l: 'W', d: 270, c: C.textMid, fs: 12 }];
  const intercardinals = [{ l: 'NE', d: 45 }, { l: 'SE', d: 135 }, { l: 'SW', d: 225 }, { l: 'NW', d: 315 }];
  const labelR = outerR - 20;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.5} />
      <circle cx={cx} cy={cy} r={outerR - 1} fill={C.cardBg} stroke={C.border} strokeWidth={0.5} />
      {ticks}
      {cardinals.map(({ l, d: deg, c, fs }) => { const r = toRad(deg); return <text key={l} x={cx + labelR * Math.sin(r)} y={cy - labelR * Math.cos(r) + fs / 3} textAnchor="middle" fill={c} fontSize={fs} fontWeight={700} fontFamily="'Cairo', sans-serif">{l}</text>; })}
      {intercardinals.map(({ l, d: deg }) => { const r = toRad(deg); return <text key={l} x={cx + labelR * Math.sin(r)} y={cy - labelR * Math.cos(r) + 4} textAnchor="middle" fill={C.textLight} fontSize={8} fontFamily="'Cairo', sans-serif">{l}</text>; })}
      <circle cx={cx} cy={cy} r={faceR} fill={C.cardBg2} stroke={C.border} strokeWidth={1} />
      <polygon points={`${tip.x},${tip.y} ${cx + perp.x},${cy + perp.y} ${tail.x},${tail.y} ${cx - perp.x},${cy - perp.y}`} fill={C.gold} style={{ filter: 'drop-shadow(0 2px 6px rgba(200,168,75,0.4))', transition: 'all 0.25s ease' }} />
      <polygon points={`${cx + perp.x},${cy + perp.y} ${tail.x},${tail.y} ${cx - perp.x},${cy - perp.y}`} fill={C.textLight} opacity={0.5} style={{ transition: 'all 0.25s ease' }} />
      <circle cx={cx} cy={cy} r={8} fill={C.green} />
      <circle cx={cx} cy={cy} r={3.5} fill="white" opacity={0.8} />
      <rect x={tip.x - 7} y={tip.y - 9} width={14} height={12} rx={2} fill={C.green} opacity={0.9} style={{ transition: 'all 0.25s ease' }} transform={`rotate(${needleDeg}, ${tip.x}, ${tip.y})`} />
      <line x1={tip.x - 5} y1={tip.y - 3} x2={tip.x + 5} y2={tip.y - 3} stroke="rgba(255,255,255,0.6)" strokeWidth={1} transform={`rotate(${needleDeg}, ${tip.x}, ${tip.y})`} />
    </svg>
  );
}

interface GeoState { lat: number; lon: number; city: string; qibla: number; distance: number; }

export default function Qibla() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isAr = language === 'ar';

  const [geo, setGeo]                   = useState<GeoState | null>(null);
  const [heading, setHeading]           = useState<number | null>(null);
  const [geoLoading, setGeoLoading]     = useState(true);
  const [geoError, setGeoError]         = useState('');
  const [sensorActive, setSensorActive] = useState(false);
  const [sensorError, setSensorError]   = useState('');
  const [useMyPos, setUseMyPos]         = useState(true);
  const [calibrating, setCalibrating]   = useState(false);

  const fetchGeo = useCallback(() => {
    setGeoLoading(true); setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const qibla = calcQibla(lat, lon), distance = calcDistance(lat, lon);
        let city = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json();
          city = data.address?.city || data.address?.town || data.address?.village || city;
        } catch { /* fallback */ }
        setGeo({ lat, lon, city, qibla, distance }); setGeoLoading(false);
      },
      () => {
        const lat = 33.2625, lon = -7.5898;
        setGeo({ lat, lon, city: 'Berrechid, Maroc', qibla: calcQibla(lat, lon), distance: calcDistance(lat, lon) });
        setGeoError(t('qibla_extra.default_pos'));
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  }, [t]);

  useEffect(() => { fetchGeo(); }, [fetchGeo]);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const h = (e as any).webkitCompassHeading ?? (e.alpha !== null ? (360 - e.alpha) : null);
    if (h !== null) setHeading(h);
  }, []);

  const startSensor = useCallback(async () => {
    setSensorError('');
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        if (state !== 'granted') { setSensorError(t('qibla_extra.permission_denied_msg')); return; }
      } catch { setSensorError(t('qibla_extra.permission_error_msg')); return; }
    }
    window.addEventListener('deviceorientation', handleOrientation);
    setSensorActive(true);
  }, [handleOrientation, t]);

  const stopSensor = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation);
    setSensorActive(false); setHeading(null);
  }, [handleOrientation]);

  useEffect(() => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission !== 'function') startSensor();
    return () => stopSensor();
  }, [startSensor, stopSensor]);

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 20,
    boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.32)',
    ...extra,
  });

  const qibla = geo?.qibla ?? 245;

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: '100vh', background: C.pageBg, direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage: `linear-gradient(160deg, rgba(10,26,18,0.82) 0%, rgba(20,50,32,0.70) 55%, rgba(12,32,22,0.82) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        padding: '34px 24px 30px', position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(200,168,75,0.2)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #C8A84B 20%, #E0C870 50%, #C8A84B 80%, transparent)' }} />
        <IslamicPattern />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
            <svg width="7" height="7" viewBox="0 0 20 20"><polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill="#C8A84B" /></svg>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
          </div>
          <div style={{ borderLeft: '3px solid rgba(200,168,75,0.75)', paddingLeft: 16 }}>
            <h1 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#F5F0E2', margin: '0 0 7px', letterSpacing: '-0.01em' }}>
              {t('qibla_extra.hero_title')}
            </h1>
            <p style={{ color: 'rgba(168,196,176,0.85)', fontSize: 13.5, margin: 0, maxWidth: 480 }}>
              {t('qibla_extra.hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── COMPASS CARD ─────────────────────────────────────────────────── */}
        <div style={{ ...card(), padding: '28px 32px', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 22, borderRadius: 11, background: useMyPos ? C.green : C.border, position: 'relative', cursor: 'pointer', transition: 'background 0.25s' }} onClick={() => setUseMyPos(v => !v)}>
                <div style={{ position: 'absolute', top: 3, left: useMyPos ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
              </div>
              <span style={{ fontSize: 12.5, color: C.textMid, display: 'flex', alignItems: 'center', gap: 6 }}>
                <SvgArrow color={C.green} size={11} />
                {t('qibla_extra.use_my_location')}
              </span>
            </div>
            <button onClick={() => { setCalibrating(true); setTimeout(() => setCalibrating(false), 2000); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.cardBg2, cursor: 'pointer', fontSize: 12.5, color: C.textMid, fontFamily: "'Cairo', sans-serif" }}>
              <SvgRefresh color={C.textLight} size={11} spinning={calibrating} />
              {t('qibla_extra.calibrate')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {geoLoading ? (
              <div style={{ width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTopColor: C.green, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <Compass qiblaAngle={qibla} heading={heading} size={280} C={C} />
            )}
            <div style={{ minWidth: 180, textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: 62, fontWeight: 800, color: C.green, lineHeight: 1, fontFamily: "'Cairo', sans-serif", letterSpacing: '-2px' }}>{Math.round(qibla)}°</p>
              <p style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 600, color: C.textDark }}>{cardinalName(qibla, language)}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sensorActive ? '#27ae60' : C.border, animation: sensorActive ? 'pulse 1.5s infinite' : 'none' }} />
                <span style={{ fontSize: 11.5, color: sensorActive ? '#27ae60' : C.textLight }}>
                  {sensorActive ? t('qibla_extra.compass_active') : t('qibla_extra.compass_inactive')}
                </span>
              </div>
              {!sensorActive && !sensorError && (
                <button onClick={startSensor} style={{ padding: '10px 22px', background: `linear-gradient(135deg, ${C.green}, #4A9468)`, border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 10, fontFamily: "'Cairo', sans-serif" }}>
                  {t('qibla_extra.activate_compass')}
                </button>
              )}
              {sensorError && <p style={{ fontSize: 11.5, color: '#c0392b', margin: '0 0 10px' }}>{sensorError}</p>}
              {heading !== null && <p style={{ fontSize: 11, color: C.textLight, margin: 0 }}>{t('qibla_extra.device_heading')} : {Math.round(heading)}°</p>}
            </div>
          </div>
          {geoError && <p style={{ margin: '18px 0 0', fontSize: 12, color: C.textLight, textAlign: 'center', fontStyle: 'italic' }}>{geoError}</p>}
        </div>

        {/* ── INFO CARDS ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={card({ padding: '22px 24px' })}>
            <p style={{ margin: '0 0 14px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textLight, fontWeight: 600 }}>
              {t('qibla_extra.my_current_pos')}
            </p>
            <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>{geo?.city ?? '—'}</p>
            {geo && (
              <>
                <p style={{ margin: '0 0 18px', fontSize: 11.5, color: C.textMid }}>{geo.lat.toFixed(4)}° N, {Math.abs(geo.lon).toFixed(4)}° {geo.lon >= 0 ? 'E' : 'W'}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: t('qibla_extra.distance_kaaba'), value: `${geo.distance.toLocaleString(undefined)} km`, icon: <SvgPin color={C.green} size={13} /> },
                    { label: t('qibla_extra.qibla_direction'), value: `${Math.round(qibla)}° ${cardinalName(qibla, language)}`, icon: <SvgArrow color={C.green} size={11} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: C.cardBg2, borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${C.green}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 12, color: C.textMid }}>{label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark }}>{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <button onClick={fetchGeo} style={{ marginTop: 14, width: '100%', padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10, color: C.textMid, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: "'Cairo', sans-serif" }}>
              <SvgRefresh color={C.textLight} size={11} />
              {t('qibla_extra.refresh_pos')}
            </button>
          </div>

          <div style={card({ padding: '22px 24px', display: 'flex', flexDirection: 'column' })}>
            <p style={{ margin: '0 0 14px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textLight, fontWeight: 600 }}>
              {t('qibla_extra.qibla_map')}
            </p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cardBg2, borderRadius: 14, padding: 16 }}>
              <svg viewBox="0 0 200 160" width="100%" style={{ maxHeight: 180 }}>
                {[30, 60, 90, 120].map(y => <line key={y} x1={0} y1={y} x2={200} y2={y} stroke={C.border} strokeWidth={0.5} />)}
                {[40, 80, 120, 160].map(x => <line key={x} x1={x} y1={0} x2={x} y2={160} stroke={C.border} strokeWidth={0.5} />)}
                <circle cx={60} cy={100} r={6} fill={C.green} />
                <circle cx={60} cy={100} r={10} fill={C.green} opacity={0.2} />
                <text x={60} y={118} textAnchor="middle" fontSize={8} fill={C.textMid}>{t('qibla_extra.you')}</text>
                <line x1={60} y1={100} x2={160} y2={38} stroke={C.gold} strokeWidth={1.5} strokeDasharray="4 3" />
                <rect x={154} y={30} width={12} height={10} rx={2} fill={C.green} />
                <text x={162} y={26} textAnchor="middle" fontSize={8} fill={C.textMid}>{t('qibla_extra.mecca')}</text>
                <text x={76} y={91} fontSize={7} fill={C.gold}>{Math.round(qibla)}°</text>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ ...card({ padding: '18px 26px' }), borderLeft: isAr ? 'none' : `3px solid #C8A84B`, borderRight: isAr ? `3px solid #C8A84B` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: C.textMid, fontStyle: 'italic' }}>
            {t('qibla_extra.tip')}
          </p>
          <span style={{ fontSize: 12, color: sensorActive ? '#27ae60' : C.textLight, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {t('qibla_extra.accuracy')} : {sensorActive ? t('qibla_extra.accuracy_high') : t('qibla_extra.accuracy_calc')}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
