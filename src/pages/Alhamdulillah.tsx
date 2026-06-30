import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import PageBanner from '../components/layout/PageBanner';
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Gratitude {
  id: string; text: string; category: string; date: string; liked: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Category IDs stored in localStorage — language-neutral keys
const CATEGORY_IDS = ['cat_allah', 'cat_foi', 'cat_famille', 'cat_sante', 'cat_travail', 'cat_autre'] as const;
type CatId = typeof CATEGORY_IDS[number];

// Arabic script is always the same regardless of UI language
const CATEGORY_ARABIC: Record<string, string> = {
  cat_allah: 'الله', cat_foi: 'الإيمان', cat_famille: 'الأسرة',
  cat_sante: 'الصحة', cat_travail: 'العمل', cat_autre: 'أخرى',
};

const gold = '#C8A84B';
const goldLight = '#E0C870';
const FILTER_ALL = '__all__';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStreak(gratitudes: Gratitude[]): number {
  const dates = [...new Set(gratitudes.map(g => g.date))].sort();
  if (dates.length === 0) return 0;
  let streak = 1;
  for (let i = dates.length - 1; i >= 1; i--) {
    const curr = new Date(dates[i]);
    const prev = new Date(dates[i - 1]);
    if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 1) streak++;
    else break;
  }
  return streak;
}

// ─── Islamic Pattern ─────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06 }: { opacity?: number }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="ip-alhamd" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect x="8" y="8" width="44" height="44" fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity} />
        <rect x="8" y="8" width="44" height="44" fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity} transform="rotate(45 30 30)" />
        <circle cx="30" cy="30" r="8" fill="none" stroke={gold} strokeWidth="0.4" opacity={opacity * 0.7} />
        <circle cx="30" cy="30" r="2" fill={gold} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-alhamd)" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function Alhamdulillah() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [gratitudes, setGratitudes] = useState<Gratitude[]>(() => {
    try { const s = localStorage.getItem('gratitudes'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [newText, setNewText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CatId>(CATEGORY_IDS[0]);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);

  useEffect(() => {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    if (!newText.trim()) return;
    setGratitudes(prev => [{
      id: Date.now().toString(), text: newText.trim(),
      category: selectedCategory,
      date: new Date().toLocaleDateString(undefined), liked: false,
    }, ...prev]);
    setNewText('');
  };

  const deleteGratitude = (id: string) => setGratitudes(prev => prev.filter(g => g.id !== id));
  const toggleLike = (id: string) => setGratitudes(prev => prev.map(g => g.id === id ? { ...g, liked: !g.liked } : g));

  const streak = computeStreak(gratitudes);
  const usedCategories = [...new Set(gratitudes.map(g => g.category))];
  const filtered = filterCategory === FILTER_ALL ? gratitudes : gratitudes.filter(g => g.category === filterCategory);

  const glass = (extra?: object): React.CSSProperties => ({
    background: isDark ? 'rgba(14,22,16,0.88)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${isDark ? 'rgba(200,168,75,0.12)' : 'rgba(200,168,75,0.18)'}`,
    borderRadius: 22,
    boxShadow: isDark
      ? '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 6px 28px rgba(27,48,34,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
    ...extra,
  });

  return (
    <div style={{ paddingBottom: 48 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageBanner
        marginBottom={20}
        eyebrow={t('alhamd_extra.journal_label')}
        title="Alhamdulillah"
        subtitle={t('alhamd_extra.quote')}
      />

      <div>

      {/* ── QURANIC VERSE ─────────────────────────────────────────────────── */}
      <div style={{
        ...glass({ padding: '20px 26px', marginBottom: 20 }),
        position: 'relative', overflow: 'hidden',
        borderLeft: `3px solid ${gold}`,
      }}>
        <IslamicPattern opacity={isDark ? 0.035 : 0.025} />
        <div style={{ position: 'relative' }}>
          <p style={{
            margin: '0 0 8px', textAlign: 'right', direction: 'rtl',
            fontFamily: "'Cairo', sans-serif", fontSize: 22,
            color: isDark ? goldLight : '#1B3022', lineHeight: 1.7,
          }}>
            وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 13, fontStyle: 'italic', color: C.textMid, lineHeight: 1.65 }}>
            {t('alhamd_extra.verse_translation')}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: gold, fontWeight: 700 }}>Coran 14:7</p>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { value: gratitudes.length, label: t('alhamd_extra.total_entries'), color: C.green },
          { value: streak,            label: t('alhamd_extra.consecutive_days'), color: gold },
          { value: usedCategories.length, label: t('alhamd_extra.categories'), color: isDark ? goldLight : C.green },
        ].map(stat => (
          <div key={stat.label} style={{ ...glass({ padding: '20px 16px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
            <IslamicPattern opacity={isDark ? 0.03 : 0.025} />
            <div style={{ position: 'relative' }}>
              <p style={{ margin: '0 0 6px', fontSize: 34, fontWeight: 800, color: stat.color, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: 10.5, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── WRITE CARD ────────────────────────────────────────────────────── */}
      <div style={{ ...glass({ padding: '26px 28px', marginBottom: 22 }), position: 'relative', overflow: 'hidden' }}>
        <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="11" height="11" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: gold, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              {t('alhamd_extra.new_entry')}
            </p>
          </div>

          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value.slice(0, 300))}
            placeholder={t('alhamd_extra.text_placeholder')}
            rows={4}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(200,168,75,0.15)' : 'rgba(200,168,75,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              color: C.textDark, fontSize: 14.5, resize: 'vertical', outline: 'none',
              lineHeight: 1.7, boxSizing: 'border-box', fontFamily: "'Cairo', sans-serif",
              transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(200,168,75,0.45)'; }}
            onBlur={e => { e.target.style.borderColor = isDark ? 'rgba(200,168,75,0.15)' : 'rgba(200,168,75,0.2)'; }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: newText.length >= 280 ? '#c0392b' : C.textLight }}>
              {newText.length}/300
            </span>
          </div>

          {/* Category selector */}
          <p style={{ margin: '0 0 10px', fontSize: 11, color: C.textMid, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {t('alhamd_extra.category_label')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
            {CATEGORY_IDS.map(catId => (
              <button key={catId} onClick={() => setSelectedCategory(catId)} style={{
                background: selectedCategory === catId ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
                color: selectedCategory === catId ? '#0D1810' : C.textMid,
                border: `1px solid ${selectedCategory === catId ? gold : C.border}`,
                borderRadius: 30, padding: '6px 16px', fontSize: 12.5, fontWeight: selectedCategory === catId ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'inherit' }}>
                  {CATEGORY_ARABIC[catId]}
                </span>
                {t(`alhamd_extra.${catId}`)}
              </button>
            ))}
          </div>

          <button
            onClick={addGratitude}
            disabled={!newText.trim()}
            style={{
              background: newText.trim() ? `linear-gradient(135deg,${C.green},#1B4A30)` : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
              border: 'none', borderRadius: 14, padding: '13px 28px',
              color: newText.trim() ? '#fff' : C.textLight,
              fontWeight: 700, fontSize: 13.5, cursor: newText.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s',
              boxShadow: newText.trim() ? `0 4px 16px rgba(27,48,34,0.25)` : 'none',
            }}
            onMouseEnter={e => { if (newText.trim()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {t('alhamd_extra.save_gratitude')}
          </button>
        </div>
      </div>

      {/* ── ENTRIES LIST ─────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="11" height="11" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, fontFamily: "'Cairo', sans-serif" }}>
              {t('alhamd_extra.my_entries')}
            </h2>
          </div>
          <span style={{ fontSize: 11.5, color: C.textLight }}>{filtered.length}</span>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          <button key={FILTER_ALL} onClick={() => setFilterCategory(FILTER_ALL)} style={{
            background: filterCategory === FILTER_ALL ? `rgba(200,168,75,0.14)` : 'transparent',
            color: filterCategory === FILTER_ALL ? gold : C.textMid,
            border: `1px solid ${filterCategory === FILTER_ALL ? 'rgba(200,168,75,0.4)' : C.border}`,
            borderRadius: 20, padding: '5px 14px', fontSize: 11.5,
            fontWeight: filterCategory === FILTER_ALL ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {t('alhamd_extra.filter_all')}
          </button>
          {CATEGORY_IDS.map(catId => (
            <button key={catId} onClick={() => setFilterCategory(catId)} style={{
              background: filterCategory === catId ? `rgba(200,168,75,0.14)` : 'transparent',
              color: filterCategory === catId ? gold : C.textMid,
              border: `1px solid ${filterCategory === catId ? 'rgba(200,168,75,0.4)' : C.border}`,
              borderRadius: 20, padding: '5px 14px', fontSize: 11.5,
              fontWeight: filterCategory === catId ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {t(`alhamd_extra.${catId}`)}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ ...glass({ padding: '56px 24px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
            <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 32, color: isDark ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.5)', margin: '0 0 10px', direction: 'rtl' }}>
                الْحَمْدُ لِلَّهِ
              </p>
              <p style={{ color: C.textMid, margin: 0, fontSize: 13 }}>
                {filterCategory === FILTER_ALL
                  ? t('alhamd_extra.empty_all')
                  : t('alhamd_extra.empty_category')}
              </p>
            </div>
          </div>
        )}

        {/* Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(g => (
            <div key={g.id} style={{
              ...glass({ padding: '18px 22px' }),
              position: 'relative', overflow: 'hidden',
              borderLeft: `3px solid ${g.liked ? '#e74c3c' : gold}`,
              transition: 'all 0.25s',
            }}>
              <IslamicPattern opacity={isDark ? 0.025 : 0.02} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <p style={{ flex: 1, margin: '0 0 10px', fontSize: 14.5, color: C.textDark, lineHeight: 1.65 }}>
                    {g.text}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => toggleLike(g.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: g.liked ? '#e74c3c' : C.textLight, padding: 4,
                      transition: 'color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    title={t('common.like') || '♥'}>
                      {g.liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    </button>
                    <button onClick={() => deleteGratitude(g.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: C.textLight, padding: 4, transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#e74c3c'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textLight; }}
                    title={t('common.delete') || '🗑'}>
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    background: `rgba(200,168,75,0.1)`,
                    border: `1px solid rgba(200,168,75,0.25)`,
                    borderRadius: 20, padding: '2px 12px', fontSize: 10.5,
                    color: gold, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13 }}>
                      {CATEGORY_ARABIC[g.category] || ''}
                    </span>
                    {t(`alhamd_extra.${g.category}`) || g.category}
                  </span>
                  <span style={{ fontSize: 10.5, color: C.textLight }}>{g.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
