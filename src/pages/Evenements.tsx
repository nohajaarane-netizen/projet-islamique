import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { EVENTS as defaultEvents } from '../data/events';

export default function Evenements() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [events, setEvents] = useState(defaultEvents);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '' });

  useEffect(() => {
    const saved = localStorage.getItem('userEvents');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const ev = { ...newEvent, id: Date.now().toString(), icon: '📌' };
    const updated = [ev, ...events];
    setEvents(updated);
    localStorage.setItem('userEvents', JSON.stringify(updated));
    setShowForm(false);
    setNewEvent({ title: '', date: '', time: '', location: '' });
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto'  ,color: '#757575' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: C.textDark }}>Événements</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ background: C.green, border: 'none', borderRadius: 30, padding: '6px 16px', color: 'white', cursor: 'pointer' }}>+ Ajouter</button>
        </div>

        {showForm && (
          <div style={{ background: C.cardBg2, padding: 16, borderRadius: 16, marginBottom: 24 }}>
            <input type="text" placeholder="Titre" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8 }} />
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input type="text" placeholder="Lieu" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8 }} />
            <button onClick={addEvent} style={{ background: C.green, border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white' }}>Enregistrer</button>
          </div>
        )}

        {events.map(e => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: C.cardBg2, borderRadius: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 24 }}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{e.title}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{e.date} • {e.time}</div>
              <div style={{ fontSize: 12 }}>{e.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}