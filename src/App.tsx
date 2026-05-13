import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationContext } from './context/NavigationContext';
import { useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import { Sidebar } from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Accueil from './pages/Accueil';
import SalatTracker from './pages/SalatTracker';
import Alhamdulillah from './pages/Alhamdulillah';
import HadithDua from './pages/HadithDua';
import AsmaUlHusna from './pages/AsmaUlHusna';
import Horaires from './pages/Horaires';
import Qibla from './pages/Qibla';
import Meteo from './pages/Meteo';
import Favoris from './pages/Favoris';
import Evenements from './pages/Evenements';
import Reglages from './pages/Reglages';
import Tasbih from './pages/Tasbih';
import { useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './theme/colors';

function AppContent() {
  const [activePage, setActivePage] = useState('accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const C = theme === 'light' ? lightTheme : darkTheme;
  const isRTL = language === 'ar';

  const handleNavigate = (pageId: string) => {
    setActivePage(pageId);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'accueil':        return <Accueil />;
      case 'salat':          return <SalatTracker />;
      case 'alhamdulillah':  return <Alhamdulillah />;
      case 'hadith':         return <HadithDua />;
      case 'asma':           return <AsmaUlHusna />;
      case 'horaires':       return <Horaires />;
      case 'qibla':          return <Qibla />;
      case 'meteo':          return <Meteo />;
      case 'favoris':        return <Favoris />;
      case 'evenements':     return <Evenements />;
      case 'reglages':       return <Reglages />;
      case 'tasbih':         return <Tasbih />;
      default:               return <Accueil />;
    }
  };

  return (
    <NavigationContext.Provider value={handleNavigate}>
      <div className="app-layout" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: C.pageBg }}>
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar wrapper — sticky on desktop, fixed on mobile */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        </div>

        <div className="app-main">
          <Header onMenuToggle={() => setSidebarOpen(o => !o)} />
          <div className="app-content">
            {renderPage()}
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
