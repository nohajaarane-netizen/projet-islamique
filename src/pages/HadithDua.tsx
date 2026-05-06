import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/colors';

const hadiths = [
  { id: 1, arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", french: "Les actions ne valent que par les intentions", source: "Sahih al-Bukhari (1)" },
  { id: 2, arabic: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ", french: "Celui qui guide vers un bien aura la récompense de celui qui l'accomplit", source: "Sahih Muslim (1893)" },
  { id: 3, arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي", french: "O Allah, pardonne-moi, accorde-moi Ta miséricorde et guide-moi", source: "Invocations" }
];

const duas = [
  { id: 101, arabic: "رَبِّ زِدْنِي عِلْمًا", french: "Mon Seigneur, augmente-moi en science", source: "Coran 20:114" },
  { id: 102, arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ", french: "Allah me suffit, il n'y a de divinité que Lui", source: "Coran 9:129" }
];

export default function HadithDua() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'hadiths' | 'duas' | 'asma'>('hadiths');

  const filteredHadiths = hadiths.filter(h => h.french.toLowerCase().includes(search.toLowerCase()) || h.arabic.includes(search));
  const filteredDuas = duas.filter(d => d.french.toLowerCase().includes(search.toLowerCase()) || d.arabic.includes(search));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ background: C.cardBg, borderRadius: 24, padding: 24, border: `1px solid ${C.border}` }}>
        <h2 style={{ marginBottom: 8, color: C.textDark }}>{t('hadith.title')}</h2>
        <p style={{ marginBottom: 20, color: C.textMid }}>{t('hadith.subtitle')}</p>

        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder={t('hadith.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 40, border: `1px solid ${C.border}`, background: C.cardBg2, color: C.textDark }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {['hadiths', 'duas', 'asma'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                background: activeTab === tab ? C.green : 'transparent',
                color: activeTab === tab ? 'white' : C.textMid,
                border: `1px solid ${activeTab === tab ? C.green : C.border}`,
                borderRadius: 30,
                padding: '6px 18px',
                cursor: 'pointer'
              }}
            >
              {tab === 'hadiths' && t('hadith.tabs_hadith')}
              {tab === 'duas' && t('hadith.tabs_dua')}
              {tab === 'asma' && t('hadith.tabs_asma')}
            </button>
          ))}
        </div>

        {activeTab === 'hadiths' && filteredHadiths.map(h => (
          <div key={h.id} style={{ marginBottom: 16, background: C.cardBg2, padding: 16, borderRadius: 16 }}>
            <p style={{ fontSize: 18, textAlign: 'right', fontFamily: "'Amiri', serif", color: C.textDark }}>{h.arabic}</p>
            <p style={{ fontStyle: 'italic', margin: '12px 0', color: C.textDark }}>{h.french}</p>
            <p style={{ fontSize: 12, color: C.textMid }}>{h.source}</p>
          </div>
        ))}

        {activeTab === 'duas' && filteredDuas.map(d => (
          <div key={d.id} style={{ marginBottom: 16, background: C.cardBg2, padding: 16, borderRadius: 16 }}>
            <p style={{ fontSize: 18, textAlign: 'right', fontFamily: "'Amiri', serif", color: C.textDark }}>{d.arabic}</p>
            <p style={{ fontStyle: 'italic', margin: '12px 0', color: C.textDark }}>{d.french}</p>
            <p style={{ fontSize: 12, color: C.textMid }}>{d.source}</p>
          </div>
        ))}

        {activeTab === 'asma' && (
          <div style={{ textAlign: 'center', padding: 20, color: C.textMid }}>
            <p>{t('hadith.asma_placeholder')}</p>
          </div>
        )}
      </div>
    </div>
  );
}