import { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { lightTheme, darkTheme } from '../theme/colors';

interface Favorite { id: number; text: string; date: string; category: FavCategory; }
type FavCategory = 'Dhikr' | 'Dua' | 'Verset' | 'Hadith' | 'Autre';

const FAV_CATEGORIES: FavCategory[] = ['Dhikr', 'Dua', 'Verset', 'Hadith', 'Autre'];

const CATEGORY_LABELS: Record<FavCategory, { fr: string; en: string; ar: string }> = {
  Dhikr:  { fr: 'Dhikr',   en: 'Dhikr',   ar: 'ذكر' },
  Dua:    { fr: 'Dua',     en: 'Dua',     ar: 'دعاء' },
  Verset: { fr: 'Verset',  en: 'Verse',   ar: 'آية' },
  Hadith: { fr: 'Hadith',  en: 'Hadith',  ar: 'حديث' },
  Autre:  { fr: 'Autre',   en: 'Other',   ar: 'أخرى' },
};

const CATEGORY_COLORS: Record<FavCategory, string> = {
  Dhikr: '#2E6B47', Dua: '#7B5EA7', Verset: '#b69a40', Hadith: '#5A7FA0', Autre: '#7a6a5a',
};

function IslamicPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip-fav" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,2 38,18 56,18 42,30 48,48 30,38 12,48 18,30 4,18 22,18" fill="none" stroke="#C8A84B" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip-fav)" />
    </svg>
  );
}

function GoldStar({ size = 16 }: { size?: number }) {
  const pts = Array.from({ length: 8 }, (_, i) => { const a = (i * 45 - 90) * Math.PI / 180, r = i % 2 === 0 ? size / 2 : size / 4; return `${size / 2 + r * Math.cos(a)},${size / 2 + r * Math.sin(a)}`; }).join(' ');
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}><polygon points={pts} fill="#C8A84B" /></svg>;
}

function SvgBookmark({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;
}

function loadFavorites(): Favorite[] {
  try {
    const saved = localStorage.getItem('favorites');
    if (saved) return (JSON.parse(saved) as any[]).map(f => ({ ...f, category: f.category || 'Autre' }));
  } catch { /* ignore */ }
  return [];
}

export default function Favoris() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isAr = language === 'ar';

  const [favorites, setFavorites] = useState<Favorite[]>(() => loadFavorites());
  const [newText, setNewText]     = useState('');
  const [newCat, setNewCat]       = useState<FavCategory>('Dhikr');
  const [showForm, setShowForm]   = useState(false);
  const [filter, setFilter]       = useState<FavCategory | 'Tous'>('Tous');

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

  const getCatLabel = (cat: FavCategory) => {
    const labels = CATEGORY_LABELS[cat];
    return isAr ? labels.ar : language === 'en' ? labels.en : labels.fr;
  };

  const addFavorite = () => {
    if (!newText.trim()) return;
    const item: Favorite = {
      id: Date.now(), text: newText.trim(), category: newCat,
      date: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setFavorites([item, ...favorites]);
    setNewText(''); setShowForm(false);
  };

  const removeFavorite = (id: number) => setFavorites(favorites.filter((f) => f.id !== id));

  const card = (extra?: CSSProperties): CSSProperties => ({
    background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 20,
    boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.32)',
    ...extra,
  });

  const filtered = filter === 'Tous' ? favorites : favorites.filter((f) => f.category === filter);
  const filterLabel = (cat: FavCategory | 'Tous') => cat === 'Tous' ? t('favoris_extra.filter_all') : getCatLabel(cat as FavCategory);

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
                <svg width="7" height="7" viewBox="0 0 20 20"><polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill="#C8A84B" /></svg>
                <div style={{ height: 1, width: 18, background: 'rgba(200,168,75,0.5)' }} />
              </div>
              <div style={{ borderLeft: '3px solid rgba(200,168,75,0.75)', paddingLeft: 16 }}>
                <h1 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#F5F0E2', margin: '0 0 7px', letterSpacing: '-0.01em' }}>
                  {t('favoris.title')}
                </h1>
                <p style={{ color: 'rgba(168,196,176,0.85)', fontSize: 13.5, margin: 0 }}>
                  {t('favoris_extra.hero_subtitle')}
                </p>
              </div>
            </div>
            <button onClick={() => setShowForm((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #C8A84B 0%, #E0C870 100%)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: showForm ? '1px solid rgba(200,168,75,0.4)' : 'none',
                borderRadius: 14, padding: '13px 26px',
                color: showForm ? '#E0C870' : '#1a1a0a',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", flexShrink: 0, transition: 'all 0.3s',
              }}>
              <span style={{ fontSize: 20, lineHeight: 1, fontWeight: 300 }}>{showForm ? '×' : '+'}</span>
              {showForm ? t('favoris_extra.close_btn') : t('favoris_extra.add_btn')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── ADD FORM ─────────────────────────────────────────────────────── */}
        {showForm && (
          <div style={{ ...card(), padding: '28px 28px', marginBottom: 24, borderLeft: isAr ? 'none' : `4px solid #C8A84B`, borderRight: isAr ? `4px solid #C8A84B` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <GoldStar size={18} />
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.8, color: '#C8A84B', fontWeight: 700 }}>
                {t('favoris_extra.new_favorite')}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {t('favoris_extra.text_label')}
              </label>
              <textarea placeholder={t('favoris_extra.text_placeholder')}
                value={newText} onChange={(e) => setNewText(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.cardBg2, color: C.textDark, fontSize: 14, fontFamily: "'Cairo', sans-serif", outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 } as CSSProperties}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {t('favoris_extra.category_label')}
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {FAV_CATEGORIES.map((cat) => {
                  const active = newCat === cat;
                  return (
                    <button key={cat} onClick={() => setNewCat(cat)}
                      style={{ padding: '8px 16px', borderRadius: 20, border: `2px solid ${active ? CATEGORY_COLORS[cat] : C.border}`, background: active ? `${CATEGORY_COLORS[cat]}22` : C.cardBg2, color: active ? CATEGORY_COLORS[cat] : C.textMid, fontSize: isAr ? 15 : 13, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", transition: 'all 0.2s' }}>
                      {getCatLabel(cat)}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={addFavorite} disabled={!newText.trim()}
              style={{ background: newText.trim() ? 'linear-gradient(135deg, #C8A84B, #E0C870)' : C.border, border: 'none', borderRadius: 12, padding: '13px 28px', color: newText.trim() ? '#1a1a0a' : C.textLight, fontSize: 15, fontWeight: 700, cursor: newText.trim() ? 'pointer' : 'not-allowed', fontFamily: "'Cairo', sans-serif", width: '100%', transition: 'all 0.3s' }}>
              {t('favoris_extra.save_btn')}
            </button>
          </div>
        )}

        {/* ── FILTER PILLS ─────────────────────────────────────────────────── */}
        {favorites.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {(['Tous', ...FAV_CATEGORIES] as const).map((cat) => {
              const active = filter === cat;
              const color = cat === 'Tous' ? C.green : CATEGORY_COLORS[cat as FavCategory];
              const count = cat === 'Tous' ? favorites.length : favorites.filter(f => f.category === cat).length;
              if (cat !== 'Tous' && count === 0) return null;
              return (
                <button key={cat} onClick={() => setFilter(cat)}
                  style={{ padding: '7px 16px', borderRadius: 20, border: `1.5px solid ${active ? color : C.border}`, background: active ? `${color}20` : C.cardBg, color: active ? color : C.textMid, fontSize: 13, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                  {filterLabel(cat)}
                  <span style={{ background: active ? color : C.border, color: active ? '#fff' : C.textLight, borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── LIST ─────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{ ...card(), padding: '72px 28px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, color: C.textMid, margin: '0 0 8px' }}>
              {favorites.length === 0 ? t('favoris_extra.no_favorites') : t('favoris_extra.no_results')}
            </p>
            <p style={{ color: C.textLight, fontSize: 14, margin: '0 0 20px' }}>
              {t('favoris_extra.add_first')}
            </p>
            {favorites.length === 0 && (
              <button onClick={() => setShowForm(true)}
                style={{ background: 'linear-gradient(135deg, #C8A84B, #E0C870)', border: 'none', borderRadius: 12, padding: '12px 28px', color: '#1a1a0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
                {t('favoris_extra.add_btn')}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((fav) => {
              const catColor = CATEGORY_COLORS[fav.category];
              return (
                <div key={fav.id} style={{ ...card(), padding: '22px 24px', borderLeft: isAr ? 'none' : `3px solid ${catColor}`, borderRight: isAr ? `3px solid ${catColor}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SvgBookmark color={catColor} size={14} />
                      <span style={{ fontSize: isAr ? 13 : 11, fontWeight: 700, color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: 20, padding: '3px 10px', fontFamily: "'Cairo', sans-serif", textTransform: isAr ? 'none' : 'uppercase', letterSpacing: isAr ? 0 : 0.5 }}>
                        {getCatLabel(fav.category)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11.5, color: C.textLight, fontStyle: 'italic' }}>{fav.date}</span>
                      <button onClick={() => removeFavorite(fav.id)} title={t('common.delete')}
                        style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textLight, fontSize: 13, transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#c0392b1a'; e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                        onMouseOut={(e)  => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; }}><FaTimes /></button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: C.textDark, lineHeight: 1.75, fontFamily: "'Cairo', sans-serif" }}>
                    {fav.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FOOTER VERSE ─────────────────────────────────────────────────── */}
        {favorites.length > 0 && isAr && (
          <div style={{ ...card({ padding: '24px 28px', marginTop: 24 }), borderRight: `4px solid #C8A84B` }}>
            <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 'clamp(18px,3vw,22px)', color: C.textDark, direction: 'rtl', textAlign: 'right', margin: '0 0 10px', lineHeight: 1.8 }}>
              وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ
            </p>
            <p style={{ fontSize: 12.5, color: C.textLight, margin: 0, fontStyle: 'italic', textAlign: 'right', fontFamily: "'Cairo', sans-serif" }}>
              سورة الأعراف — 7:205
            </p>
          </div>
        )}
        {favorites.length > 0 && !isAr && (
          <div style={{ ...card({ padding: '24px 28px', marginTop: 24 }), borderLeft: `4px solid #C8A84B` }}>
            <p style={{ fontSize: 13, color: C.textLight, margin: 0, fontStyle: 'italic' }}>
              {t('favoris_extra.verse_quote')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
