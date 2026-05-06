import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme, darkTheme } from '../../theme/colors';
import { NAV_ITEMS } from '../../data/navItems';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const C = theme === 'light' ? lightTheme : darkTheme;

  // Correspondance entre les paths et les clés de traduction
  const getTranslationKey = (path: string): string => {
    const mapping: Record<string, string> = {
      '/': 'nav_accueil',
      '/salat': 'nav_salat',
      '/asma': 'nav_asma',
      '/alhamdulillah': 'nav_alhamdulillah',
      '/horaires': 'nav_horaires',
      '/meteo': 'nav_meteo',
      '/qibla': 'nav_qibla',
      '/evenements': 'nav_evenements',
      '/hadith': 'nav_hadith',
      '/reglages': 'nav_reglages',
      '/favoris': 'nav_favoris'
    };
    return mapping[path] || 'nav_accueil';
  };

  return (
    <aside style={{
      backgroundColor: C.sidebar,
      color: C.textDark,
      width: '250px',
      minHeight: '100vh',
      padding: '1rem',
      borderRight: `1px solid ${C.border}`
    }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {NAV_ITEMS.map((item) => {
            const pageKey = String(item.path).replace('/', '') || 'accueil';
            const translationKey = getTranslationKey(String(item.path));
            return (
              <li key={String(item.path)} style={{ marginBottom: '0.5rem' }}>
                <div
                  onClick={() => onNavigate(pageKey)}
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    backgroundColor: activePage === pageKey ? C.cardBg2 : 'transparent',
                    color: C.textSidebar || C.textDark,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon} {t(translationKey)}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;