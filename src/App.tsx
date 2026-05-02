import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
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
import { C } from './theme/colors';

function App() {
  const [activePage, setActivePage] = useState('accueil');

  const renderPage = () => {
    switch (activePage) {
      case 'accueil': return <Accueil />;
      case 'salat': return <SalatTracker />;
      case 'alhamdulillah': return <Alhamdulillah />;
      case 'hadith': return <HadithDua />;
      case 'asma': return <AsmaUlHusna />;
      case 'horaires': return <Horaires />;
      case 'qibla': return <Qibla />;
      case 'meteo': return <Meteo />;
      case 'favoris': return <Favoris />;
      case 'evenements': return <Evenements />;
      case 'reglages': return <Reglages />;
      default: return <Accueil />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.pageBg }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Header />
        <div style={{ padding: "20px 26px" }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;