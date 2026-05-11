import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { FaHeart, FaRegHeart, FaCopy, FaBookmark, FaRegBookmark } from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = 'Quotidien' | 'Protection' | 'Gratitude' | 'Foi' | 'Connaissance' | 'Famille';

interface HadithItem {
  id: number; arabic: string; transliteration?: string;
  french: string; english?: string; source: string; theme: Theme;
}

interface DuaItem {
  id: number; arabic: string; transliteration?: string;
  french: string; english?: string; source: string; theme: Theme;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const hadiths: HadithItem[] = [
  { id:1, arabic:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', transliteration:"Innamā al-aʿmālu bin-niyyāt", french:"Les actions ne valent que par les intentions, et chacun n'a que ce qu'il a intentionné.", english:"Actions are judged by intentions, and each person will have what they intended.", source:'Sahih al-Bukhari (1)', theme:'Quotidien' },
  { id:2, arabic:'الدِّينُ النَّصِيحَةُ', transliteration:"Ad-dīnu an-nasīḥah", french:"La religion, c'est la sincérité et le bon conseil.", english:"The religion is sincerity and good counsel.", source:'Sahih Muslim (55)', theme:'Foi' },
  { id:3, arabic:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', transliteration:"Khayrukum man taʿallama al-Qurʾāna wa ʿallamah", french:"Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.", english:"The best among you are those who learn the Quran and teach it.", source:'Sahih al-Bukhari (5027)', theme:'Connaissance' },
  { id:4, arabic:'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ', transliteration:"Man lā yarḥamu lā yurḥam", french:"Celui qui n'est pas miséricordieux ne sera pas traité avec miséricorde.", english:"Whoever does not show mercy will not be shown mercy.", source:'Sahih al-Bukhari (5999)', theme:'Quotidien' },
  { id:5, arabic:'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', transliteration:"Ṭalabu al-ʿilmi farīḍatun ʿalā kulli muslim", french:"Rechercher la connaissance est une obligation pour tout musulman.", english:"Seeking knowledge is an obligation upon every Muslim.", source:'Sunan Ibn Majah (224)', theme:'Connaissance' },
  { id:6, arabic:'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', transliteration:"Tabassumukal-ā fī wajhi akhīka ṣadaqah", french:"Ton sourire envers ton frère est une aumône.", english:"Your smile in your brother's face is a charity.", source:'Sahih at-Tirmidhi (1956)', theme:'Quotidien' },
  { id:7, arabic:'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', transliteration:"Man dalla ʿalā khayrin falahu mithlu ajri fāʿilih", french:"Celui qui guide vers un bien aura la récompense de celui qui l'accomplit.", english:"Whoever guides someone to goodness will have a reward like the one who did it.", source:'Sahih Muslim (1893)', theme:'Quotidien' },
  { id:8, arabic:'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', transliteration:"Ad-dunyā sijnu al-muʾmini wa jannatu al-kāfir", french:"Ce monde est une prison pour le croyant et un paradis pour le mécréant.", english:"This world is a prison for the believer and a paradise for the disbeliever.", source:'Sahih Muslim (2956)', theme:'Foi' },
];

const duas: DuaItem[] = [
  { id:101, arabic:'رَبِّ زِدْنِي عِلْمًا', transliteration:"Rabbi zidnī ʿilmā", french:"Mon Seigneur, augmente-moi en science.", english:"My Lord, increase me in knowledge.", source:'Coran 20:114', theme:'Connaissance' },
  { id:102, arabic:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ', transliteration:"Ḥasbiya-Llāhu lā ilāha illā huwa ʿalayhi tawakkaltu", french:"Allah me suffit, il n'y a de divinité que Lui. C'est en Lui que je mets ma confiance.", english:"Allah is sufficient for me, there is no deity but Him. In Him I put my trust.", source:'Coran 9:129', theme:'Protection' },
  { id:103, arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', transliteration:"Rabbanā ātinā fī ad-dunyā ḥasanatan wa fī al-ākhirati ḥasanatan", french:"Notre Seigneur, donne-nous ce qui est bien dans ce monde et dans l'au-delà, et préserve-nous du châtiment du Feu.", english:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.", source:'Coran 2:201', theme:'Gratitude' },
  { id:104, arabic:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', transliteration:"Allāhumma innī as'aluka al-ʿāfiyata fī ad-dunyā wa al-ākhirah", french:"Ô Allah, je Te demande la bonne santé dans ce monde et dans l'au-delà.", english:"O Allah, I ask You for well-being in this world and the Hereafter.", source:'Sunan Abi Dawud (5074)', theme:'Protection' },
  { id:105, arabic:'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي', transliteration:"Allāhumma ighfir lī wa-rḥamnī wa-hdinī wa-rzuqnī", french:"Ô Allah, pardonne-moi, accorde-moi Ta miséricorde, guide-moi et pourvois à mes besoins.", english:"O Allah, forgive me, have mercy on me, guide me and provide for me.", source:'Sahih Muslim (2697)', theme:'Quotidien' },
  { id:106, arabic:'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', transliteration:"Rabbi shraḥ lī ṣadrī wa yassir lī amrī", french:"Mon Seigneur, ouvre ma poitrine, facilite-moi ma tâche.", english:"My Lord, expand my chest and ease my task.", source:'Coran 20:25-26', theme:'Foi' },
];

const FEATURED_HADITH = hadiths[0];
const THEME_FILTERS = ['Tous', 'Quotidien', 'Protection', 'Gratitude', 'Foi', 'Connaissance', 'Famille'];

const gold = '#C8A84B';
const goldLight = '#E0C870';

// ─── Islamic Pattern ──────────────────────────────────────────────────────────

const IslamicPattern = ({ opacity = 0.06, color = gold }: { opacity?: number; color?: string }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="ip-hadith" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect x="8" y="8" width="44" height="44" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        <rect x="8" y="8" width="44" height="44" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} transform="rotate(45 30 30)" />
        <circle cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity * 0.7} />
        <circle cx="30" cy="30" r="2" fill={color} opacity={opacity * 0.5} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ip-hadith)" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function HadithDua() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'hadiths' | 'duas'>('hadiths');
  const [themeFilter, setThemeFilter] = useState('Tous');
  const [displayLang, setDisplayLang] = useState<'fr' | 'en'>('fr');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try { const s = localStorage.getItem('hadith-favorites'); return s ? new Set(JSON.parse(s)) : new Set(); }
    catch { return new Set(); }
  });
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('hadith-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const copyText = (item: HadithItem | DuaItem) => {
    navigator.clipboard.writeText(`${item.arabic}\n\n${item.french}\n\n— ${item.source}`).catch(() => {});
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const matchesSearch = (item: HadithItem | DuaItem) => {
    const q = search.toLowerCase();
    return item.french.toLowerCase().includes(q) || item.arabic.includes(q) || item.source.toLowerCase().includes(q) || (item.english || '').toLowerCase().includes(q);
  };

  const filteredHadiths = hadiths.filter(h => matchesSearch(h) && (themeFilter === 'Tous' || h.theme === themeFilter));
  const filteredDuas = duas.filter(d => matchesSearch(d) && (themeFilter === 'Tous' || d.theme === themeFilter));

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

  const themeColors: Record<string, string> = {
    Quotidien: C.green, Protection: '#3B82F6', Gratitude: gold,
    Foi: '#8B5CF6', Connaissance: '#10B981', Famille: '#F59E0B',
  };

  const renderCard = (item: HadithItem | DuaItem) => (
    <div key={item.id} style={{
      ...glass({ padding: '26px 28px', marginBottom: 14 }),
      position: 'relative', overflow: 'hidden',
      borderLeft: `3px solid ${themeColors[item.theme] || gold}`,
    }}>
      <IslamicPattern opacity={isDark ? 0.03 : 0.025} />

      <div style={{ position: 'relative' }}>
        {/* Arabic text — large Scheherazade */}
        <p style={{
          margin: '0 0 10px', textAlign: 'right', direction: 'rtl',
          fontFamily: "'Scheherazade New', 'Amiri', serif",
          fontSize: 'clamp(20px,3vw,26px)', color: isDark ? goldLight : '#1B3022',
          lineHeight: 1.85, letterSpacing: '0.01em',
          textShadow: isDark ? `0 0 20px rgba(200,168,75,0.1)` : 'none',
        }}>
          {item.arabic}
        </p>

        {/* Transliteration */}
        {item.transliteration && (
          <p style={{
            margin: '0 0 10px', fontSize: 12.5, color: gold,
            fontStyle: 'italic', lineHeight: 1.5,
            fontFamily: "'Inter', sans-serif",
          }}>
            {item.transliteration}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${gold}44, transparent)`, margin: '10px 0' }} />

        {/* Translation */}
        <p style={{
          margin: '0 0 14px', fontSize: 14, fontStyle: 'italic',
          color: C.textMid, lineHeight: 1.75,
          fontFamily: "'Inter', sans-serif",
        }}>
          « {displayLang === 'en' && item.english ? item.english : item.french} »
        </p>

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              background: `${themeColors[item.theme] || gold}18`,
              border: `1px solid ${themeColors[item.theme] || gold}44`,
              borderRadius: 20, padding: '3px 12px', fontSize: 10.5,
              color: themeColors[item.theme] || gold, fontWeight: 700, letterSpacing: '0.05em',
            }}>
              {item.theme}
            </span>
            <span style={{ fontSize: 11.5, color: C.textLight }}>{item.source}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => copyText(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === item.id ? C.green : C.textLight, padding: 4, transition: 'color 0.15s', display: 'flex', alignItems: 'center' }} title="Copier">
              <FaCopy size={13} />
            </button>
            <button onClick={() => toggleFavorite(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: favorites.has(item.id) ? '#e74c3c' : C.textLight, padding: 4, transition: 'color 0.15s, transform 0.15s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              title="Favori">
              {favorites.has(item.id) ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 48 }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', borderRadius: 26, overflow: 'hidden', marginBottom: 28,
        backgroundImage: `linear-gradient(145deg, rgba(6,15,10,0.96) 0%, rgba(18,48,30,0.88) 50%, rgba(8,20,14,0.78) 100%), url('/photomosquee.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        minHeight: 230, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '44px 40px 36px',
      }}>
        <IslamicPattern opacity={0.08} color={gold} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)` }} />

        {/* Watermark verse */}
        <p style={{
          position: 'absolute', top: 22, right: 36, margin: 0, pointerEvents: 'none',
          fontFamily: "'Scheherazade New', serif", fontSize: 18,
          color: 'rgba(200,168,75,0.16)', direction: 'rtl',
        }}>
          وَمَا يَنطِقُ عَنِ الْهَوَىٰ · إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ
        </p>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
            </svg>
            <span style={{ fontSize: 10, color: 'rgba(224,200,112,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              Paroles prophétiques &amp; Invocations
            </span>
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>
            Hadith &amp; Du'a
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 480 }}>
            Une lumière prophétique pour chaque instant de votre vie quotidienne.
          </p>
        </div>
      </div>

      <div style={{ padding: '0 2px' }}>

        {/* ── FEATURED HADITH ───────────────────────────────────────────── */}
        <div style={{
          ...glass({ padding: '30px 30px 26px', marginBottom: 28 }),
          position: 'relative', overflow: 'hidden',
          borderTop: `3px solid ${gold}`,
        }}>
          <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="10" height="10" viewBox="0 0 20 20">
                  <polygon points="10,1 12,8 19,8 13,12 15,19 10,15 5,19 7,12 1,8 8,8" fill={gold} />
                </svg>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: gold, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Hadith du Jour
                </span>
              </div>
              <button
                onClick={() => setBookmarked(b => !b)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarked ? gold : C.textLight, display: 'flex', alignItems: 'center', padding: 4, transition: 'color 0.15s' }}>
                {bookmarked ? <FaBookmark size={15} /> : <FaRegBookmark size={15} />}
              </button>
            </div>

            {/* Large Arabic */}
            <p style={{
              margin: '0 0 12px', textAlign: 'right', direction: 'rtl',
              fontFamily: "'Scheherazade New', 'Amiri', serif",
              fontSize: 'clamp(28px,5vw,40px)',
              color: isDark ? goldLight : '#1B3022',
              lineHeight: 1.8, letterSpacing: '0.01em',
              textShadow: isDark ? `0 0 30px rgba(200,168,75,0.15)` : 'none',
            }}>
              {FEATURED_HADITH.arabic}
            </p>

            {/* Gold divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${gold}55, transparent)`, margin: '12px 0' }} />

            <p style={{ margin: '0 0 10px', fontSize: 12.5, color: gold, fontStyle: 'italic' }}>
              {FEATURED_HADITH.transliteration}
            </p>
            <p style={{ margin: '0 0 14px', fontSize: 16, fontStyle: 'italic', color: C.textMid, lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
              « {displayLang === 'en' && FEATURED_HADITH.english ? FEATURED_HADITH.english : FEATURED_HADITH.french} »
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: C.textLight }}>{FEATURED_HADITH.source}</p>
          </div>
        </div>

        {/* ── SEARCH + LANG TOGGLE ──────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            ...glass({ padding: '0 18px', borderRadius: 40 }),
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textLight} strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Rechercher un hadith ou une invocation..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '13px 0', background: 'transparent', border: 'none', outline: 'none', color: C.textDark, fontSize: 13 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight, fontSize: 18 }}>×</button>
            )}
          </div>

          {/* FR / EN toggle */}
          <div style={{ ...glass({ padding: 4, borderRadius: 40, display: 'flex', gap: 4 }) }}>
            {(['fr', 'en'] as const).map(l => (
              <button key={l} onClick={() => setDisplayLang(l)} style={{
                padding: '7px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
                background: displayLang === l ? `linear-gradient(135deg,${gold},#A8882A)` : 'transparent',
                color: displayLang === l ? '#0D1810' : C.textMid,
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['hadiths', 'duas'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? `linear-gradient(135deg,${C.green},#1B4A30)` : 'transparent',
              color: activeTab === tab ? '#fff' : C.textMid,
              border: `1px solid ${activeTab === tab ? C.green : C.border}`,
              borderRadius: 30, padding: '9px 24px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: activeTab === tab ? `0 4px 14px rgba(46,100,67,0.25)` : 'none',
            }}>
              {tab === 'hadiths' ? 'Hadiths' : "Du'as"}
            </button>
          ))}
        </div>

        {/* ── THEME FILTERS ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
          {THEME_FILTERS.map(tf => (
            <button key={tf} onClick={() => setThemeFilter(tf)} style={{
              background: themeFilter === tf ? `${themeColors[tf] || gold}18` : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              color: themeFilter === tf ? (themeColors[tf] || gold) : C.textMid,
              border: `1px solid ${themeFilter === tf ? (themeColors[tf] || gold) + '55' : C.border}`,
              borderRadius: 20, padding: '5px 14px', fontSize: 11.5,
              fontWeight: themeFilter === tf ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {tf}
            </button>
          ))}
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        {activeTab === 'hadiths' && (
          filteredHadiths.length === 0
            ? <div style={{ ...glass({ padding: '48px 24px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
                <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
                <p style={{ fontFamily: "'Scheherazade New', serif", fontSize: 28, color: C.textLight, margin: '0 0 8px', direction: 'rtl' }}>لا نتائج</p>
                <p style={{ color: C.textMid, margin: 0, fontSize: 13 }}>Aucun hadith ne correspond à votre recherche.</p>
              </div>
            : filteredHadiths.map(h => renderCard(h))
        )}

        {activeTab === 'duas' && (
          filteredDuas.length === 0
            ? <div style={{ ...glass({ padding: '48px 24px', textAlign: 'center' }), position: 'relative', overflow: 'hidden' }}>
                <IslamicPattern opacity={isDark ? 0.04 : 0.03} />
                <p style={{ fontFamily: "'Scheherazade New', serif", fontSize: 28, color: C.textLight, margin: '0 0 8px', direction: 'rtl' }}>لا نتائج</p>
                <p style={{ color: C.textMid, margin: 0, fontSize: 13 }}>Aucune invocation ne correspond à votre recherche.</p>
              </div>
            : filteredDuas.map(d => renderCard(d))
        )}
      </div>
    </div>
  );
}
