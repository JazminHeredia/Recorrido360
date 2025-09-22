

import './App.css';
import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => setDarkMode((prev) => !prev);

  return (
    <div className={darkMode ? 'main-bg dark-mode' : 'main-bg'}>
      <header className="itm-header">
        <div className="itm-logo">
          <img
            src="/LOGO_ITMexicali.jpg"
            alt="Logo ITM"
            style={{ height: '60px', marginRight: '14px', verticalAlign: 'middle' }}
          />
          Instituto Tecnológico de Mexicali
        </div>
        <div className="mode-switch">
          <span className="mode-icon" style={{fontSize: '1.3rem', marginRight: '0.3rem'}}><FaSun /></span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="mode-icon" style={{fontSize: '1.2rem', marginLeft: '0.3rem'}}><FaMoon /></span>
        </div>
      </header>
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
            <span>Recorrido 360° - Atracción Principal</span>
            <p style={{fontSize: '0.9rem', color: '#555'}}>Aquí aparecerá tu proyecto Unity WebGL</p>
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

        <section className="itm-social-section">
          <div className="itm-social-links">
            <a href="http://www.itmexicali.edu.mx/" target="_blank" rel="noopener noreferrer" aria-label="Página oficial ITMEXICALI">
              <span role="img" aria-label="Sitio web" style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>🌐</span>Página oficial del ITM
            </a>
            <a href="https://www.facebook.com/ITMEXICALI" target="_blank" rel="noopener noreferrer" aria-label="Facebook ITMEXICALI">
              <span role="img" aria-label="Facebook" style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>📘</span>Facebook
            </a>
            <a href="https://www.youtube.com/@tecnmcampusmexicali7369" target="_blank" rel="noopener noreferrer" aria-label="YouTube ITMEXICALI">
              <span role="img" aria-label="YouTube" style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>▶️</span>YouTube
            </a>
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
