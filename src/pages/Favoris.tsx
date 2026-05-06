import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

export default function Favoris() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;

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
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('favoris.title')}</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{t('favoris.subtitle')}</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            value={newFav}
            onChange={e => setNewFav(e.target.value)}
            placeholder={t('favoris.add_placeholder')}
            style={{ flex: 1, padding: 12, borderRadius: 40, border: `1px solid ${C.border}`, background: C.cardBg2, color: C.textDark }}
          />
          <button onClick={addFavorite} style={{ background: C.green, border: 'none', borderRadius: 40, padding: '0 20px', color: 'white', cursor: 'pointer' }}>
            {t('favoris.add_button')}
          </button>
        </div>

        {favorites.map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.textDark }}>{f.text}</span>
            <button onClick={() => removeFavorite(f.id)} style={{ background: 'none', border: 'none', color: 'red', fontSize: 18, cursor: 'pointer' }}>🗑️</button>
          </div>
        ))}
        {favorites.length === 0 && <p style={{ textAlign: 'center', color: C.textLight }}>{t('favoris.empty')}</p>}
      </div>
    </div>
  );
}