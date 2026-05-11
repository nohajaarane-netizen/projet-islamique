import { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
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
  const d = (fr: string, en: string, ar: string) => language === 'en' ? en : isAr ? ar : fr;

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
      date: new Date().toLocaleDateString(isAr ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
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
  const filterLabel = (cat: FavCategory | 'Tous') => cat === 'Tous' ? d('Tous', 'All', 'الكل') : getCatLabel(cat as FavCategory);

  return (
    <div style={{ fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', minHeight: '100vh', background: C.pageBg, direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage: `linear-gradient(160deg, rgba(12,34,24,0.96) 0%, rgba(26,61,40,0.90) 55%, rgba(14,45,30,0.96) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '64px 24px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #C8A84B, #E0C870, #C8A84B, transparent)' }} />
        <IslamicPattern />
        {isAr && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Scheherazade New', serif", fontSize: 'clamp(20px,5vw,52px)',
            color: '#ffffff', opacity: 0.04, pointerEvents: 'none', userSelect: 'none', textAlign: 'center', padding: '0 24px',
          }}>
            وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً
          </div>
        )}
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{ fontFamily: isAr ? "'Scheherazade New', serif" : "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: '#F5F0E2', margin: '0 0 10px' }}>
                {t('favoris.title', d('Favoris', 'Favorites', 'المفضلة'))}
              </h1>
              <p style={{ color: 'rgba(168,196,176,0.9)', fontSize: 15, margin: 0 }}>
                {d('Vos versets, dhikrs et duas préférés', 'Your favorite verses, dhikrs and duas', 'آياتك وأذكارك وأدعيتك المفضلة')}
              </p>
            </div>
            <button onClick={() => setShowForm((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #C8A84B 0%, #E0C870 100%)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: showForm ? '1px solid rgba(200,168,75,0.4)' : 'none',
                borderRadius: 14, padding: '13px 26px',
                color: showForm ? '#E0C870' : '#1a1a0a',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0, transition: 'all 0.3s',
              }}>
              <span style={{ fontSize: 20, lineHeight: 1, fontWeight: 300 }}>{showForm ? '×' : '+'}</span>
              {showForm ? d('Fermer', 'Close', 'إغلاق') : d('Ajouter', 'Add', 'إضافة')}
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
                {d('Nouveau favori', 'New favorite', 'مفضلة جديدة')}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {d('Texte', 'Text', 'النص')}
              </label>
              <textarea placeholder={t('favoris.add_placeholder', d('Entrez un verset, dhikr ou dua...', 'Enter a verse, dhikr or dua...', 'أدخل آية أو ذكراً أو دعاء...'))}
                value={newText} onChange={(e) => setNewText(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.cardBg2, color: C.textDark, fontSize: 14, fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 } as CSSProperties}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {d('Catégorie', 'Category', 'الفئة')}
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {FAV_CATEGORIES.map((cat) => {
                  const active = newCat === cat;
                  return (
                    <button key={cat} onClick={() => setNewCat(cat)}
                      style={{ padding: '8px 16px', borderRadius: 20, border: `2px solid ${active ? CATEGORY_COLORS[cat] : C.border}`, background: active ? `${CATEGORY_COLORS[cat]}22` : C.cardBg2, color: active ? CATEGORY_COLORS[cat] : C.textMid, fontSize: isAr ? 15 : 13, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', transition: 'all 0.2s' }}>
                      {getCatLabel(cat)}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={addFavorite} disabled={!newText.trim()}
              style={{ background: newText.trim() ? 'linear-gradient(135deg, #C8A84B, #E0C870)' : C.border, border: 'none', borderRadius: 12, padding: '13px 28px', color: newText.trim() ? '#1a1a0a' : C.textLight, fontSize: 15, fontWeight: 700, cursor: newText.trim() ? 'pointer' : 'not-allowed', fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', width: '100%', transition: 'all 0.3s' }}>
              {t('favoris.add_button', d('Enregistrer dans les favoris', 'Save to favorites', 'حفظ في المفضلة'))}
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
                  style={{ padding: '7px 16px', borderRadius: 20, border: `1.5px solid ${active ? color : C.border}`, background: active ? `${color}20` : C.cardBg, color: active ? color : C.textMid, fontSize: 13, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
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
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.textMid, margin: '0 0 8px' }}>
              {favorites.length === 0 ? d('Aucun favori enregistré', 'No saved favorites', 'لا توجد مفضلات محفوظة') : d('Aucun résultat', 'No results', 'لا توجد نتائج')}
            </p>
            <p style={{ color: C.textLight, fontSize: 14, margin: '0 0 20px' }}>
              {t('favoris.empty', d('Ajoutez vos versets, dhikrs et duas préférés.', 'Add your favorite verses, dhikrs and duas.', 'أضف آياتك وأذكارك وأدعيتك المفضلة.'))}
            </p>
            {favorites.length === 0 && (
              <button onClick={() => setShowForm(true)}
                style={{ background: 'linear-gradient(135deg, #C8A84B, #E0C870)', border: 'none', borderRadius: 12, padding: '12px 28px', color: '#1a1a0a', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {d('+ Ajouter mon premier favori', '+ Add my first favorite', '+ إضافة مفضلتي الأولى')}
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
                      <span style={{ fontSize: isAr ? 13 : 11, fontWeight: 700, color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: 20, padding: '3px 10px', fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif', textTransform: isAr ? 'none' : 'uppercase', letterSpacing: isAr ? 0 : 0.5 }}>
                        {getCatLabel(fav.category)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11.5, color: C.textLight, fontStyle: 'italic' }}>{fav.date}</span>
                      <button onClick={() => removeFavorite(fav.id)} title={d('Supprimer', 'Delete', 'حذف')}
                        style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textLight, fontSize: 13, transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#c0392b1a'; e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                        onMouseOut={(e)  => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; }}>
                        ✕
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: C.textDark, lineHeight: 1.75, fontFamily: isAr ? "'Scheherazade New', serif" : 'Inter, sans-serif' }}>
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
            <p style={{ fontFamily: "'Scheherazade New', serif", fontSize: 'clamp(18px,3vw,22px)', color: C.textDark, direction: 'rtl', textAlign: 'right', margin: '0 0 10px', lineHeight: 1.8 }}>
              وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ
            </p>
            <p style={{ fontSize: 12.5, color: C.textLight, margin: 0, fontStyle: 'italic', textAlign: 'right', fontFamily: "'Scheherazade New', serif" }}>
              سورة الأعراف — 7:205
            </p>
          </div>
        )}
        {favorites.length > 0 && !isAr && (
          <div style={{ ...card({ padding: '24px 28px', marginTop: 24 }), borderLeft: `4px solid #C8A84B` }}>
            <p style={{ fontSize: 13, color: C.textLight, margin: 0, fontStyle: 'italic' }}>
              {d(
                '« Souviens-toi de ton Seigneur en toi-même, avec humilité et crainte. » — Coran 7:205',
                '"Remember your Lord within yourself, with humility and reverence." — Quran 7:205',
                ''
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
