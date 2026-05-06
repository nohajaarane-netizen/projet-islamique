import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

// Données fixes (dates et horaires) – les noms des jours seront traduits via i18n
const weekPrayers = [
  { dayKey: 'saturday',   date: '24 Mai', fajr: '05:15', dhuhr: '12:45', asr: '16:30', maghrib: '19:35', isha: '20:55' },
  { dayKey: 'sunday',     date: '25 Mai', fajr: '05:14', dhuhr: '12:45', asr: '16:31', maghrib: '19:36', isha: '20:56' },
  { dayKey: 'monday',     date: '26 Mai', fajr: '05:13', dhuhr: '12:45', asr: '16:31', maghrib: '19:36', isha: '20:57' },
  { dayKey: 'tuesday',    date: '27 Mai', fajr: '05:13', dhuhr: '12:45', asr: '16:32', maghrib: '19:37', isha: '20:57' },
  { dayKey: 'wednesday',  date: '28 Mai', fajr: '05:12', dhuhr: '12:45', asr: '16:32', maghrib: '19:37', isha: '20:58' },
  { dayKey: 'thursday',   date: '29 Mai', fajr: '05:11', dhuhr: '12:45', asr: '16:33', maghrib: '19:38', isha: '20:59' },
  { dayKey: 'friday',     date: '30 Mai', fajr: '05:11', dhuhr: '12:45', asr: '16:33', maghrib: '19:38', isha: '20:59' },
];

export default function Horaires() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;

  const textColor = theme === 'dark' ? '#FFFFFF' : C.textDark;
  const subTextColor = theme === 'dark' ? '#F0F0F0' : C.textMid;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: textColor }}>{t('horaires.title')}</h2>
        <p style={{ marginBottom: 20, color: subTextColor }}>{t('horaires.subtitle')}</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: textColor }}>
            <thead>
              <tr style={{ background: C.cardBg2, borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: 12, textAlign: 'left' }}>{t('horaires.day')}</th>
                <th style={{ padding: 12, textAlign: 'center' }}>{t('horaires.fajr')}</th>
                <th style={{ padding: 12, textAlign: 'center' }}>{t('horaires.dhuhr')}</th>
                <th style={{ padding: 12, textAlign: 'center' }}>{t('horaires.asr')}</th>
                <th style={{ padding: 12, textAlign: 'center' }}>{t('horaires.maghrib')}</th>
                <th style={{ padding: 12, textAlign: 'center' }}>{t('horaires.isha')}</th>
              </tr>
            </thead>
            <tbody>
              {weekPrayers.map(p => (
                <tr key={p.dayKey} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 12, fontWeight: 600, color: textColor }}>
                    {t(`days.${p.dayKey}`)} {p.date}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center', color: textColor }}>{p.fajr}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: textColor }}>{p.dhuhr}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: textColor }}>{p.asr}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: textColor }}>{p.maghrib}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: textColor }}>{p.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}