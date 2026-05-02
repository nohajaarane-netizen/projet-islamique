import { useState, useEffect } from 'react';
import { C } from '../theme/colors';

export default function Favoris() {
  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [newFav, setNewFav] = useState('');

  const addFavorite = () => {
    if (!newFav.trim()) return;
    const newItem = { id: Date.now(), text: newFav, date: new Date().toLocaleDateString() };
    setFavorites([newItem, ...favorites]);
    setNewFav('');
  };

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>Mes favoris</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Gardez vos invocations, hadiths ou noms préférés.</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input type="text" value={newFav} onChange={e => setNewFav(e.target.value)} placeholder="Nouveau favori..." style={{ flex: 1, padding: 12, borderRadius: 40, border: `1px solid ${C.border}` }} />
          <button onClick={addFavorite} style={{ background: C.green, border: 'none', borderRadius: 40, padding: '0 20px', color: 'white', cursor: 'pointer' }}>Ajouter</button>
        </div>

        {favorites.map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: `1px solid ${C.border}` }}>
            <span>{f.text}</span>
            <button onClick={() => removeFavorite(f.id)} style={{ background: 'none', border: 'none', color: 'red', fontSize: 18, cursor: 'pointer' }}>🗑️</button>
          </div>
        ))}
        {favorites.length === 0 && <p style={{ textAlign: 'center', color: C.textLight }}>Aucun favori. Ajoutez-en un !</p>}
      </div>
    </div>
  );
}