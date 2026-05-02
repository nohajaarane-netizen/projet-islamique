import { useState, useEffect } from 'react';
import { C } from '../theme/colors';

// Premiers noms (vous pouvez étendre à 99)
const allNames = [
  { id: 1, name: 'اللَّه', translit: 'Allah', meaning: 'Le Nom d\'Allah' },
  { id: 2, name: 'الرَّحْمَن', translit: 'Ar-Rahman', meaning: 'Le Tout Miséricordieux' },
  { id: 3, name: 'الرَّحِيم', translit: 'Ar-Rahim', meaning: 'Le Très Miséricordieux' },
  { id: 4, name: 'الْمَلِك', translit: 'Al-Malik', meaning: 'Le Souverain' },
  { id: 5, name: 'الْقُدُّوس', translit: 'Al-Quddus', meaning: 'Le Pur, Le Saint' },
  { id: 6, name: 'السَّلَام', translit: 'As-Salam', meaning: 'La Paix' },
  { id: 7, name: 'الْمُؤْمِن', translit: 'Al-Mu’min', meaning: 'Le Garant de la foi' },
  { id: 8, name: 'الْمُهَيْمِن', translit: 'Al-Muhaymin', meaning: 'Le Protecteur' },
  { id: 9, name: 'الْعَزِيز', translit: 'Al-Aziz', meaning: 'Le Puissant' },
  { id: 10, name: 'الْجَبَّار', translit: 'Al-Jabbar', meaning: 'Le Contraignant' },
];

export default function AsmaUlHusna() {
  const [learned, setLearned] = useState<number[]>(() => {
    const saved = localStorage.getItem('asmaLearned');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState('');

  const toggleLearned = (id: number) => {
    setLearned(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    localStorage.setItem('asmaLearned', JSON.stringify(learned));
  }, [learned]);

  const filtered = allNames.filter(n => n.translit.toLowerCase().includes(search.toLowerCase()) || n.meaning.toLowerCase().includes(search.toLowerCase()) || n.name.includes(search));

  const progress = Math.floor((learned.length / allNames.length) * 100);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>AsmaUlHusna</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Les 99 Noms d’Allah – apprenez et méditez.</p>

        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{learned.length} / {allNames.length}</div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, width: '100%', marginTop: 8 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: C.green, borderRadius: 4 }} />
          </div>
        </div>

        <input type="text" placeholder="Rechercher un nom..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 40, marginBottom: 24, border: `1px solid ${C.border}` }} />

        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(n => (
            <div key={n.id} onClick={() => toggleLearned(n.id)} style={{ display: 'flex', alignItems: 'center', background: learned.includes(n.id) ? C.cardBg2 : 'white', border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontFamily: "'Amiri', serif" }}>{n.name}</div>
                <div style={{ fontWeight: 600 }}>{n.translit}</div>
                <div style={{ fontSize: 12, color: C.textMid }}>{n.meaning}</div>
              </div>
              <div>{learned.includes(n.id) ? '✓' : '○'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
