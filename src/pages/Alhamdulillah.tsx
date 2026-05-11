import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Gratitude {
  id: string; text: string; category: string; date: string; liked: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Allah', 'Foi', 'Famille', 'Santé', 'Travail', 'Autre'];

const CATEGORY_ARABIC: Record<string, string> = {
  Allah: 'الله', Foi: 'الإيمان', Famille: 'الأسرة', Santé: 'الصحة', Travail: 'العمل', Autre: 'أخرى',
};

const gold = '#C8A84B';
const goldLight = '#E0C870';

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
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [gratitudes, setGratitudes] = useState<Gratitude[]>(() => {
    try { const s = localStorage.getItem('gratitudes'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [newText, setNewText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [filterCategory, setFilterCategory] = useState('Tous');

  useEffect(() => {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    if (!newText.trim()) return;
    setGratitudes(prev => [{
      id: Date.now().toString(), text: newText.trim(),
      category: selectedCategory,
      date: new Date().toLocaleDateString('fr-FR'), liked: false,
    }, ...prev]);
    setNewText('');
  };

  const deleteGratitude = (id: string) => setGratitudes(prev => prev.filter(g => g.id !== id));
  const toggleLike = (id: string) => setGratitudes(prev => prev.map(g => g.id === id ? { ...g, liked: !g.liked } : g));

  const streak = computeStreak(gratitudes);
  const usedCategories = [...new Set(gratitudes.map(g => g.category))];
  const filtered = filterCategory === 'Tous' ? gratitudes : gratitudes.filter(g => g.category === filterCategory);

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
    <div style={{ maxWidth: 780, margin: '0 auto', paddingBottom: 48 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', borderRadius: 26, overflow: 'hidden', marginBottom: 24,
        backgroundImage: `linear-gradient(145deg, rgba(6,15,10,0.96) 0%, rgba(20,52,34,0.9) 55%, rgba(8,20,14,0.80) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '44px 38px 36px',
      }}>
        <IslamicPattern opacity={0.08} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

        {/* Watermark verse */}
        <p style={{
          position: 'absolute', top: 20, right: 32, margin: 0, pointerEvents: 'none',
          fontFamily: "'Scheherazade New', serif", fontSize: 20,
          color: 'rgba(200,168,75,0.16)', direction: 'rtl',
        }}>
          لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ
        </p>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <span style={{ fontSize: 10, color: 'rgba(224,200,112,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              Journal de Gratitude
            </span>
          </div>

          <p style={{
            margin: '0 0 6px', fontFamily: "'Scheherazade New', serif",
            fontSize: 'clamp(28px,5vw,40px)', color: goldLight, direction: 'rtl',
            lineHeight: 1.5, textShadow: '0 0 30px rgba(200,168,75,0.2)',
          }}>
            الْحَمْدُ لِلَّهِ
          </p>

          <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
            Alhamdulillah
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            « Chaque bienfait mérite d'être reconnu. »
          </p>
        </div>
      </div>

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
            fontFamily: "'Scheherazade New', serif", fontSize: 22,
            color: isDark ? goldLight : '#1B3022', lineHeight: 1.7,
          }}>
            وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 13, fontStyle: 'italic', color: C.textMid, lineHeight: 1.65 }}>
            « Si vous êtes reconnaissants, Je vous accorderai certes davantage. Mais si vous êtes ingrats, Mon châtiment est certes sévère. »
          </p>
          <p style={{ margin: 0, fontSize: 11, color: gold, fontWeight: 700 }}>Coran 14:7</p>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { value: gratitudes.length, label: 'Entrées totales', color: C.green },
          { value: streak,            label: 'Jours consécutifs', color: gold },
          { value: usedCategories.length, label: 'Catégories', color: isDark ? goldLight : C.green },
        ].map(stat => (
          <div key={stat.label} style={{ ...glass({ padding: '20px 16px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
            <IslamicPattern opacity={isDark ? 0.03 : 0.025} />
            <div style={{ position: 'relative' }}>
              <p style={{ margin: '0 0 6px', fontSize: 34, fontWeight: 800, color: stat.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
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
              Nouvelle entrée
            </p>
          </div>

          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value.slice(0, 300))}
            placeholder="Aujourd'hui, je suis reconnaissant(e) pour..."
            rows={4}
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(200,168,75,0.15)' : 'rgba(200,168,75,0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              color: C.textDark, fontSize: 14.5, resize: 'vertical', outline: 'none',
              lineHeight: 1.7, boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
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
            Catégorie
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                background: selectedCategory === cat ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
                color: selectedCategory === cat ? '#0D1810' : C.textMid,
                border: `1px solid ${selectedCategory === cat ? gold : C.border}`,
                borderRadius: 30, padding: '6px 16px', fontSize: 12.5, fontWeight: selectedCategory === cat ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ fontFamily: "'Scheherazade New', serif", fontSize: 14, color: 'inherit' }}>
                  {CATEGORY_ARABIC[cat]}
                </span>
                {cat}
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
            Enregistrer ma gratitude
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
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark, fontFamily: "'Playfair Display', serif" }}>
              Mes entrées
            </h2>
          </div>
          <span style={{ fontSize: 11.5, color: C.textLight }}>{filtered.length} note{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {['Tous', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{
              background: filterCategory === cat ? `rgba(200,168,75,0.14)` : 'transparent',
              color: filterCategory === cat ? gold : C.textMid,
              border: `1px solid ${filterCategory === cat ? 'rgba(200,168,75,0.4)' : C.border}`,
              borderRadius: 20, padding: '5px 14px', fontSize: 11.5,
              fontWeight: filterCategory === cat ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ ...glass({ padding: '56px 24px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
            <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: "'Scheherazade New', serif", fontSize: 32, color: isDark ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.5)', margin: '0 0 10px', direction: 'rtl' }}>
                الْحَمْدُ لِلَّهِ
              </p>
              <p style={{ color: C.textMid, margin: 0, fontSize: 13 }}>
                {filterCategory === 'Tous'
                  ? 'Aucune entrée pour le moment. Commencez par exprimer votre gratitude.'
                  : `Aucune entrée dans la catégorie « ${filterCategory} ».`}
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
                    title="J'aime">
                      {g.liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                    </button>
                    <button onClick={() => deleteGratitude(g.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: C.textLight, padding: 4, transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#e74c3c'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textLight; }}
                    title="Supprimer">
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
                    <span style={{ fontFamily: "'Scheherazade New', serif", fontSize: 13 }}>
                      {CATEGORY_ARABIC[g.category] || g.category}
                    </span>
                    {g.category}
                  </span>
                  <span style={{ fontSize: 10.5, color: C.textLight }}>{g.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
