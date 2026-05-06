import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '../hooks/useCountdown';
import QiblaCompass from '../components/layout/QiblaCompass';
import { useTheme } from '../hooks/useTheme';
import { lightTheme, darkTheme } from '../theme/colors';
import { PRAYER_TIMES } from '../data/prayerTimes';
import { STAT_CARDS } from '../data/statCards';
import { HADITH_OF_DAY } from '../data/hadiths';

export default function Accueil() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const countdown = useCountdown(2 * 3600 + 52 * 60 + 34);

  const cardStyle = (extra?: React.CSSProperties) => ({
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: "14px",
    boxShadow: theme === 'light'
      ? "0 1px 8px rgba(0,0,0,0.05)"
      : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
    ...extra,
  });

  // ✅ Stat cards : labels + sous-textes entièrement traduits via i18n
  // On ne dépend plus des données brutes de STAT_CARDS pour les textes
  const statCards = [
    {
      icon: "🤲",
      iconBg: "rgba(45,106,79,0.10)",
      label: t('stats.prayers_today'),
      value: "5 / 3",
      progress: 60,
      sub: t('stats.completed'),
    },
    {
      icon: "🔥",
      iconBg: "rgba(255,140,0,0.10)",
      label: t('stats.current_streak'),
      value: "7",
      progress: 70,
      sub: t('stats.days'),
    },
    {
      icon: "🔆",
      iconBg: "rgba(45,106,79,0.10)",
      label: t('stats.dhikr_today'),
      value: "120",
      progress: undefined,
      sub: t('stats.repetitions'),
    },
    {
      icon: "⭐",
      iconBg: "rgba(232,204,100,0.12)",
      label: t('stats.spiritual_score'),
      value: "85%",
      progress: undefined,
      sub: t('stats.excellent'),
    },
  ];

  // ✅ Outils spirituels : titres + descriptions traduits via i18n
  const spiritualTools = [
    {
      id: "salat",
      icon: "🤲",
      title: t('tools.salat_title'),
      subtitle: t('tools.salat_desc'),
    },
    {
      id: "alhamd",
      icon: "🌿",
      title: t('tools.alhamd_title'),
      subtitle: t('tools.alhamd_desc'),
    },
    {
      id: "hadith",
      icon: "📖",
      title: t('tools.hadith_title'),
      subtitle: t('tools.hadith_desc'),
    },
    {
      id: "asma",
      icon: "الله",
      title: t('tools.asma_title'),
      subtitle: t('tools.asma_desc'),
    },
  ];

  // ✅ Événements : tous les textes traduits via i18n
  const events = [
    {
      id: 1,
      icon: "📅",
      title: t('event_dua_title'),
      date: t('event_dua_date'),
      location: t('event_dua_location'),
    },
    {
      id: 2,
      icon: "🌙",
      title: t('event_ramadan_title'),
      date: t('event_ramadan_date'),
      location: t('event_ramadan_location'),
    },
    {
      id: 3,
      icon: "🕌",
      title: t('event_conf_title'),
      date: t('event_conf_date'),
      location: t('event_conf_location'),
    },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: C.textDark }}>

      {/* ── HERO ── */}
      <div style={{
        ...cardStyle(),
        marginBottom: "18px",
        display: "grid",
        gridTemplateColumns: "1fr 210px 190px",
        overflow: "hidden"
      }}>
        {/* Texte héros */}
        <div style={{
          background: "linear-gradient(140deg,#173322 0%,#2A5040 50%,#173322 100%)",
          padding: "30px 26px",
          minHeight: "185px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end"
        }}>
          <p style={{ margin: "0 0 5px", fontSize: "13px", color: "rgba(232,204,100,0.9)" }}>
            {t('welcome')}
          </p>
          <h1 style={{ margin: "0 0 9px", fontSize: "28px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
            {t('hero_title')}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, maxWidth: "300px" }}>
            {t('hero_desc')}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ padding: "8px 16px", background: C.green, border: "none", borderRadius: "7px", color: "white", fontWeight: 600, fontSize: "12.5px", cursor: "pointer" }}>
              {t('btn_start')}
            </button>
            <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "7px", color: "white", fontSize: "12.5px", cursor: "pointer" }}>
              {t('btn_explore')}
            </button>
          </div>
        </div>

        {/* Prochaine prière */}
        <div style={{ padding: "22px 18px", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 10px", fontSize: "10.5px", color: C.textMid, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {t('next_prayer')}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: C.textDark }}>
              {t('salat.asr')}
            </p>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(45,106,79,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              🌤️
            </div>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: "28px", fontWeight: 800, color: C.textDark, fontFamily: "'Courier New',monospace", letterSpacing: "0.02em", lineHeight: 1 }}>
            {countdown}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: "10.5px", color: C.textLight }}>
            {t('remaining')}
          </p>
          <div style={{ background: C.cardBg2, borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: 700, color: C.textDark }}>16:30</p>
            <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>{t('today')}</p>
          </div>
        </div>

        {/* Qibla */}
        <div style={{ padding: "22px 18px", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 10px", fontSize: "10.5px", color: C.textMid, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {t('qibla_compass')}
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <QiblaCompass />
          </div>
          <p style={{ margin: "0 0 1px", fontSize: "11px", color: C.textMid }}>{t('direction')}</p>
          <p style={{ margin: "0 0 1px", fontSize: "22px", fontWeight: 700, color: C.textDark, lineHeight: 1 }}>245°</p>
          <p style={{ margin: "0 0 6px", fontSize: "11px", color: C.textMid }}>{t('qibla.south_west')}</p>
          <p style={{ margin: 0, fontSize: "11px", color: C.green }}>{t('my_position')}</p>
        </div>
      </div>

      {/* ── STATISTIQUES ── entièrement traduites */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "18px" }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...cardStyle({ padding: "15px 16px" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: 38, height: 38, borderRadius: "9px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>
                {s.icon}
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", color: C.textMid }}>{s.label}</p>
            </div>
            <p style={{ margin: "0 0 3px", fontSize: "23px", fontWeight: 700, color: C.textDark }}>{s.value}</p>
            {s.progress !== undefined && (
              <div style={{ height: "3px", background: C.border, borderRadius: "2px", margin: "4px 0" }}>
                <div style={{ width: `${s.progress}%`, height: "100%", background: i === 1 ? C.gold : C.green, borderRadius: "2px" }} />
              </div>
            )}
            <p style={{ margin: 0, fontSize: "11px", color: C.textMid }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── OUTILS SPIRITUELS + HORAIRES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>

        {/* Outils spirituels — titres/descs traduits */}
        <div style={cardStyle({ padding: "18px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 600, color: C.textDark }}>
              {t('spiritual_tools')}
            </h2>
            <button style={{ background: "none", border: "none", color: C.green, fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>
              {t('see_all')} ›
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {spiritualTools.map((tool) => (
              <div key={tool.id} style={{ background: C.cardBg2, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px 13px 10px", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: "9px", background: "rgba(45,106,79,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", marginBottom: "9px" }}>
                  {tool.icon}
                </div>
                <p style={{ margin: "0 0 2px", fontSize: "12.5px", fontWeight: 600, color: C.textDark }}>
                  {tool.title}
                </p>
                <p style={{ margin: "0 0 7px", fontSize: "11px", color: C.textMid, lineHeight: 1.4, whiteSpace: "pre-line" }}>
                  {tool.subtitle}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: C.green, fontWeight: 500 }}>
                  {t('open')} ↗
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Horaires des prières */}
        <div style={cardStyle({ padding: "18px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 600, color: C.textDark }}>
              {t('prayer_times')}
            </h2>
            <button style={{ background: "none", border: "none", color: C.textMid, fontSize: "11.5px", cursor: "pointer" }}>
              {t('today')} ▾
            </button>
          </div>
          {/* ✅ Localisation traduite */}
          <p style={{ margin: "0 0 12px", fontSize: "11px", color: C.textMid }}>{t('berrechid')}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "12px" }}>
            {PRAYER_TIMES.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 11px", borderRadius: "8px", background: p.isCurrent ? C.green : "transparent" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: p.isCurrent ? "white" : p.completed ? C.greenLight : C.border, border: p.isCurrent ? "none" : `1.5px solid ${p.completed ? C.greenLight : C.textLight}` }} />
                {/* ✅ Nom de la prière traduit */}
                <p style={{ margin: 0, flex: 1, fontSize: "12.5px", fontWeight: p.isCurrent ? 600 : 400, color: p.isCurrent ? "white" : C.textDark }}>
                  {t(`salat.${p.name.toLowerCase()}`, p.name)}
                </p>
                <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 600, color: p.isCurrent ? "white" : C.textMid }}>
                  {p.time}
                </p>
                {p.isCurrent
                  ? <span>🔔</span>
                  : <div style={{ width: 22, height: 13, borderRadius: "6.5px", background: p.completed ? C.green : C.border, position: "relative" }}>
                      <div style={{ position: "absolute", top: "1.5px", left: p.completed ? "auto" : "1.5px", right: p.completed ? "1.5px" : "auto", width: "10px", height: "10px", borderRadius: "50%", background: "white" }} />
                    </div>
                }
              </div>
            ))}
          </div>
          <div style={{ background: C.cardBg2, borderRadius: "9px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: "0 0 1px", fontSize: "10.5px", color: C.textMid }}>{t('next_prayer')}</p>
              <p style={{ margin: "0 0 3px", fontSize: "17px", fontWeight: 700, color: C.textDark }}>{t('salat.maghrib')}</p>
              <p style={{ margin: "0 0 1px", fontSize: "19px", fontWeight: 800, color: C.textDark, fontFamily: "'Courier New',monospace" }}>{countdown}</p>
              <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>{t('remaining')}</p>
            </div>
            <span style={{ fontSize: "28px", opacity: 0.5 }}>🕌</span>
          </div>
        </div>
      </div>

      {/* ── ÉVÉNEMENTS / HADITH / MÉTÉO / ASMA ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr 1fr", gap: "12px" }}>

        {/* Événements — entièrement traduits */}
        <div style={cardStyle({ padding: "16px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "11px" }}>
            <h3 style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>
              {t('upcoming_events')}
            </h3>
            <button style={{ background: "none", border: "none", color: C.green, fontSize: "10.5px", cursor: "pointer" }}>
              {t('see_all')}
            </button>
          </div>
          {events.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px", background: C.cardBg2, borderRadius: "8px", marginBottom: "7px" }}>
              <div style={{ width: 30, height: 30, background: "rgba(45,106,79,0.10)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {e.icon}
              </div>
              <div>
                <p style={{ margin: "0 0 1px", fontSize: "11.5px", fontWeight: 600, color: C.textDark }}>{e.title}</p>
                <p style={{ margin: 0, fontSize: "10px", color: C.textMid }}>{e.date}</p>
                <p style={{ margin: 0, fontSize: "10px", color: C.textLight }}>{e.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hadith du jour */}
        <div style={cardStyle({ padding: "16px", display: "flex", flexDirection: "column" })}>
          <h3 style={{ margin: "0 0 11px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>
            {t('hadith_of_day')}
          </h3>
          <div style={{ background: C.cardBg2, borderRadius: "9px", padding: "13px", flex: 1 }}>
            <p style={{ margin: "0 0 8px", fontSize: "15px", textAlign: "right", fontFamily: "'Amiri','Noto Naskh Arabic',serif", color: C.textDark }}>
              {HADITH_OF_DAY.arabic}
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "11.5px", fontStyle: "italic", color: C.textDark }}>
              « {HADITH_OF_DAY.french} »
            </p>
            <p style={{ margin: "auto 0 8px", fontSize: "10.5px", color: C.textMid }}>
              📖 {HADITH_OF_DAY.source}
            </p>
          </div>
        </div>

        {/* Météo */}
        <div style={cardStyle({ padding: "16px" })}>
          <h3 style={{ margin: "0 0 1px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>
            {t('weather')}
          </h3>
          {/* ✅ Localisation traduite */}
          <p style={{ margin: "0 0 12px", fontSize: "10.5px", color: C.textMid }}>{t('berrechid')}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "34px" }}>🌤️</span>
            <div>
              <p style={{ margin: 0, fontSize: "30px", fontWeight: 700, lineHeight: 1, color: C.textDark }}>
                24<span style={{ fontSize: "14px" }}>°C</span>
              </p>
              <p style={{ margin: "3px 0 0", fontSize: "10.5px", color: C.textMid }}>{t('partly_cloudy')}</p>
            </div>
          </div>
          {([
            [t('feels_like'), "26°C"],
            [t('humidity'), "48%"],
            [t('wind'), "12 km/h"],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "11px", color: C.textMid }}>{label}</span>
              <span style={{ fontSize: "11px", color: C.textDark, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* AsmaUlHusna */}
        <div style={cardStyle({ padding: "16px" })}>
          <h3 style={{ margin: "0 0 12px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>
            {t('asma_progress')}
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <svg viewBox="0 0 88 88" width="88" height="88">
              <circle cx="44" cy="44" r="37" fill="none" stroke={C.border} strokeWidth="7" />
              <circle cx="44" cy="44" r="37" fill="none" stroke={C.green} strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 37 * 0.72} ${2 * Math.PI * 37}`}
                strokeLinecap="round" transform="rotate(-90 44 44)" />
              <text x="44" y="40" textAnchor="middle" fill={C.textDark} fontSize="14" fontWeight="700">72%</text>
              <text x="44" y="52" textAnchor="middle" fill={C.textMid} fontSize="8">71 / 99</text>
            </svg>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: C.textMid, textAlign: "center" }}>
            {t('names_learned')}
          </p>
          <div style={{ background: C.cardBg2, borderRadius: "8px", padding: "10px 12px", textAlign: "center", marginBottom: "10px" }}>
            <p style={{ margin: "0 0 2px", fontSize: "19px", fontFamily: "'Amiri','Noto Naskh Arabic',serif", lineHeight: 1.5, color: C.textDark }}>
              الرَّحْمَن
            </p>
            <p style={{ margin: "0 0 1px", fontSize: "12px", fontWeight: 600, color: C.textDark }}>Ar-Rahman</p>
            <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>{t('the_most_merciful')}</p>
          </div>
          <button style={{ width: "100%", padding: "9px", background: C.green, border: "none", borderRadius: "8px", color: "white", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}>
            {t('see_full_list')}
          </button>
        </div>
      </div>
    </div>
  );
}