

import './styles/Global.css';
import React from 'react';
// Custom hooks
import { useDarkMode } from './hooks/useDarkMode';
import { useTijuanaClock } from './hooks/useTijuanaClock';
import { useMexicaliWeather } from './hooks/useMexicaliWeather';
import { useVisitCounters } from './hooks/useVisitCounters';
// Componentes
import Banner from './components/Banner';
import SocialNavbar from './components/SocialNavbar';
import TimeWeatherWidget from './components/TimeWeatherWidget';
import VisitCounter from './components/VisitCounter';
import UnityViewer from './components/UnityViewer';
import MapImage from './components/MapImage';
import MapSection from './components/MapSection';
import DescriptionSection from './components/DescriptionSection';
import Footer from './components/Footer';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const localTime = useTijuanaClock();
  const { weather, weatherError } = useMexicaliWeather();
  const { globalCount } = useVisitCounters();

  return (
    <div className={darkMode ? 'main-bg dark-mode' : 'main-bg'}>
      <Banner darkMode={darkMode} onToggle={toggleDarkMode} />
      <SocialNavbar darkMode={darkMode} onToggle={toggleDarkMode} />
      <TimeWeatherWidget localTime={localTime} weather={weather} weatherError={weatherError} />
      <VisitCounter globalCount={globalCount} />
      <main className="itm-main">
        <DescriptionSection />
        <UnityViewer />
        <MapImage />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
