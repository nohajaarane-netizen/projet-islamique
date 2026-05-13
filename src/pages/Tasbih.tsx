import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

const TARGETS = [33, 99] as const;

interface DailyStats { date: string; totalTaps: number; completedCycles: number; }

function getTodayDate(): string { return new Date().toLocaleDateString(undefined); }

function loadDailyStats(): DailyStats {
  try {
    const saved = localStorage.getItem('tasbih-daily');
    if (saved) { const p: DailyStats = JSON.parse(saved); if (p.date === getTodayDate()) return p; }
  } catch {}
  return { date: getTodayDate(), totalTaps: 0, completedCycles: 0 };
}

const gold = '#C8A84B';
const goldLight = '#E0C870';

// ─── Islamic Pattern ─────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06, color = gold }: { opacity?: number; color?: string }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="ip-tasbih" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
        <rect x="7" y="7" width="42" height="42" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <rect x="7" y="7" width="42" height="42" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} transform="rotate(45 28 28)" />
        <circle cx="28" cy="28" r="8" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity * 0.7} />
        <circle cx="28" cy="28" r="2" fill={color} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-tasbih)" />
  </svg>
);

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ radius, strokeWidth, progress, color, trackColor }: {
  radius: number; strokeWidth: number; progress: number; color: string; trackColor: string;
}) {
  const r = radius - strokeWidth / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(progress, 1));
  return (
    <svg width={radius*2} height={radius*2} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
      <circle cx={radius} cy={radius} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle cx={radius} cy={radius} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tasbih() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [count, setCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('tasbih-count') || '0', 10) || 0; } catch { return 0; }
  });
  const [target, setTarget] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('tasbih-target') || '33', 10) || 33; } catch { return 33; }
  });
  const [customTarget, setCustomTarget] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats>(loadDailyStats);
  const [ripple, setRipple] = useState(false);
  const [flash, setFlash] = useState(false);
  const [currentDhikr, setCurrentDhikr] = useState(0);

  const dhikrList = [
    { arabic: 'سُبْحَانَ اللَّهِ', latin: 'Subhanallah', meaning: t('tasbih.subhanallah_meaning'), count: '33' },
    { arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', meaning: t('tasbih.alhamdulillah_meaning'), count: '33' },
    { arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', meaning: t('tasbih.allahu_akbar_meaning'), count: '34' },
  ];

  useEffect(() => { localStorage.setItem('tasbih-count', count.toString()); }, [count]);
  useEffect(() => { localStorage.setItem('tasbih-target', target.toString()); }, [target]);
  useEffect(() => { localStorage.setItem('tasbih-daily', JSON.stringify(dailyStats)); }, [dailyStats]);

  const handleTap = useCallback(() => {
    setRipple(true);
    setTimeout(() => setRipple(false), 350);
    setCount(prev => {
      const next = prev + 1;
      if (next >= target) {
        setFlash(true);
        setTimeout(() => setFlash(false), 700);
        setDailyStats(ds => ({ ...ds, totalTaps: ds.totalTaps + 1, completedCycles: ds.completedCycles + 1 }));
        setCurrentDhikr(d => (d + 1) % dhikrList.length);
        return 0;
      }
      setDailyStats(ds => ({ ...ds, totalTaps: ds.totalTaps + 1 }));
      return next;
    });
  }, [target, dhikrList.length]);

  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1));
    setDailyStats(ds => ({ ...ds, totalTaps: Math.max(0, ds.totalTaps - 1) }));
  };

  const changeTarget = (val: number) => { setTarget(val); setCount(0); setShowCustom(false); };
  const applyCustomTarget = () => {
    const val = parseInt(customTarget, 10);
    if (val > 0 && val <= 9999) { changeTarget(val); setCustomTarget(''); }
  };

  const progress = target > 0 ? count / target : 0;
  const ringSize = 210;
  const strokeWidth = 10;

  const glass = (extra?: object): React.CSSProperties => ({
    background: isDark ? 'rgba(14,22,16,0.88)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${isDark ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.18)'}`,
    borderRadius: 24,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 6px 28px rgba(27,48,34,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
    ...extra,
  });

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', paddingBottom: 48 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 24,
        backgroundImage: `linear-gradient(145deg, rgba(6,15,10,0.80) 0%, rgba(18,48,30,0.68) 55%, rgba(8,20,14,0.60) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        padding: '28px 32px 24px',
        border: '1px solid rgba(200,168,75,0.14)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
      }}>
        <IslamicPattern opacity={0.07} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
            <svg width="7" height="7" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
          </div>
          <div style={{ borderLeft: `3px solid rgba(200,168,75,0.75)`, paddingLeft: 16 }}>
            <span style={{ fontSize: 10, color: 'rgba(224,200,112,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              {t('tasbih.subtitle')}
            </span>
            <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#fff', fontFamily: "'Cairo', sans-serif", letterSpacing: '-0.01em' }}>
              {t('tasbih.title')}
            </h1>
            <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>
              {t('tasbih.quote')}
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN COUNTER ─────────────────────────────────────────────────── */}
      <div style={{
        ...glass({ padding: '36px 28px 32px', marginBottom: 20, textAlign: 'center' }),
        position: 'relative', overflow: 'hidden',
      }}>
        <IslamicPattern opacity={isDark ? 0.04 : 0.03} />

        <div style={{ position: 'relative' }}>
          {/* Current dhikr display */}
          <div style={{ marginBottom: 24 }}>
            <p style={{
              margin: '0 0 4px',
              fontFamily: "'Cairo', sans-serif",
              fontSize: 'clamp(28px,6vw,40px)',
              color: flash ? goldLight : (isDark ? goldLight : '#1B3022'),
              direction: 'rtl', lineHeight: 1.5,
              textShadow: flash ? `0 0 30px rgba(200,168,75,0.5)` : 'none',
              transition: 'text-shadow 0.3s, color 0.3s',
            }}>
              {dhikrList[currentDhikr].arabic}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: 600, color: C.textMid, fontStyle: 'italic' }}>
              {dhikrList[currentDhikr].latin}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>{dhikrList[currentDhikr].meaning}</p>
          </div>

          {/* Progress ring + counter */}
          <div style={{
            position: 'relative', width: ringSize, height: ringSize,
            margin: '0 auto 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ProgressRing
              radius={ringSize / 2} strokeWidth={strokeWidth} progress={progress}
              color={flash ? goldLight : gold}
              trackColor={isDark ? 'rgba(200,168,75,0.1)' : 'rgba(200,168,75,0.12)'}
            />

            {/* Inner glow ring */}
            {ripple && (
              <div style={{
                position: 'absolute', inset: strokeWidth,
                borderRadius: '50%',
                border: `1px solid rgba(200,168,75,0.3)`,
                animation: 'rippleOut 0.35s ease-out forwards',
              }} />
            )}

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(64px,12vw,88px)', fontWeight: 800, lineHeight: 1,
                fontFamily: "'Cairo', sans-serif",
                color: flash ? gold : C.textDark,
                transition: 'color 0.3s',
              }}>
                {count}
              </div>
              <div style={{ fontSize: 14, color: C.textLight, marginTop: 4 }}>
                / {target}
              </div>
            </div>
          </div>

          {/* Target selector */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {TARGETS.map(val => (
              <button key={val} onClick={() => changeTarget(val)} style={{
                background: target === val && !showCustom ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
                color: target === val && !showCustom ? '#0D1810' : C.textMid,
                border: `1px solid ${target === val && !showCustom ? gold : C.border}`,
                borderRadius: 30, padding: '7px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {val}
              </button>
            ))}
            <button onClick={() => setShowCustom(v => !v)} style={{
              background: showCustom ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
              color: showCustom ? '#0D1810' : C.textMid,
              border: `1px solid ${showCustom ? gold : C.border}`,
              borderRadius: 30, padding: '7px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t('tasbih.other')}
            </button>
          </div>

          {showCustom && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              <input
                type="number" placeholder="Ex: 100" value={customTarget}
                onChange={e => setCustomTarget(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyCustomTarget()}
                style={{
                  padding: '9px 16px', borderRadius: 12,
                  border: `1px solid rgba(200,168,75,0.3)`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  color: C.textDark, fontSize: 14, width: 100, outline: 'none',
                  fontFamily: "'Cairo', sans-serif", textAlign: 'center',
                }}
              />
              <button onClick={applyCustomTarget} style={{
                background: `linear-gradient(135deg,${gold},#A8882A)`,
                border: 'none', borderRadius: 12, padding: '9px 20px',
                color: '#0D1810', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>
                OK
              </button>
            </div>
          )}

          {/* Big TAP button */}
          <button
            onClick={handleTap}
            style={{
              width: '100%', padding: '28px 0', marginBottom: 12,
              background: ripple
                ? `linear-gradient(145deg, ${goldLight}, ${gold})`
                : `linear-gradient(145deg, ${C.green}, #1B4A30)`,
              border: 'none', borderRadius: 20, color: '#fff',
              fontSize: 20, fontWeight: 800, fontFamily: "'Cairo', sans-serif",
              cursor: 'pointer', letterSpacing: '0.04em',
              boxShadow: ripple
                ? `0 0 40px rgba(200,168,75,0.4), 0 8px 28px rgba(0,0,0,0.25)`
                : `0 4px 20px rgba(27,48,34,0.25)`,
              transform: ripple ? 'scale(0.975)' : 'scale(1)',
              transition: 'all 0.15s ease',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            {dhikrList[currentDhikr].arabic}
          </button>

          {/* Secondary controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDecrement} style={{
              flex: 1, padding: '13px 0', background: 'transparent',
              border: `1px solid ${C.border}`, borderRadius: 14, color: C.textMid,
              fontSize: 18, cursor: 'pointer', transition: 'all 0.15s', fontWeight: 600,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
              −1
            </button>
            <button onClick={() => setCount(0)} style={{
              flex: 2, padding: '13px 0', background: 'transparent',
              border: `1px solid ${C.border}`, borderRadius: 14, color: C.textMid,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
              {t('tasbih.reset')}
            </button>
          </div>
        </div>
      </div>

      {/* ── SESSION STATS ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ ...glass({ padding: '20px 18px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={isDark ? 0.03 : 0.025} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 800, color: gold, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>
              {dailyStats.completedCycles}
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              {t('tasbih.cycles')}
            </p>
          </div>
        </div>
        <div style={{ ...glass({ padding: '20px 18px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={isDark ? 0.03 : 0.025} />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 800, color: C.green, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>
              {dailyStats.totalTaps}
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              {t('tasbih.dhikr_today')}
            </p>
          </div>
        </div>
      </div>

      {/* ── DHIKR GUIDE ───────────────────────────────────────────────────── */}
      <div style={{
        ...glass({ padding: '22px 26px' }),
        position: 'relative', overflow: 'hidden',
        borderLeft: `3px solid ${gold}`,
      }}>
        <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="11" height="11" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: gold, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {t('tasbih.guide_title')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dhikrList.map((item, i) => (
              <div key={item.latin} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14,
                background: currentDhikr === i
                  ? (isDark ? 'rgba(200,168,75,0.07)' : 'rgba(200,168,75,0.05)')
                  : 'transparent',
                border: `1px solid ${currentDhikr === i ? 'rgba(200,168,75,0.25)' : C.border}`,
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: currentDhikr === i ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
                  border: `1.5px solid ${currentDhikr === i ? gold : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: currentDhikr === i ? '#0D1810' : C.textLight,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontFamily: "'Cairo', sans-serif", fontSize: 20, color: isDark ? goldLight : '#1B3022', direction: 'rtl', textAlign: 'right' }}>
                    {item.arabic}
                  </p>
                  <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 600, color: C.textDark }}>{item.latin}</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: C.textLight, fontStyle: 'italic' }}>{item.meaning}</p>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800, color: gold,
                  background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.25)',
                  borderRadius: 20, padding: '3px 12px',
                  fontFamily: "'Cairo', sans-serif",
                }}>
                  ×{item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rippleOut {
          from { opacity: 0.6; transform: scale(0.95); }
          to   { opacity: 0; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
