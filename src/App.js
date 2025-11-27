

import './App.css';
import React, { useState, useRef } from 'react';
import { FaSun, FaMoon, FaFacebook, FaYoutube } from 'react-icons/fa';
import { formatInTimeZone } from 'date-fns-tz';


function getSystemDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

function App() {
  const [darkMode, setDarkMode] = useState(getSystemDarkMode());
  const [visitCount, setVisitCount] = useState(0);
  const [localTime, setLocalTime] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const visitCounterInitialized = useRef(false);
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

  // Hora local de Mexicali (zona horaria del Pacífico, siempre independiente del navegador)
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Obtener la hora UTC y convertirla a la zona horaria de Mexicali (PST/PDT)
      // formatInTimeZone ignora la zona del navegador y convierte correctamente
      const timeString = formatInTimeZone(now, 'America/Los_Angeles', 'hh:mm:ss a');
      setLocalTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
          <span className="time-label">Hora:</span>
          <span className="time-value">{localTime}</span>
        </div>
        {!weatherError && weather && (
          <div className="weather-display">
            <span className="weather-label">Clima:</span>
            <span className="weather-value">{weather.temp}°C</span>
            <span className="weather-humidity">{weather.humidity}%</span>
          </div>
        )}
      </div>
      {/* Contador de visitas en esquina inferior derecha */}
      <div className="visit-counter">
        <span className="visit-label">Visitas:</span>
        <span className="visit-number">{visitCount}</span>
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
