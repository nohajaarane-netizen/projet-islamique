import React, { useState, useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import QiblaCompass from '../components/layout/QiblaCompass';
import { useTheme } from '../hooks/useTheme';
import { lightTheme, darkTheme } from '../theme/colors';
import { STAT_CARDS } from '../data/statCards';
import { SPIRITUAL_TOOLS } from '../data/spiritualTools';
import { EVENTS } from '../data/events';
import { HADITH_OF_DAY } from '../data/hadiths';
import axios from 'axios';

export default function Accueil() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const countdown = useCountdown(2 * 3600 + 52 * 60 + 34);

  // États pour les horaires de prière API
  const [prayerTimingsAPI, setPrayerTimingsAPI] = useState<any>(null);
  const [loadingPrayers, setLoadingPrayers] = useState<boolean>(true);
  const [errorPrayers, setErrorPrayers] = useState<string>('');

  // État pour la météo API
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);

  // Récupérer les horaires de prière depuis l'API
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoadingPrayers(true);
        const response = await axios.get(
          "https://api.aladhan.com/v1/timingsByCity?city=Berrechid&country=MA&method=4"
        );
        setPrayerTimingsAPI(response.data.data.timings);
        setErrorPrayers('');
      } catch (err) {
        console.error("Erreur chargement horaires:", err);
        setErrorPrayers("Impossible de charger les horaires");
      } finally {
        setLoadingPrayers(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Récupérer la météo (à remplacer par API OpenWeatherMap plus tard)
  useEffect(() => {
    // Simulation de chargement - à remplacer par l'appel API réel
    setTimeout(() => {
      setWeatherData({
        temp: 24,
        condition: "Partiellement nuageux",
        feelsLike: 26,
        humidity: 48,
        wind: 12
      });
      setLoadingWeather(false);
    }, 500);
  }, []);

  const cardStyle = (extra?: React.CSSProperties) => ({
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: "14px",
    boxShadow: theme === 'light'
      ? "0 1px 8px rgba(0,0,0,0.05)"
      : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
    ...extra,
  });

  // Liste des prières
  const prayersList = [
    { name: "Fajr", label: "Fajr (Aube)" },
    { name: "Dhuhr", label: "Dhuhr (Midi)" },
    { name: "Asr", label: "Asr (Après-midi)" },
    { name: "Maghrib", label: "Maghrib (Coucher)" },
    { name: "Isha", label: "Isha (Nuit)" }
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: C.textDark }}>
      {/* Hero avec fond dégradé */}
      <div style={{ ...cardStyle(), marginBottom: "18px", display: "grid", gridTemplateColumns: "1fr 210px 190px", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(140deg,#173322 0%,#2A5040 50%,#173322 100%)", padding: "30px 26px", position: "relative", minHeight: "185px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <p style={{ margin: "0 0 5px", fontSize: "13px", color: "rgba(232,204,100,0.9)" }}>Assalamu alaykum 👋</p>
          <h1 style={{ margin: "0 0 9px", fontSize: "28px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>Ta lumière<br />spirituelle quotidienne</h1>
          <p style={{ margin: "0 0 20px", fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, maxWidth: "300px" }}>Avance chaque jour vers Allah avec des outils pensés pour ton cœur et ton esprit.</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ padding: "8px 16px", background: C.green, border: "none", borderRadius: "7px", color: "white", fontWeight: 600, fontSize: "12.5px", cursor: "pointer" }}>▶ Commencer</button>
            <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "7px", color: "white", fontSize: "12.5px", cursor: "pointer" }}>✦ Explorer</button>
          </div>
        </div>
        <div style={{ padding: "22px 18px", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 10px", fontSize: "10.5px", color: C.textMid, textTransform: "uppercase", letterSpacing: "0.07em" }}>Prochaine prière</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: C.textDark }}>Asr</p>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(45,106,79,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌤️</div>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: "28px", fontWeight: 800, color: C.textDark, fontFamily: "'Courier New',monospace", letterSpacing: "0.02em", lineHeight: 1 }}>{countdown}</p>
          <p style={{ margin: "0 0 14px", fontSize: "10.5px", color: C.textLight }}>Restant</p>
          <div style={{ background: C.cardBg2, borderRadius: "8px", padding: "10px 12px", marginBottom: "auto" }}>
            <p style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: 700, color: C.textDark }}>16:30</p>
            <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>Aujourd'hui</p>
          </div>
        </div>
        <div style={{ padding: "22px 18px", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 10px", fontSize: "10.5px", color: C.textMid, textTransform: "uppercase", letterSpacing: "0.07em" }}>Boussole Qibla</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><QiblaCompass /></div>
          <p style={{ margin: "0 0 1px", fontSize: "11px", color: C.textMid }}>Direction</p>
          <p style={{ margin: "0 0 1px", fontSize: "22px", fontWeight: 700, color: C.textDark, lineHeight: 1 }}>245°</p>
          <p style={{ margin: "0 0 6px", fontSize: "11px", color: C.textMid }}>Sud-Ouest</p>
          <p style={{ margin: 0, fontSize: "11px", color: C.green }}>📍 Ma position</p>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "18px" }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ ...cardStyle({ padding: "15px 16px" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: 38, height: 38, borderRadius: "9px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>{s.icon}</div>
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

      {/* Outils spirituels + Horaires */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
        <div style={cardStyle({ padding: "18px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 600, color: C.textDark }}>Outils spirituels</h2>
            <button style={{ background: "none", border: "none", color: C.green, fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Voir tout ›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {SPIRITUAL_TOOLS.map((tool) => (
              <div key={tool.id} style={{ background: C.cardBg2, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px 13px 10px", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: "9px", background: "rgba(45,106,79,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", marginBottom: "9px" }}>{tool.icon}</div>
                <p style={{ margin: "0 0 2px", fontSize: "12.5px", fontWeight: 600, color: C.textDark }}>{tool.title}</p>
                <p style={{ margin: "0 0 7px", fontSize: "11px", color: C.textMid, lineHeight: 1.4, whiteSpace: "pre-line" }}>{tool.subtitle}</p>
                <p style={{ margin: 0, fontSize: "11px", color: C.green, fontWeight: 500 }}>Ouvrir ↗</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Horaires des prières - Version Dynamique */}
        <div style={cardStyle({ padding: "18px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <h2 style={{ margin: 0, fontSize: "14.5px", fontWeight: 600, color: C.textDark }}>Horaires des prières</h2>
            <button style={{ background: "none", border: "none", color: C.textMid, fontSize: "11.5px", cursor: "pointer" }}>Aujourd'hui ▾</button>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: "11px", color: C.textMid }}>📍 Berrechid, Maroc</p>
          
          {/* Affichage conditionnel */}
          {loadingPrayers ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ 
                display: "inline-block", 
                width: "30px", 
                height: "30px", 
                border: `2px solid ${C.border}`, 
                borderTop: `2px solid ${C.green}`, 
                borderRadius: "50%", 
                animation: "spin 1s linear infinite" 
              }} />
              <p style={{ marginTop: "10px", fontSize: "11px", color: C.textMid }}>Chargement des horaires...</p>
            </div>
          ) : errorPrayers ? (
            <div style={{ textAlign: "center", padding: "30px 20px", background: "rgba(231, 76, 60, 0.1)", borderRadius: "8px" }}>
              <p style={{ margin: "0 0 15px", fontSize: "12px", color: "#e74c3c" }}>⚠️ {errorPrayers}</p>
              <button 
                onClick={() => window.location.reload()} 
                style={{ 
                  background: C.green, 
                  color: "white", 
                  border: "none", 
                  padding: "6px 12px", 
                  borderRadius: "5px", 
                  cursor: "pointer",
                  fontSize: "11px"
                }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "12px" }}>
                {prayersList.map((prayer) => {
                  const prayerTime = prayerTimingsAPI?.[prayer.name];
                  const isCurrent = prayer.name === "Asr"; // À personnaliser selon l'heure réelle
                  const completed = false; // À calculer selon l'heure
                  
                  return (
                    <div 
                      key={prayer.name} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "10px", 
                        padding: "8px 11px", 
                        borderRadius: "8px", 
                        background: isCurrent ? C.green : "transparent" 
                      }}
                    >
                      <div style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: "50%", 
                        flexShrink: 0, 
                        background: isCurrent ? "white" : completed ? C.greenLight : C.border, 
                        border: isCurrent ? "none" : `1.5px solid ${completed ? C.greenLight : C.textLight}` 
                      }} />
                      <p style={{ 
                        margin: 0, 
                        flex: 1, 
                        fontSize: "12.5px", 
                        fontWeight: isCurrent ? 600 : 400, 
                        color: isCurrent ? "white" : C.textDark 
                      }}>{prayer.label}</p>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "12.5px", 
                        fontWeight: 600, 
                        color: isCurrent ? "white" : C.textMid 
                      }}>{prayerTime || "--:--"}</p>
                      {isCurrent ? 
                        <span style={{ fontSize: "12px" }}>🔔</span> : 
                        <div style={{ 
                          width: 22, 
                          height: 13, 
                          borderRadius: "6.5px", 
                          background: completed ? C.green : C.border, 
                          position: "relative" 
                        }}>
                          <div style={{ 
                            position: "absolute", 
                            top: "1.5px", 
                            left: completed ? "auto" : "1.5px", 
                            right: completed ? "1.5px" : "auto", 
                            width: "10px", 
                            height: "10px", 
                            borderRadius: "50%", 
                            background: "white" 
                          }} />
                        </div>
                      }
                    </div>
                  );
                })}
              </div>
              
              <div style={{ background: C.cardBg2, borderRadius: "9px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: "10.5px", color: C.textMid }}>Prochaine prière</p>
                  <p style={{ margin: "0 0 3px", fontSize: "17px", fontWeight: 700, color: C.textDark }}>Asr</p>
                  <p style={{ margin: "0 0 1px", fontSize: "19px", fontWeight: 800, color: C.textDark, fontFamily: "'Courier New',monospace" }}>{countdown}</p>
                  <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>Restant</p>
                </div>
                <span style={{ fontSize: "28px", opacity: 0.5 }}>🕌</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Événements, Hadith, Météo, Asma */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr 1fr", gap: "12px" }}>
        <div style={cardStyle({ padding: "16px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "11px" }}>
            <h3 style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>Événements à venir</h3>
            <button style={{ background: "none", border: "none", color: C.green, fontSize: "10.5px", cursor: "pointer" }}>Voir tout</button>
          </div>
          {EVENTS.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px", background: C.cardBg2, borderRadius: "8px", marginBottom: "7px" }}>
              <div style={{ width: 30, height: 30, background: "rgba(45,106,79,0.10)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>{e.icon}</div>
              <div>
                <p style={{ margin: "0 0 1px", fontSize: "11.5px", fontWeight: 600, color: C.textDark }}>{e.title}</p>
                <p style={{ margin: 0, fontSize: "10px", color: C.textMid }}>{e.date} • {e.time}</p>
                <p style={{ margin: 0, fontSize: "10px", color: C.textLight }}>{e.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle({ padding: "16px", display: "flex", flexDirection: "column" })}>
          <h3 style={{ margin: "0 0 11px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>Hadith du jour</h3>
          <div style={{ background: C.cardBg2, borderRadius: "9px", padding: "13px", flex: 1 }}>
            <p style={{ margin: "0 0 8px", fontSize: "15px", textAlign: "right", fontFamily: "'Amiri','Noto Naskh Arabic',serif", color: C.textDark }}>{HADITH_OF_DAY.arabic}</p>
            <p style={{ margin: "0 0 8px", fontSize: "11.5px", fontStyle: "italic", color: C.textDark }}>« {HADITH_OF_DAY.french} »</p>
            <p style={{ margin: "0", fontSize: "10.5px", color: C.textMid }}>📖 {HADITH_OF_DAY.source}</p>
          </div>
        </div>

        {/* Section Météo - Version Dynamique */}
        <div style={cardStyle({ padding: "16px" })}>
          <h3 style={{ margin: "0 0 1px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>Météo</h3>
          <p style={{ margin: "0 0 12px", fontSize: "10.5px", color: C.textMid }}>Berrechid, Maroc</p>
          
          {loadingWeather ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ 
                display: "inline-block", 
                width: "25px", 
                height: "25px", 
                border: `2px solid ${C.border}`, 
                borderTop: `2px solid ${C.green}`, 
                borderRadius: "50%", 
                animation: "spin 1s linear infinite" 
              }} />
            </div>
          ) : weatherData ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "34px" }}>
                  {weatherData.temp > 30 ? "☀️" : weatherData.temp > 20 ? "🌤️" : weatherData.temp > 15 ? "⛅" : "☁️"}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: "30px", fontWeight: 700, lineHeight: 1, color: C.textDark }}>
                    {weatherData.temp}<span style={{ fontSize: "14px" }}>°C</span>
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: "10.5px", color: C.textMid }}>{weatherData.condition}</p>
                </div>
              </div>
              {[
                ["Ressenti", `${weatherData.feelsLike}°C`],
                ["Humidité", `${weatherData.humidity}%`],
                ["Vent", `${weatherData.wind} km/h`]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "11px", color: C.textMid }}>{k}</span>
                  <span style={{ fontSize: "11px", color: C.textDark, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#e74c3c" }}>Erreur chargement météo</p>
            </div>
          )}
        </div>

        <div style={cardStyle({ padding: "16px" })}>
          <h3 style={{ margin: "0 0 12px", fontSize: "13.5px", fontWeight: 600, color: C.textDark }}>Progression AsmaUlHusna</h3>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <svg viewBox="0 0 88 88" width="88" height="88">
              <circle cx="44" cy="44" r="37" fill="none" stroke={C.border} strokeWidth="7" />
              <circle cx="44" cy="44" r="37" fill="none" stroke={C.green} strokeWidth="7" strokeDasharray={`${2*Math.PI*37*0.72} ${2*Math.PI*37}`} strokeLinecap="round" transform="rotate(-90 44 44)" />
              <text x="44" y="40" textAnchor="middle" fill={C.textDark} fontSize="14" fontWeight="700">72%</text>
              <text x="44" y="52" textAnchor="middle" fill={C.textMid} fontSize="8">71 / 99</text>
            </svg>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: "11px", color: C.textMid, textAlign: "center" }}>Noms appris</p>
          <div style={{ background: C.cardBg2, borderRadius: "8px", padding: "10px 12px", textAlign: "center", marginBottom: "10px" }}>
            <p style={{ margin: "0 0 2px", fontSize: "19px", fontFamily: "'Amiri','Noto Naskh Arabic',serif", lineHeight: 1.5, color: C.textDark }}>الرَّحْمَن</p>
            <p style={{ margin: "0 0 1px", fontSize: "12px", fontWeight: 600, color: C.textDark }}>Ar-Rahman</p>
            <p style={{ margin: 0, fontSize: "10.5px", color: C.textMid }}>Le Tout Miséricordieux</p>
          </div>
          <button style={{ width: "100%", padding: "9px", background: C.green, border: "none", borderRadius: "8px", color: "white", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}>
            Voir la liste complète
          </button>
        </div>
      </div>

      {/* Ajout de l'animation CSS inline */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}