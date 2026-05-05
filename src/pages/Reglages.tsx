import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
export default function Reglages() {
   const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [name, setName] = useState(() => localStorage.getItem('userName') || 'Mohamed');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') === 'true');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('userName', name);
    localStorage.setItem('notifications', String(notifications));
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) document.body.style.background = '#1a1a1a';
    else document.body.style.background = C.pageBg;
  }, [name, notifications, darkMode]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' ,color: '#bcbcbc' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 20, color: C.textDark }}>Réglages</h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Nom complet</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }} />
        </div>

        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Notifications de prière</span>
          <label className="switch">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Mode sombre (expérimental)</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
          </label>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: '#e74c3c', border: 'none', borderRadius: 8, padding: '10px', color: 'white', cursor: 'pointer', width: '100%' }}>
          Réinitialiser toutes les données
        </button>
      </div>

      <style>{`
        .switch { position: relative; display: inline-block; width: 50px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: ${C.green}; }
        input:checked + .slider:before { transform: translateX(26px); }
      `}</style>
    </div>
  );
}