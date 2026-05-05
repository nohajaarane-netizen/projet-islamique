import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';
const weekPrayers = [
  { day: 'Samedi 24 Mai', fajr: '05:15', dhuhr: '12:45', asr: '16:30', maghrib: '19:35', isha: '20:55' },
  { day: 'Dimanche 25 Mai', fajr: '05:14', dhuhr: '12:45', asr: '16:31', maghrib: '19:36', isha: '20:56' },
  { day: 'Lundi 26 Mai', fajr: '05:13', dhuhr: '12:45', asr: '16:31', maghrib: '19:36', isha: '20:57' },
  { day: 'Mardi 27 Mai', fajr: '05:13', dhuhr: '12:45', asr: '16:32', maghrib: '19:37', isha: '20:57' },
  { day: 'Mercredi 28 Mai', fajr: '05:12', dhuhr: '12:45', asr: '16:32', maghrib: '19:37', isha: '20:58' },
  { day: 'Jeudi 29 Mai', fajr: '05:11', dhuhr: '12:45', asr: '16:33', maghrib: '19:38', isha: '20:59' },
  { day: 'Vendredi 30 Mai', fajr: '05:11', dhuhr: '12:45', asr: '16:33', maghrib: '19:38', isha: '20:59' },
];

export default function Horaires() {
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>Horaires des prières</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>Planifiez votre journée autour des prières (Berrechid, Maroc).</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' , color: '#5e5e5e' }}>
            <thead>
              <tr style={{ background: C.cardBg2, borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Jour</th><th>Fajr</th><th>Dhuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th>
              </tr>
            </thead>
            <tbody>
              {weekPrayers.map(p => (
                <tr key={p.day} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{p.day}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{p.fajr}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{p.dhuhr}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{p.asr}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{p.maghrib}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{p.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}