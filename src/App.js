

import './App.css';
import React, { useState, useRef } from 'react';
import { FaSun, FaMoon, FaFacebook, FaYoutube } from 'react-icons/fa';
import { formatInTimeZone } from 'date-fns-tz';
import db from './firebase';
import { doc, runTransaction, getDoc, increment } from 'firebase/firestore';

// Configurar nombres (tu colección es "visitas")
const GLOBAL_COUNTER_COLLECTION = 'visitas';
const GLOBAL_COUNTER_DOC_ID = 'global';


function getSystemDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

function App() {
  const [darkMode, setDarkMode] = useState(getSystemDarkMode());
  const [visitCount, setVisitCount] = useState(0); // local
  const [globalCount, setGlobalCount] = useState(null); // firestore
  const [localTime, setLocalTime] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const visitCounterInitialized = useRef(false);
  const globalCounterInitialized = useRef(false);
  const weatherInitialized = useRef(false);

  // Contador de visitas usando localStorage (solo se ejecuta una vez)
  React.useEffect(() => {
    if (visitCounterInitialized.current) return; // Evita duplicados
    visitCounterInitialized.current = true;

    const stored = localStorage.getItem('visitCount');
    const count = stored ? parseInt(stored, 10) : 0;
    const newCount = count + 1;
    localStorage.setItem('visitCount', newCount);
    setVisitCount(newCount);
  }, []);

  // Contador global Firestore (incrementa una vez por arranque en este navegador)
  React.useEffect(() => {
    if (!db) return; // Firebase no configurado
    if (globalCounterInitialized.current) return;
    globalCounterInitialized.current = true;

    const ref = doc(db, GLOBAL_COUNTER_COLLECTION, GLOBAL_COUNTER_DOC_ID);
    const update = async () => {
      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists()) {
            tx.set(ref, { contador: 1 });
          } else {
            tx.update(ref, { contador: increment(1) });
          }
        });
        const latest = await getDoc(ref);
        if (latest.exists()) setGlobalCount(latest.data().contador);
      } catch (e) {
        console.error('Error actualizando contador global:', e);
        setGlobalCount('ERR');
      }
    };
    update();
  }, []);

  // Hora de Mexicali (America/Tijuana) basada en servidor, no en el reloj local
  React.useEffect(() => {
    let tickInterval = null;
    let resyncInterval = null;

    const fetchTijuanaTimeMs = async () => {
      // Intenta worldtimeapi, luego timeapi.io; si falla, usa Date.now()
      try {
        const r = await fetch('https://worldtimeapi.org/api/timezone/America/Tijuana');
        if (r.ok) {
          const data = await r.json();
          if (data && data.datetime) return new Date(data.datetime).getTime();
        }
        throw new Error('worldtimeapi failed');
      } catch (_) {
        try {
          const r2 = await fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=America/Tijuana');
          if (r2.ok) {
            const d2 = await r2.json();
            if (d2 && d2.dateTime) return new Date(d2.dateTime).getTime();
          }
          throw new Error('timeapi.io failed');
        } catch (_) {
          return Date.now();
        }
      }
    };

    const startClock = async () => {
      let currentMs = await fetchTijuanaTimeMs();
      const render = () => {
        const str = formatInTimeZone(new Date(currentMs), 'America/Tijuana', 'hh:mm:ss a');
        setLocalTime(str);
        currentMs += 1000;
      };
      render();
      tickInterval = setInterval(render, 1000);
      // Re-sincroniza cada 5 minutos para evitar deriva
      resyncInterval = setInterval(async () => {
        currentMs = await fetchTijuanaTimeMs();
      }, 5 * 60 * 1000);
    };

    startClock();
    return () => {
      if (tickInterval) clearInterval(tickInterval);
      if (resyncInterval) clearInterval(resyncInterval);
    };
  }, []);

  // Obtener clima de Mexicali usando Open-Meteo API (gratis, CORS habilitado)
  React.useEffect(() => {
    if (weatherInitialized.current) return;
    weatherInitialized.current = true;

    const fetchWeather = async () => {
      try {
        // Coordenadas de Mexicali: 32.6216, -115.4572
        // Open-Meteo permite CORS y no requiere API key
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=32.6216&longitude=-115.4572&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto'
        );
        const data = await response.json();
        if (data && data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            code: data.current.weather_code
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError(true);
      }
    };

    fetchWeather();
  }, []);

  // Actualiza el modo si el usuario cambia la preferencia del sistema
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    // Cambia la clase del body según el modo oscuro
    document.body.classList.toggle('dark-mode', darkMode);

    // Dynamically load or remove the dark.css stylesheet from public/styles
    const existingLink = document.getElementById('theme-css');
    const darkHref = (process.env.PUBLIC_URL || '') + '/styles/dark.css';
    if (darkMode) {
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'theme-css';
        link.rel = 'stylesheet';
        link.href = darkHref;
        document.head.appendChild(link);
      }
    } else {
      if (existingLink) existingLink.remove();
    }
    return () => mq.removeEventListener('change', handler);
  }, [darkMode]);

  const handleToggle = () => setDarkMode((prev) => !prev);

  return (
    <div className={darkMode ? 'main-bg dark-mode' : 'main-bg'}>
  {/* Eliminar header para que el banner quede hasta arriba */}
      {/* Banner institucional con switch */}
      <div className="itm-banner-container">
        <div className="mode-switch mode-switch-banner">
          <span className="mode-icon" style={{fontSize: '1.3rem', marginRight: '0.3rem'}}><FaSun /></span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="mode-icon" style={{fontSize: '1.2rem', marginLeft: '0.3rem'}}><FaMoon /></span>
        </div>
        <img src={process.env.PUBLIC_URL + '/banneritm.png'} alt="Banner ITM" className="itm-banner-img" />
      </div>
      {/* Banner institucional */}
    
      <nav className="itm-social-navbar">
        <a href="http://www.itmexicali.edu.mx/" target="_blank" rel="noopener noreferrer" aria-label="Página oficial ITMEXICALI" className="itm-social-logo-link">
          <span className="nav-official-label">Página oficial</span>
          <img src={process.env.PUBLIC_URL + '/LOGO_ITMexicali.jpg'} alt="Página oficial ITMEXICALI" style={{height: '38px', verticalAlign: 'middle'}} />
        </a>
        <a href="https://www.facebook.com/ITMEXICALI" target="_blank" rel="noopener noreferrer" aria-label="Facebook ITMEXICALI">
          <FaFacebook size={28} />
        </a>
        <a href="https://www.youtube.com/@tecnmcampusmexicali7369" target="_blank" rel="noopener noreferrer" aria-label="YouTube ITMEXICALI">
          <FaYoutube size={28} />
        </a>
        {/* Mobile-only mode switch: visible only on small screens via CSS */}
        <div className="mode-switch mode-switch-navbar-mobile" aria-hidden={false}>
          {/* Mobile: simple toggle button that shows moon or sun */}
          <button
            className="mode-toggle-button"
            onClick={handleToggle}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            <span className="mode-icon" style={{ fontSize: '1.2rem' }}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </span>
          </button>
        </div>
      </nav>
      {/* Hora y clima en esquina inferior izquierda */}
      <div className="time-weather-widget">
        <div className="time-display">
          <span className="time-label">Hora Mexicali:</span>
          <span className="time-value">{localTime}</span>
        </div>
        {!weatherError && weather && (
          <div className="weather-display">
            <span className="weather-label">Clima Mexicali: </span>
            <span className="weather-value">{weather.temp}°C</span>
          </div>
        )}
      </div>
      {/* Contador de visitas en esquina inferior derecha */}
      <div className="visit-counter">
        <div className="visit-global">
          <span className="visit-label">Visitas: </span>
          <span className="visit-number">{globalCount === null ? '...' : globalCount}</span>
        </div>
      </div>
  {/* Switch para móvil: se muestra únicamente en pantallas pequeñas dentro de la barra azul */}
  {/* Se renderiza aquí para evitar solapamientos en móvil; está oculto en escritorio vía CSS */}
      
      <main className="itm-main">
        <section className="itm-description">
          <h2>Bienvenido al Recorrido Virtual</h2>
          <p>
            Explora las instalaciones del Instituto Tecnológico de Mexicali a través de nuestro recorrido 360°. Descubre nuestras áreas, laboratorios y espacios destacados.
          </p>
        </section>
        <section className="unity-section">
          {/* Unity WebGL Viewer */}
          <div className="unity-placeholder">
            <iframe
              src="https://itmrecorrido360.s3.us-east-1.amazonaws.com/ver1.2/index.html"
              title="Recorrido 360° ITM"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '12px'
              }}
              allowFullScreen
            />
          </div>
        </section>
        <section className="itm-map-image-section">
          <img src={process.env.PUBLIC_URL + '/mapa.png'} alt="Mapa del Instituto Tecnológico de Mexicali" className="itm-map-image" />
        </section>
        <section className="itm-map-section">
          <h3>Ubicación</h3>
          <div className="map-contact-grid">
            <div className="map-responsive">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11743.969520146029!2d-115.39233200000001!3d32.621624!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d77146e61c1d8b%3A0x1d84d8fabe8a932b!2sInstituto%20Tecnol%C3%B3gico%20de%20Mexicali!5e1!3m2!1ses-419!2sus!4v1758494952495!5m2!1ses-419!2sus"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Instituto Tecnológico de Mexicali"
              ></iframe>
            </div>
            <div className="itm-contact-info">
              <h4>Dirección</h4>
              <p>Av. Instituto Tecnológico s/n<br />Plutarco Elías Calles<br />21376 Mexicali, B.C, México.</p>
              <h4>Contacto</h4>
              <p>Email: <a href="mailto:direccion@itmexicali.edu.mx">direccion@itmexicali.edu.mx</a><br />
              Teléfono: <a href="tel:+526865804980">(686) 580-4980</a></p>
            </div>
          </div>
        </section>


      </main>
      <footer className="itm-footer">
        &copy; {new Date().getFullYear()} Instituto Tecnológico de Mexicali
      </footer>
    </div>
  );
}

export default App;
