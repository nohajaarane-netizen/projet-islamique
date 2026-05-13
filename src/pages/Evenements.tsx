import { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { useLanguage } from '../hooks/useLanguage';

type Category = 'Conférence' | 'Dua' | 'Ramadan' | 'Autre';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: Category;
}

const CATEGORY_COLORS: Record<Category, string> = {
  'Conférence': '#2E6B47',
  'Dua': '#7B5EA7',
  'Ramadan': '#b69a40',
  'Autre': '#5A7FA0',
};

const CATEGORY_ARABIC: Record<Category, string> = {
  'Conférence': 'مؤتمر',
  'Dua': 'دعاء',
  'Ramadan': 'رمضان',
  'Autre': 'أخرى',
};

const CATEGORY_EN: Record<Category, string> = {
  'Conférence': 'Conference',
  'Dua': 'Dua',
  'Ramadan': 'Ramadan',
  'Autre': 'Other',
};

const DEFAULT_EVENTS: Event[] = [
  { id: '1', title: 'Dua Tawwassoul',      date: '2025-05-24', time: '17:30', location: 'Convention City', category: 'Dua' },
  { id: '2', title: 'Ramadan Prep',         date: '2025-05-31', time: '17:30', location: 'Convention City', category: 'Ramadan' },
  { id: '3', title: 'Conférence Islamique', date: '2025-06-07', time: '10:00', location: 'Centre Culturel',  category: 'Conférence' },
];

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function parseDateParts(dateStr: string, lang: string): { day: string; month: string } {
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(dateStr + 'T00:00:00');
    const months = lang === 'en' ? MONTHS_EN : lang === 'ar' ? MONTHS_AR : MONTHS_FR;
    return { day: String(d.getDate()), month: months[d.getMonth()] };
  }
  const parts = dateStr.split(/[\s,/-]+/);
  return { day: parts[0] || '--', month: parts[1] || '' };
}

function sortByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const da = a.date.match(/^\d{4}-\d{2}-\d{2}$/) ? a.date : '9999-12-31';
    const db = b.date.match(/^\d{4}-\d{2}-\d{2}$/) ? b.date : '9999-12-31';
    return da.localeCompare(db);
  });
}

const CATEGORIES: Category[] = ['Conférence', 'Dua', 'Ramadan', 'Autre'];
const STORAGE_KEY = 'userEventsV2';

function loadEvents(): Event[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Event[];
  } catch { /* ignore */ }
  return DEFAULT_EVENTS;
}

function saveEvents(events: Event[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function IslamicPattern() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ip-eve" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,2 38,18 56,18 42,30 48,48 30,38 12,48 18,30 4,18 22,18" fill="none" stroke="#C8A84B" strokeWidth="0.8" />
          <circle cx="30" cy="30" r="5" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip-eve)" />
    </svg>
  );
}

function GoldStar({ size = 16 }: { size?: number }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 - 90) * Math.PI / 180;
    const r = i % 2 === 0 ? size / 2 : size / 4;
    return `${size / 2 + r * Math.cos(angle)},${size / 2 + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <polygon points={pts} fill="#C8A84B" />
    </svg>
  );
}

function SvgClock({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SvgPin({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Evenements() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isAr = language === 'ar';

  const [events, setEvents] = useState<Event[]>(() => loadEvents());
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '', date: '', time: '', location: '', category: 'Conférence',
  });

  useEffect(() => { saveEvents(events); }, [events]);

  const card = (extra?: CSSProperties): CSSProperties => ({
    background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 20,
    boxShadow: theme === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.32)',
    ...extra,
  });

  const inputStyle: CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: `1px solid ${C.border}`, background: C.cardBg2,
    color: C.textDark, fontSize: 14, fontFamily: "'Cairo', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    const ev: Event = { ...newEvent, id: Date.now().toString() };
    setEvents(sortByDate([...events, ev]));
    setShowForm(false);
    setNewEvent({ title: '', date: '', time: '', location: '', category: 'Conférence' });
  };

  const deleteEvent = (id: string) => {
    if (!window.confirm(t('evenements_extra.delete_confirm'))) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const getCategoryLabel = (cat: Category) =>
    isAr ? CATEGORY_ARABIC[cat] : language === 'en' ? CATEGORY_EN[cat] : cat;

  const sorted = sortByDate(events);

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
                  {t('evenements.title')}
                </h1>
                <p style={{ color: 'rgba(168,196,176,0.85)', fontSize: 13.5, margin: 0 }}>
                  {t('evenements_extra.hero_subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #C8A84B 0%, #E0C870 100%)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: showForm ? '1px solid rgba(200,168,75,0.4)' : 'none',
                borderRadius: 14, padding: '13px 26px',
                color: showForm ? '#E0C870' : '#1a1a0a',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif", flexShrink: 0, transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, fontWeight: 300 }}>{showForm ? '×' : '+'}</span>
              {showForm ? t('evenements_extra.close_btn') : t('evenements_extra.add_btn')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* ── FORM ─────────────────────────────────────────────────────────── */}
        {showForm && (
          <div style={{ ...card(), padding: '32px 28px', marginBottom: 28, borderLeft: isAr ? 'none' : `4px solid #C8A84B`, borderRight: isAr ? `4px solid #C8A84B` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <GoldStar size={18} />
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.8, color: '#C8A84B', fontWeight: 700 }}>
                {t('evenements_extra.new_event')}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {t('evenements_extra.title_label')}
              </label>
              <input type="text" placeholder={t('evenements_extra.title_placeholder')}
                value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  {t('evenements_extra.date_label')}
                </label>
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  {t('evenements_extra.time_label')}
                </label>
                <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {t('evenements_extra.location_label')}
              </label>
              <input type="text" placeholder={t('evenements_extra.location_placeholder')}
                value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                {t('evenements_extra.category_label')}
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => {
                  const active = newEvent.category === cat;
                  return (
                    <button key={cat} onClick={() => setNewEvent({ ...newEvent, category: cat })}
                      style={{
                        padding: '8px 16px', borderRadius: 20,
                        border: `2px solid ${active ? CATEGORY_COLORS[cat] : C.border}`,
                        background: active ? `${CATEGORY_COLORS[cat]}22` : C.cardBg2,
                        color: active ? CATEGORY_COLORS[cat] : C.textMid,
                        fontSize: isAr ? 15 : 13, fontWeight: active ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: "'Cairo', sans-serif",
                      }}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={addEvent} disabled={!newEvent.title.trim() || !newEvent.date}
              style={{
                background: newEvent.title.trim() && newEvent.date ? 'linear-gradient(135deg, #2E6B47, #4A9468)' : C.border,
                border: 'none', borderRadius: 12, padding: '13px 28px', color: '#fff',
                fontSize: 15, fontWeight: 600, width: '100%', letterSpacing: 0.3,
                cursor: newEvent.title.trim() && newEvent.date ? 'pointer' : 'not-allowed',
                fontFamily: "'Cairo', sans-serif",
              }}>
              {t('evenements_extra.save_event')}
            </button>
          </div>
        )}

        {/* ── EVENT LIST ───────────────────────────────────────────────────── */}
        {sorted.length === 0 ? (
          <div style={{ ...card(), padding: '72px 28px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, color: C.textMid, margin: '0 0 8px' }}>
              {t('evenements_extra.no_events_title')}
            </p>
            <p style={{ color: C.textLight, fontSize: 14, margin: 0 }}>
              {t('evenements_extra.no_events_desc')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sorted.map((ev) => {
              const { day, month } = parseDateParts(ev.date, language);
              const catColor = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['Autre'];
              return (
                <div key={ev.id} style={{
                  ...card(), padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20,
                  borderLeft: isAr ? 'none' : `3px solid ${catColor}`,
                  borderRight: isAr ? `3px solid ${catColor}` : 'none',
                }}>
                  <div style={{
                    flexShrink: 0, width: 64, height: 64, borderRadius: 16,
                    background: `linear-gradient(135deg, ${catColor}cc, ${catColor})`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 1, boxShadow: `0 4px 12px ${catColor}40`,
                  }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: "'Cairo', sans-serif" }}>{day}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{month}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: "'Cairo', sans-serif", fontSize: 17, fontWeight: 700,
                        color: C.textDark, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{ev.title}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: catColor, background: `${catColor}18`,
                        border: `1px solid ${catColor}44`, borderRadius: 20, padding: '3px 10px',
                        whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5,
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: isAr ? 13 : 11,
                      } as CSSProperties}>
                        {getCategoryLabel(ev.category)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      {ev.time && (
                        <span style={{ fontSize: 12, color: C.textMid, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <SvgClock color={C.textLight} size={11} />{ev.time}
                        </span>
                      )}
                      {ev.location && (
                        <span style={{ fontSize: 12, color: C.textLight, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <SvgPin color={C.textLight} size={11} />{ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteEvent(ev.id)} title={t('common.delete')}
                    style={{
                      flexShrink: 0, background: 'none', border: `1px solid ${C.border}`, borderRadius: 10,
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: C.textLight, fontSize: 16, transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#c0392b1a'; e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                    onMouseOut={(e)  => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textLight; }}
                  ><FaTimes /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
