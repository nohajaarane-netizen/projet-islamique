import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { lightTheme, darkTheme } from '../../theme/colors';
import { NAV_ITEMS } from '../../data/navItems';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { theme } = useTheme() as { theme: 'light' | 'dark' };
  const C = theme === 'light' ? lightTheme : darkTheme;

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
         {NAV_ITEMS.map((item) => (
  <li key={String(item.path)} style={{ marginBottom: '0.5rem' }}>
    <div
      onClick={() => onNavigate(String(item.path).replace('/', '') || 'accueil')}
      style={{
        display: 'block',
        padding: '0.75rem',
        backgroundColor: activePage === String(item.path).replace('/', '') ? C.cardBg2 : 'transparent',
        color: C.textDark,
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      {item.icon} {item.label}
     </div>
     </li>
))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;