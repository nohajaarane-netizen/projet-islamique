import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

interface Prayer {
  name: string;
  time: string;
  completed: boolean;
}


const defaultPrayers: Prayer[] = [
  { name: 'Fajr', time: '05:15', completed: false },
  { name: 'Dhuhr', time: '12:45', completed: false },
  { name: 'Asr', time: '16:30', completed: false },
  { name: 'Maghrib', time: '19:35', completed: false },
  { name: 'Isha', time: '20:55', completed: false },
];

export default function SalatTracker() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const { t } = useTranslation();  
  const [prayers, setPrayers] = useState<Prayer[]>(() => {
    const saved = localStorage.getItem('salatTracker');
    return saved ? JSON.parse(saved) : defaultPrayers;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 0;
  });
  const [lastDate, setLastDate] = useState(() => localStorage.getItem('lastDate') || '');

  useEffect(() => {
    localStorage.setItem('salatTracker', JSON.stringify(prayers));
    const today = new Date().toDateString();
    if (lastDate !== today) {
      const completedToday = prayers.filter(p => p.completed).length;
      if (completedToday === 5) setStreak(prev => prev + 1);
      else if (completedToday < 5 && lastDate !== '') setStreak(0);
      setLastDate(today);
      localStorage.setItem('streak', streak.toString());
      localStorage.setItem('lastDate', today);
    } else {
      localStorage.setItem('streak', streak.toString());
    }
  }, [prayers, streak, lastDate]);

  const togglePrayer = (index: number) => {
    setPrayers(prev => prev.map((p, i) => i === index ? { ...p, completed: !p.completed } : p));
  };

  const completedCount = prayers.filter(p => p.completed).length;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' , color: '#6b6b6b' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>SalatTracker</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Suivez vos prières quotidiennes</p>

        <div style={{ marginBottom: 20, background: C.cardBg2, borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Progression aujourd'hui :</span>
            <strong>{completedCount} / 5</strong>
          </div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, marginTop: 8 }}>
            <div style={{ width: `${(completedCount / 5) * 100}%`, height: '100%', background: C.green, borderRadius: 4 }} />
          </div>
        </div>

        {prayers.map((prayer, idx) => (
          <div key={prayer.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: 12, background: C.cardBg2, borderRadius: 12 }}>
            <div>
              <strong style={{ fontSize: 16 }}>{prayer.name}</strong>
              <div style={{ fontSize: 12, color: C.textMid }}>{prayer.time}</div>
            </div>
            <button
              onClick={() => togglePrayer(idx)}
              style={{
                background: prayer.completed ? C.green : 'white',
                border: `1px solid ${prayer.completed ? C.green : C.border}`,
                borderRadius: 30,
                padding: '6px 14px',
                color: prayer.completed ? 'white' : C.textDark,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {prayer.completed ? '✓ Accomplie' : 'Marquer'}
            </button>
          </div>
        ))}

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>{streak}</div>
            <div style={{ fontSize: 12, color: C.textMid }}>Série actuelle (jours)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{completedCount}</div>
            <div style={{ fontSize: 12, color: C.textMid }}>Prières aujourd'hui</div>
          </div>
        </div>
      </div>
    </div>
  );
}