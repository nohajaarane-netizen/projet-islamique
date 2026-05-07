import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import { lightTheme, darkTheme } from '../theme/colors';

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const Horaires: React.FC = () => {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  
  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [gregorianDate, setGregorianDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const cardStyle = (extra?: React.CSSProperties) => ({
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    boxShadow: theme === 'light'
      ? "0 4px 20px rgba(0,0,0,0.05)"
      : "0 4px 20px rgba(0,0,0,0.3)",
    ...extra,
  });

  useEffect(() => {
    let ignore = false;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          "https://api.aladhan.com/v1/timingsByCity?city=Berrechid&country=MA&method=4"
        );
        
        if (!ignore) {
          setPrayerTimings(response.data.data.timings);
          setHijriDate(response.data.data.date.hijri.date);
          setGregorianDate(response.data.data.date.gregorian.date);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Erreur:", err);
          setError("Impossible de récupérer les horaires");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPrayerTimes();

    return () => {
      ignore = true;
    };
  }, []);

  const prayersList = [
    { key: "Fajr", name: "Fajr", label: "Aube", icon: "🌅", time: prayerTimings?.Fajr },
    { key: "Dhuhr", name: "Dhuhr", label: "Midi", icon: "☀️", time: prayerTimings?.Dhuhr },
    { key: "Asr", name: "Asr", label: "Après-midi", icon: "🌤️", time: prayerTimings?.Asr },
    { key: "Maghrib", name: "Maghrib", label: "Coucher", icon: "🌙", time: prayerTimings?.Maghrib },
    { key: "Isha", name: "Isha", label: "Nuit", icon: "⭐", time: prayerTimings?.Isha }
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            display: "inline-block", 
            width: "50px", 
            height: "50px", 
            border: `3px solid ${C.border}`, 
            borderTop: `3px solid ${C.green}`, 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite" 
          }} />
          <p style={{ marginTop: "15px", color: C.textMid }}>Chargement des horaires...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ ...cardStyle({ padding: "30px", textAlign: "center", maxWidth: "400px" }) }}>
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <p style={{ color: "#e74c3c", marginTop: "10px" }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: "15px", 
              padding: "8px 20px", 
              background: C.green, 
              border: "none", 
              borderRadius: "10px", 
              color: "white", 
              cursor: "pointer" 
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* En-tête avec fond dégradé */}
      <div style={{ 
        background: "linear-gradient(135deg, #173322 0%, #2A5040 100%)", 
        borderRadius: "20px", 
        padding: "30px 20px", 
        textAlign: "center",
        marginBottom: "20px",
        color: "white"
      }}>
        <h1 style={{ margin: "0 0 5px", fontSize: "24px", fontWeight: 600 }}>🕌 Horaires des Prières</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>Berrechid, Maroc</p>
      </div>

      {/* Date Hijri */}
      <div style={{ ...cardStyle({ padding: "15px 20px", marginBottom: "20px", textAlign: "center" }) }}>
        <p style={{ margin: 0, fontSize: "13px", color: C.textMid }}>Date Hijri</p>
        <p style={{ margin: "5px 0 0", fontSize: "18px", fontWeight: 600, color: C.textDark }}>{hijriDate}</p>
        <p style={{ margin: "3px 0 0", fontSize: "12px", color: C.textMid }}>{gregorianDate}</p>
      </div>

      {/* Liste des prières */}
      <div style={cardStyle({ padding: "20px" })}>
        {prayersList.map((prayer) => (
          <div 
            key={prayer.key} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "15px 0",
              borderBottom: `1px solid ${C.border}`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>{prayer.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: C.textDark }}>{prayer.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: C.textMid }}>{prayer.label}</p>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: C.green }}>
                {prayer.time || "--:--"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div style={{ ...cardStyle({ padding: "15px 20px", marginTop: "20px" }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: "11px", color: C.textMid }}>📖 Méthode de calcul</p>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: C.textDark }}>Ligue Islamique Mondiale</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 3px", fontSize: "11px", color: C.textMid }}>📍 Localisation</p>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: C.textDark }}>Berrechid, Maroc</p>
          </div>
        </div>
      </div>

      {/* Bouton pour actualiser */}
      <button 
        onClick={() => window.location.reload()}
        style={{ 
          width: "100%", 
          marginTop: "20px", 
          padding: "12px", 
          background: "transparent", 
          border: `1px solid ${C.border}`, 
          borderRadius: "12px", 
          color: C.textMid, 
          cursor: "pointer",
          fontSize: "13px"
        }}
      >
        🔄 Actualiser
      </button>
    </div>
  );
};

export default Horaires;