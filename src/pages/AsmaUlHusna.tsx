import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { useLanguage } from '../hooks/useLanguage';
import { allNames, AsmaName } from '../data/asmaNamesFull';

// ─── Day-of-year name rotation ────────────────────────────────────────────────

function getDailyName(): AsmaName {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  return allNames[(dayOfYear - 1) % allNames.length];
}

// ─── Islamic geometric SVG pattern (used in hero + modal) ────────────────────

const IslamicPattern = ({ opacity = 0.07, color = '#C8A84B' }: { opacity?: number; color?: string }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="ipattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Outer square */}
        <rect x="12" y="12" width="56" height="56" fill="none" stroke={color} strokeWidth="0.7" opacity={opacity} />
        {/* Rotated square */}
        <rect x="12" y="12" width="56" height="56" fill="none" stroke={color} strokeWidth="0.7" opacity={opacity}
          transform="rotate(45 40 40)" />
        {/* Inner circle */}
        <circle cx="40" cy="40" r="13" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity * 0.8} />
        {/* Small center dot */}
        <circle cx="40" cy="40" r="2.5" fill={color} opacity={opacity * 0.6} />
        {/* Corner accent dots */}
        <circle cx="0"  cy="0"  r="2" fill={color} opacity={opacity * 0.4} />
        <circle cx="80" cy="0"  r="2" fill={color} opacity={opacity * 0.4} />
        <circle cx="0"  cy="80" r="2" fill={color} opacity={opacity * 0.4} />
        <circle cx="80" cy="80" r="2" fill={color} opacity={opacity * 0.4} />
        {/* Cross lines */}
        <line x1="40" y1="0" x2="40" y2="80" stroke={color} strokeWidth="0.35" opacity={opacity * 0.5} />
        <line x1="0" y1="40" x2="80" y2="40" stroke={color} strokeWidth="0.35" opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ipattern)" />
  </svg>
);

// ─── Animated progress ring ───────────────────────────────────────────────────

function ProgressRing({ value, total, size = 100 }: { value: number; total: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(200,168,75,0.15)" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="url(#ringGrad)" strokeWidth={8}
        strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D070" />
          <stop offset="100%" stopColor="#C8A030" />
        </linearGradient>
      </defs>
      <text x={size / 2} y={size / 2 - 5} textAnchor="middle"
        fill="#C8A84B" fontSize={size * 0.18} fontWeight={700} fontFamily="'Playfair Display', serif">
        {value}
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle"
        fill="rgba(200,168,75,0.6)" fontSize={size * 0.1}>
        / {total}
      </text>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

export default function AsmaUlHusna() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [learned, setLearned] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('asmaLearned') || '[]'); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('asmaFavorites') || '[]'); } catch { return []; }
  });

  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | 'learned' | 'toLearn' | 'fav'>('all');
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<AsmaName | null>(null);
  const [modalLang, setModalLang] = useState<'fr' | 'en'>(language === 'en' ? 'en' : 'fr');

  const dailyName = useMemo(() => getDailyName(), []);

  useEffect(() => { localStorage.setItem('asmaLearned',   JSON.stringify(learned));   }, [learned]);
  useEffect(() => { localStorage.setItem('asmaFavorites', JSON.stringify(favorites)); }, [favorites]);

  const toggleLearned  = useCallback((id: number) => setLearned(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const toggleFavorite = useCallback((id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }, []);

  const goNext = () => {
    if (!selected) return;
    const idx = allNames.findIndex(n => n.id === selected.id);
    setSelected(allNames[(idx + 1) % allNames.length]);
  };

  const goPrev = () => {
    if (!selected) return;
    const idx = allNames.findIndex(n => n.id === selected.id);
    setSelected(allNames[(idx - 1 + allNames.length) % allNames.length]);
  };

  // Close modal on Escape key + keyboard navigation
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); return; }
      if (e.key === 'ArrowRight') {
        const idx = allNames.findIndex(n => n.id === selected.id);
        setSelected(allNames[(idx + 1) % allNames.length]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = allNames.findIndex(n => n.id === selected.id);
        setSelected(allNames[(idx - 1 + allNames.length) % allNames.length]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  const filteredNames = useMemo(() => {
    let list = allNames;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.translit.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q)  ||
        n.en.toLowerCase().includes(q)       ||
        n.name.includes(search)
      );
    }
    if (filter === 'learned') list = list.filter(n => learned.includes(n.id));
    if (filter === 'toLearn') list = list.filter(n => !learned.includes(n.id));
    if (filter === 'fav')     list = list.filter(n => favorites.includes(n.id));
    return list;
  }, [search, filter, learned, favorites]);

  const totalPages     = Math.ceil(filteredNames.length / ITEMS_PER_PAGE);
  const displayedNames = filteredNames.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilter = (f: typeof filter) => { setFilter(f); setPage(1); };

  const getMeaning = (n: AsmaName) => language === 'en' ? n.en : n.meaning;

  // ── Shared style helpers ──────────────────────────────────────────────────

  const gold = '#C8A84B';
  const goldLight = '#E0C870';

  const glassCard = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: isDark ? 'rgba(20,30,22,0.85)' : 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${isDark ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.18)'}`,
    borderRadius: 24,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 8px 32px rgba(27,48,34,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
    ...extra,
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  function pageNumbers(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (page > 3) pages.push('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) pages.push(p);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  // ── Filter labels ────────────────────────────────────────────────────────

  const filterLabels: Record<string, string> = {
    all:     language === 'en' ? 'All'       : language === 'ar' ? 'الكل'     : 'Tous',
    learned: language === 'en' ? 'Learned'   : language === 'ar' ? 'محفوظة'   : 'Appris',
    toLearn: language === 'en' ? 'To learn'  : language === 'ar' ? 'للتعلم'   : 'À apprendre',
    fav:     language === 'en' ? 'Favorites' : language === 'ar' ? 'المفضلة'  : 'Favoris',
  };

  const heroTitle   = language === 'ar' ? 'أسماء الله الحسنى' : language === 'en' ? "Allah's Most Beautiful Names" : "Les 99 Noms d'Allah";
  const heroBadge   = language === 'ar' ? '٩٩ اسماً' : '99 Names';
  const dailyLabel  = language === 'ar' ? 'اسم اليوم' : language === 'en' ? "Name of the Day" : "Nom du Jour";
  const searchPh    = language === 'ar' ? 'ابحث عن اسم...' : language === 'en' ? 'Search a name...' : 'Rechercher un nom...';
  const learnedLbl  = language === 'ar' ? 'تم الحفظ' : language === 'en' ? 'Learned' : 'Appris';
  const markLbl     = language === 'ar' ? 'حفظ' : language === 'en' ? 'Mark as learned' : 'Marquer comme appris';
  const progressLbl = language === 'ar' ? 'تقدمك' : language === 'en' ? 'Your Progress' : 'Votre Progression';

  // ─────────────────────────────────────────────────────────────────────────
  // ── MODAL ────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  const modal = selected && (
    <div
      onClick={() => setSelected(null)}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(5,12,8,0.96)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Islamic pattern background */}
      <IslamicPattern opacity={0.055} color="#C8A84B" />

      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        style={{
          position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(200,168,75,0.10)', border: '1px solid rgba(200,168,75,0.25)',
          borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: gold, fontSize: 22, zIndex: 10,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.10)'; }}
      >
        &#8592;
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        style={{
          position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(200,168,75,0.10)', border: '1px solid rgba(200,168,75,0.25)',
          borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: gold, fontSize: 22, zIndex: 10,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,168,75,0.10)'; }}
      >
        &#8594;
      </button>

      {/* Close */}
      <button
        onClick={() => setSelected(null)}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 18, zIndex: 10,
        }}
      >
        ×
      </button>

      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 560, width: '90%',
          background: 'rgba(12,22,15,0.9)',
          border: `1px solid rgba(200,168,75,0.2)`,
          borderRadius: 32,
          padding: '48px 40px 40px',
          textAlign: 'center',
          position: 'relative',
          animation: 'scaleIn 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,168,75,0.08)',
        }}
      >
        {/* Number */}
        <p style={{ margin: '0 0 20px', fontSize: 11, color: 'rgba(200,168,75,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          {String(selected.id).padStart(2, '0')} / 99
        </p>

        {/* Gold ornament top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, rgba(200,168,75,0.5), transparent)` }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} opacity="0.8" />
          </svg>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, rgba(200,168,75,0.5), transparent)` }} />
        </div>

        {/* Arabic name — HUGE Scheherazade */}
        <p style={{
          margin: '0 0 8px',
          fontSize: 'clamp(60px, 14vw, 96px)',
          fontFamily: "'Scheherazade New', 'Amiri', serif",
          color: goldLight,
          lineHeight: 1.3,
          direction: 'rtl',
          textShadow: `0 0 40px rgba(200,168,75,0.35), 0 2px 8px rgba(0,0,0,0.4)`,
          letterSpacing: '-0.02em',
        }}>
          {selected.name}
        </p>

        {/* Gold divider line */}
        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: '0 auto 16px' }} />

        {/* Transliteration */}
        <p style={{
          margin: '0 0 8px', fontSize: 22, fontWeight: 600,
          fontFamily: "'Playfair Display', serif",
          color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em',
        }}>
          {selected.translit}
        </p>

        {/* Language toggle + Meaning */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
            {(['fr', 'en'] as const).map(l => (
              <button key={l} onClick={() => setModalLang(l)} style={{
                padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: modalLang === l ? gold : 'rgba(255,255,255,0.08)',
                color:      modalLang === l ? '#0D1810' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.2s',
              }}>
                {l === 'fr' ? 'FR' : 'EN'}
              </button>
            ))}
          </div>
          <p style={{
            margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.70)',
            fontStyle: 'italic', lineHeight: 1.6,
          }}>
            {modalLang === 'en' ? selected.en : selected.meaning}
          </p>
        </div>

        {/* Reflection quote */}
        <div style={{
          background: 'rgba(200,168,75,0.06)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderLeft: `3px solid ${gold}`,
          borderRadius: 12, padding: '14px 18px', marginBottom: 28, textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 4px', fontSize: 10, color: gold, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            {language === 'ar' ? 'تأمل' : language === 'en' ? 'Reflection' : 'Réflexion'}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontStyle: 'italic' }}>
            {language === 'en'
              ? `Invoke Allah by this name — "${selected.translit}" — in your prayers and supplications.`
              : language === 'ar'
              ? `ادعُ الله بهذا الاسم — ${selected.name} — في صلاتك ودعائك.`
              : `Invoquez Allah par ce nom — « ${selected.translit} » — dans vos prières et invocations.`}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={() => toggleLearned(selected.id)}
            style={{
              flex: 1, padding: '12px 20px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: learned.includes(selected.id)
                ? `linear-gradient(135deg, ${gold}, #A8882A)`
                : 'rgba(255,255,255,0.08)',
              color: learned.includes(selected.id) ? '#0D1810' : 'rgba(255,255,255,0.75)',
              fontSize: 13, fontWeight: 700,
              transition: 'all 0.25s',
              boxShadow: learned.includes(selected.id) ? `0 4px 16px rgba(200,168,75,0.3)` : 'none',
            }}
          >
            {learned.includes(selected.id) ? `✓ ${learnedLbl}` : markLbl}
          </button>
          <button
            onClick={(e) => toggleFavorite(selected.id, e)}
            style={{
              width: 48, height: 48, borderRadius: 14,
              border: `1px solid ${favorites.includes(selected.id) ? 'rgba(231,76,60,0.5)' : 'rgba(255,255,255,0.12)'}`,
              background: favorites.includes(selected.id) ? 'rgba(231,76,60,0.12)' : 'transparent',
              cursor: 'pointer', fontSize: 18,
              color: favorites.includes(selected.id) ? '#e74c3c' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ♥
          </button>
        </div>

        {/* Keyboard hint */}
        <p style={{ margin: '16px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
          {language === 'en' ? '← → arrow keys to navigate' : '← → pour naviguer entre les noms'}
        </p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ── RENDER ───────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: 48, color: C.textDark }}>
      {modal}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 28, marginBottom: 20,
        background: 'linear-gradient(145deg, #0A1A0E 0%, #162818 40%, #1B3828 80%, #0E1E14 100%)',
        minHeight: 280,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px 40px',
        textAlign: 'center',
      }}>
        {/* Islamic geometric pattern */}
        <IslamicPattern opacity={0.09} color="#C8A84B" />

        {/* Gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent 0%, ${gold} 30%, ${goldLight} 50%, ${gold} 70%, transparent 100%)`,
        }} />

        {/* 99 badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)',
          borderRadius: 30, padding: '5px 16px', marginBottom: 18,
          fontSize: 11, fontWeight: 700, color: gold, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <svg width="10" height="10" viewBox="0 0 20 20">
            <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
          </svg>
          {heroBadge}
        </span>

        {/* Arabic title — Scheherazade New */}
        <p style={{
          margin: '0 0 6px',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontFamily: "'Scheherazade New', 'Amiri', serif",
          color: goldLight, lineHeight: 1.4,
          direction: 'rtl', letterSpacing: '0.01em',
          textShadow: `0 0 30px rgba(200,168,75,0.25)`,
        }}>
          أَسْمَاءُ اللَّهِ الْحُسْنَى
        </p>

        {/* Latin title */}
        <h1 style={{
          margin: '0 0 6px', fontSize: 'clamp(18px, 3vw, 28px)',
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          color: '#FFFFFF', letterSpacing: '-0.02em',
        }}>
          {heroTitle}
        </h1>

        <p style={{ margin: '0 0 28px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          {language === 'ar'
            ? '"وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا" — الأعراف ١٨٠'
            : language === 'en'
            ? '"To Allah belong the Most Beautiful Names, so call upon Him by them." — Al-A\'raf 7:180'
            : '"À Allah appartiennent les plus beaux noms. Invoquez-Le par eux." — Sourate Al-A\'raf 7:180'}
        </p>

        {/* Progress bar inline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, maxWidth: 380 }}>
          <ProgressRing value={learned.length} total={99} size={72} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {progressLbl}
            </p>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 10,
                background: `linear-gradient(90deg, ${gold}, ${goldLight})`,
                width: `${(learned.length / 99) * 100}%`,
                transition: 'width 0.8s ease',
              }} />
            </div>
            <p style={{ margin: '5px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>
              {learned.length} / 99 — {Math.round((learned.length / 99) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { value: learned.length,                  label: language === 'ar' ? 'محفوظة' : language === 'en' ? 'Learned' : 'Appris',    color: C.green },
          { value: 99 - learned.length,             label: language === 'ar' ? 'متبقية' : language === 'en' ? 'Remaining' : 'Restants', color: C.gold },
          { value: favorites.length,                label: language === 'ar' ? 'مفضلة' : language === 'en' ? 'Favorites' : 'Favoris',  color: '#e74c3c' },
        ].map(({ value, label, color }) => (
          <div key={label} style={{
            ...glassCard({ padding: '18px 16px', textAlign: 'center' }),
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: C.textLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── NOM DU JOUR ──────────────────────────────────────────────────── */}
      <div style={{
        ...glassCard({ padding: '32px 36px', marginBottom: 20 }),
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: isDark
          ? 'linear-gradient(135deg, rgba(20,30,22,0.95) 0%, rgba(27,56,40,0.8) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,250,240,0.95) 100%)',
      }}>
        <IslamicPattern opacity={isDark ? 0.06 : 0.04} />

        {/* Badge */}
        <span style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${gold}, #A8882A)`,
          borderRadius: 30, padding: '4px 16px', marginBottom: 16,
          fontSize: 10, fontWeight: 800, color: '#0D1810', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          {dailyLabel}
        </span>

        {/* Number */}
        <p style={{ margin: '0 0 4px', fontSize: 11, color: C.textLight, letterSpacing: '0.12em' }}>
          #{String(dailyName.id).padStart(2, '0')}
        </p>

        {/* Arabic — Scheherazade New, XL */}
        <p style={{
          margin: '0 0 4px',
          fontSize: 'clamp(52px, 10vw, 80px)',
          fontFamily: "'Scheherazade New', 'Amiri', serif",
          color: isDark ? goldLight : '#1B3022',
          lineHeight: 1.4, direction: 'rtl',
          textShadow: isDark ? `0 0 30px rgba(200,168,75,0.2)` : 'none',
        }}>
          {dailyName.name}
        </p>

        {/* Animated gold underline */}
        <div style={{
          width: 80, height: 2, borderRadius: 4,
          background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
          marginBottom: 12,
          animation: 'shimmer 2.5s infinite',
          backgroundSize: '200% 100%',
        }} />

        <p style={{
          margin: '0 0 4px', fontSize: 20, fontWeight: 600,
          fontFamily: "'Playfair Display', serif",
          color: C.textDark, letterSpacing: '0.02em',
        }}>
          {dailyName.translit}
        </p>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: C.textMid, fontStyle: 'italic' }}>
          {getMeaning(dailyName)}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setSelected(dailyName)}
            style={{
              padding: '11px 24px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.green}, #1B4A30)`,
              border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: `0 4px 16px rgba(46,100,67,0.3)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {language === 'en' ? 'Explore this name' : language === 'ar' ? 'استكشف الاسم' : 'Explorer ce nom'}
          </button>
          <button
            onClick={() => toggleLearned(dailyName.id)}
            style={{
              padding: '11px 24px', borderRadius: 14,
              background: learned.includes(dailyName.id)
                ? `linear-gradient(135deg, ${gold}, #A8882A)`
                : 'transparent',
              border: `1px solid ${learned.includes(dailyName.id) ? gold : C.border}`,
              color: learned.includes(dailyName.id) ? '#0D1810' : C.textMid,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {learned.includes(dailyName.id) ? `✓ ${learnedLbl}` : markLbl}
          </button>
        </div>
      </div>

      {/* ── SEARCH + FILTERS ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          flex: 1, minWidth: 220,
          display: 'flex', alignItems: 'center', gap: 10,
          ...glassCard({ padding: '0 18px', borderRadius: 40 }),
        }}>
          <span style={{ color: C.textLight, fontSize: 14 }}>⌕</span>
          <input
            type="text"
            placeholder={searchPh}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{
              flex: 1, padding: '13px 0',
              background: 'transparent', border: 'none', outline: 'none',
              color: C.textDark, fontSize: 13,
              fontFamily: language === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif",
            }}
          />
          {search && (
            <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight, fontSize: 18 }}>×</button>
          )}
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex', gap: 4,
          ...glassCard({ padding: 4, borderRadius: 40 }),
        }}>
          {(['all', 'learned', 'toLearn', 'fav'] as const).map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                background: filter === f ? `linear-gradient(135deg, ${C.green}, #1B4A30)` : 'transparent',
                color: filter === f ? '#fff' : C.textMid,
                boxShadow: filter === f ? `0 2px 8px rgba(46,100,67,0.25)` : 'none',
              }}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* ── NAMES GRID ───────────────────────────────────────────────────── */}
      {displayedNames.length === 0 ? (
        <div style={{ ...glassCard({ padding: '60px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
          <IslamicPattern opacity={0.04} />
          <p style={{ fontSize: 44, fontFamily: "'Scheherazade New', serif", color: C.textLight, margin: '0 0 8px' }}>بسم الله</p>
          <p style={{ fontSize: 13, color: C.textMid }}>
            {language === 'en' ? 'No names found for your search.' : 'Aucun nom trouvé pour votre recherche.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 14, marginBottom: 24,
        }}>
          {displayedNames.map((n) => {
            const isLearned = learned.includes(n.id);
            const isFav     = favorites.includes(n.id);
            return (
              <div
                key={n.id}
                onClick={() => setSelected(n)}
                style={{
                  ...glassCard({
                    padding: '22px 18px 18px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s',
                    overflow: 'hidden',
                    background: isLearned
                      ? (isDark ? 'rgba(20,50,30,0.9)' : 'rgba(240,252,240,0.95)')
                      : (isDark ? 'rgba(14,22,16,0.85)' : 'rgba(255,255,255,0.92)'),
                    borderColor: isLearned
                      ? `rgba(${isDark ? '200,168,75' : '46,100,67'},0.3)`
                      : undefined,
                  }),
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,168,75,0.2)'
                    : '0 16px 40px rgba(27,48,34,0.14), 0 0 0 1px rgba(200,168,75,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
                    : '0 8px 32px rgba(27,48,34,0.08), inset 0 1px 0 rgba(255,255,255,0.8)';
                }}
              >
                {/* Subtle geometric hover pattern */}
                <IslamicPattern opacity={isDark ? 0.035 : 0.025} />

                {/* Number badge */}
                <span style={{
                  position: 'absolute', top: 12, left: 14,
                  fontSize: 10, fontWeight: 800, color: gold,
                  opacity: 0.6, letterSpacing: '0.06em',
                }}>
                  {String(n.id).padStart(2, '0')}
                </span>

                {/* Learned indicator */}
                {isLearned ? (
                  <span style={{
                    position: 'absolute', top: 10, right: 12,
                    width: 20, height: 20, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${gold}, #A8882A)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: '#0D1810', fontWeight: 800,
                    boxShadow: `0 2px 8px rgba(200,168,75,0.35)`,
                  }}>✓</span>
                ) : (
                  <button
                    onClick={e => toggleFavorite(n.id, e)}
                    style={{
                      position: 'absolute', top: 9, right: 11,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14,
                      color: isFav ? '#e74c3c' : (isDark ? 'rgba(255,255,255,0.15)' : C.border),
                      transition: 'color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >♥</button>
                )}

                {/* Arabic name — Scheherazade New */}
                <p style={{
                  margin: '14px 0 8px', textAlign: 'center',
                  fontSize: 34,
                  fontFamily: "'Scheherazade New', 'Amiri', serif",
                  color: isDark ? goldLight : '#1B3022',
                  lineHeight: 1.45, direction: 'rtl',
                  textShadow: isDark ? `0 0 16px rgba(200,168,75,0.12)` : 'none',
                }}>
                  {n.name}
                </p>

                {/* Thin gold divider */}
                <div style={{
                  height: 1, margin: '8px 20px 10px',
                  background: `linear-gradient(90deg, transparent, ${gold}44, transparent)`,
                }} />

                {/* Transliteration */}
                <p style={{
                  margin: '0 0 4px', fontSize: 12, fontWeight: 700,
                  fontFamily: "'Playfair Display', serif",
                  color: C.textDark, textAlign: 'center', letterSpacing: '0.02em',
                }}>
                  {n.translit}
                </p>

                {/* Meaning */}
                <p style={{
                  margin: 0, fontSize: 10.5, color: C.textMid,
                  textAlign: 'center', lineHeight: 1.4,
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                } as React.CSSProperties}>
                  {getMeaning(n)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PAGINATION ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: `1px solid ${C.border}`,
              background: 'transparent', cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: page === 1 ? C.textLight : C.textDark, fontSize: 14,
              opacity: page === 1 ? 0.4 : 1, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >&#8592;</button>

          {pageNumbers().map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === 'number' && setPage(p)}
              disabled={p === '…'}
              style={{
                minWidth: 36, height: 36, borderRadius: '50%', border: 'none',
                cursor: p === '…' ? 'default' : 'pointer',
                background: p === page
                  ? `linear-gradient(135deg, ${gold}, #A8882A)`
                  : 'transparent',
                color: p === page ? '#0D1810' : (p === '…' ? C.textLight : C.textMid),
                fontSize: p === page ? 13 : 12,
                fontWeight: p === page ? 800 : 400,
                transition: 'all 0.2s',
                boxShadow: p === page ? `0 2px 10px rgba(200,168,75,0.3)` : 'none',
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: `1px solid ${C.border}`,
              background: 'transparent', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: page === totalPages ? C.textLight : C.textDark, fontSize: 14,
              opacity: page === totalPages ? 0.4 : 1, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >&#8594;</button>
        </div>
      )}

      {/* Inline keyframe overrides */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 900px) {
          .asma-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .asma-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
