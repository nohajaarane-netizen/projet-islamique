import { NAV_ITEMS } from '../../data/navItems';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { lightTheme, darkTheme } from '../../theme/colors';
import { FaHeart } from 'react-icons/fa';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;

  // Traductions des labels selon la langue
  const getLabel = (label: string) => {
    const translations: Record<string, Record<string, string>> = {
      '🏠 Accueil': { fr: '🏠 Accueil', en: '🏠 Home', ar: '🏠 الرئيسية' },
      '🕌 Salat': { fr: '🕌 Salat', en: '🕌 Prayer', ar: '🕌 الصلاة' },
      '🤲 Alhamdulillah': { fr: '🤲 Alhamdulillah', en: '🤲 Alhamdulillah', ar: '🤲 الحمد لله' },
      '📖 Hadith & Dua': { fr: '📖 Hadith & Dua', en: '📖 Hadith & Dua', ar: '📖 الحديث والدعاء' },
      '✨ Asma ul-Husna': { fr: '✨ Asma ul-Husna', en: '✨ Asma ul-Husna', ar: '✨ الأسماء الحسنى' },
      '⏰ Horaires': { fr: '⏰ Horaires', en: '⏰ Timings', ar: '⏰ الأوقات' },
      '🧭 Qibla': { fr: '🧭 Qibla', en: '🧭 Qibla', ar: '🧭 القبلة' },
      '☀️ Météo': { fr: '☀️ Météo', en: '☀️ Weather', ar: '☀️ الطقس' },
      '📿 Tasbih': { fr: '📿 Tasbih', en: '📿 Tasbih', ar: '📿 التسبيح' },
      '⭐ Favoris': { fr: '⭐ Favoris', en: '⭐ Favorites', ar: '⭐ المفضلة' },
      '📅 Événements': { fr: '📅 Événements', en: '📅 Events', ar: '📅 المناسبات' },
      '⚙️ Réglages': { fr: '⚙️ Réglages', en: '⚙️ Settings', ar: '⚙️ الإعدادات' },
    };
    return translations[label]?.[language] || label;
  };

  return (
    <aside style={{
      width: 205,
      background: C.sidebar,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto"
    }}>
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(200,168,75,0.18)", border: "1.5px solid rgba(200,168,75,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: C.gold }}>
            <FaHeart />
          </div>
          <div>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#FFF", letterSpacing: "0.04em", lineHeight: 1 }}>NOUR</div>
            <div style={{ fontSize: "13px", color: C.gold, fontFamily: "serif", lineHeight: 1.2 }}>نور</div>
          </div>
        </div>
      </div>
      
      <nav style={{ padding: "8px 0", flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const active = activePage === id;
          return (
            <button 
              key={id} 
              onClick={() => onNavigate(id)} 
              style={{
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                padding: "9px 16px", 
                border: "none", 
                cursor: "pointer", 
                textAlign: "left",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                borderLeft: `3px solid ${active ? C.gold : "transparent"}`,
                color: active ? "#FFFFFF" : C.textSidebar,
                fontSize: "12.5px", 
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ width: "18px", textAlign: "center", flexShrink: 0, fontSize: "14px" }}>{icon}</span>
              {getLabel(label)}
            </button>
          );
        })}
      </nav>
      
      <div style={{ margin: "0 12px 10px", padding: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "9px", border: `1px solid ${C.sidebarBorder}` }}>
        <p style={{ margin: "0 0 5px", fontSize: "9.5px", color: C.gold, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {language === 'ar' ? 'تذكير اليوم' : language === 'en' ? "Today's Reminder" : 'Rappel du jour'}
        </p>
        <p style={{ margin: "0 0 5px", fontSize: "11.5px", color: "rgba(255,255,255,0.78)", fontStyle: "italic", lineHeight: 1.5 }}>
          {language === 'ar' 
            ? '« إن لله تسعة وتسعين اسما، من أحصاها دخل الجنة »' 
            : language === 'en'
            ? '« Allah has 99 names, whoever memorizes them will enter Paradise »'
            : '« Allah a 99 noms, celui qui les connaît entrera au Paradis. »'}
        </p>
        <p style={{ margin: 0, fontSize: "10px", color: C.textSidebar }}>Sahih Muslim (2677)</p>
      </div>
      
      <button style={{ margin: "0 12px 18px", padding: "8px", background: "rgba(255,255,255,0.07)", border: `1px solid ${C.sidebarBorder}`, borderRadius: "8px", color: C.textSidebar, fontSize: "11.5px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <FaHeart /> 
        {language === 'ar' ? 'تبرع' : language === 'en' ? 'Donate' : 'Faire un don'}
      </button>
    </aside>
  );
}