import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
interface Gratitude {
  id: string;
  text: string;
  category: string;
  date: string;
}

const categories = ['Allāh', 'Foi', 'Famille', 'Santé', 'Travail', 'Autre'];

export default function Alhamdulillah() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [gratitudes, setGratitudes] = useState<Gratitude[]>(() => {
    const saved = localStorage.getItem('gratitudes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState(categories[0]);

  useEffect(() => {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    if (!newText.trim()) return;
    const newGrat = {
      id: Date.now().toString(),
      text: newText,
      category,
      date: new Date().toLocaleDateString('fr-FR'),
    };
    setGratitudes([newGrat, ...gratitudes]);
    setNewText('');
  };

  const streak = (() => {
    const dates = [...new Set(gratitudes.map(g => g.date))].sort();
    let streakDays = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      const curr = new Date(dates[i]);
      const prev = i > 0 ? new Date(dates[i-1]) : null;
      const diff = prev ? (curr.getTime() - prev.getTime()) / (1000*60*60*24) : 1;
      if (diff === 1) streakDays++;
      else if (diff > 1) break;
      else streakDays++;
    }
    return streakDays;
  })();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>Alhamdulillah</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Cultivez la gratitude au quotidien.</p>

        <div style={{ marginBottom: 24, background: C.cardBg2, borderRadius: 16, padding: 16 }}>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Aujourd'hui, je suis reconnaissant pour..."
            rows={3}
            style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}`, fontFamily: 'inherit', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${C.border}` }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={addGratitude} style={{ background: C.green, border: 'none', borderRadius: 8, padding: '8px 20px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
              Enregistrer
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ background: C.cardBg2, padding: 12, borderRadius: 12, flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{gratitudes.length}</div>
            <div style={{ fontSize: 12, color: C.textMid }}>Total bénédictions</div>
          </div>
          <div style={{ background: C.cardBg2, padding: 12, borderRadius: 12, flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>{streak}</div>
            <div style={{ fontSize: 12, color: C.textMid }}>Série actuelle (jours)</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {gratitudes.map(g => (
            <div key={g.id} style={{ background: C.cardBg2, padding: 12, borderRadius: 12, borderLeft: `4px solid ${C.green}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{g.text}</strong>
                <span style={{ fontSize: 11, color: C.textLight }}>{g.date}</span>
              </div>
              <div style={{ fontSize: 12, color: C.textMid }}>Catégorie : {g.category}</div>
            </div>
          ))}
          {gratitudes.length === 0 && <p style={{ textAlign: 'center', color: C.textLight }}>Aucune gratitude enregistrée. Commencez dès aujourd'hui !</p>}
        </div>
      </div>
    </div>
  );
}
