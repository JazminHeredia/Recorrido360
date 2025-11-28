import React from 'react';
import { FaFacebook, FaYoutube, FaSun, FaMoon } from 'react-icons/fa';
import '../styles/SocialNavbar.css';
import '../styles/Switch.css';

function SocialNavbar({ darkMode, onToggle }) {
  return (
    <nav className="itm-social-navbar">
      <a href="http://www.itmexicali.edu.mx/" target="_blank" rel="noopener noreferrer" aria-label="Página oficial ITMEXICALI" className="itm-social-logo-link">
        <span className="nav-official-label">Página oficial</span>
        <img src={(process.env.PUBLIC_URL || '') + '/LOGO_ITMexicali.jpg'} alt="Página oficial ITMEXICALI" style={{ height: '38px', verticalAlign: 'middle' }} />
      </a>
      <a href="https://www.facebook.com/ITMEXICALI" target="_blank" rel="noopener noreferrer" aria-label="Facebook ITMEXICALI">
        <FaFacebook size={28} />
      </a>
      <a href="https://www.youtube.com/@tecnmcampusmexicali7369" target="_blank" rel="noopener noreferrer" aria-label="YouTube ITMEXICALI">
        <FaYoutube size={28} />
      </a>
      <div className="mode-switch mode-switch-navbar-mobile" aria-hidden={false}>
        <button
          className="mode-toggle-button"
          onClick={onToggle}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          <span className="mode-icon" style={{ fontSize: '1.2rem' }}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default SocialNavbar;
