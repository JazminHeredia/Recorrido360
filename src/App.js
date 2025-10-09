

import './App.css';
import React, { useState } from 'react';
import { FaSun, FaMoon, FaFacebook, FaYoutube } from 'react-icons/fa';


function getSystemDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

function App() {
  const [darkMode, setDarkMode] = useState(getSystemDarkMode());

  // Actualiza el modo si el usuario cambia la preferencia del sistema
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    // Cambia la clase del body según el modo oscuro
    document.body.classList.toggle('dark-mode', darkMode);

    // Dynamically load or remove the dark.css stylesheet from /styles/
    const existingLink = document.getElementById('theme-css');
    if (darkMode) {
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'theme-css';
        link.rel = 'stylesheet';
        link.href = '/styles/dark.css';
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
        <img src="/banneritm.png" alt="Banner ITM" className="itm-banner-img" />
      </div>
      {/* Banner institucional */}
    
      <nav className="itm-social-navbar">
        <a href="http://www.itmexicali.edu.mx/" target="_blank" rel="noopener noreferrer" aria-label="Página oficial ITMEXICALI" className="itm-social-logo-link">
          <img src="/LOGO_ITMexicali.jpg" alt="Página oficial ITMEXICALI" style={{height: '38px', verticalAlign: 'middle'}} />
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
          {/* Aquí irá el visor de Unity WebGL */}
          <div className="unity-placeholder">
            <span>Recorrido 360° </span>
          
          </div>
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
