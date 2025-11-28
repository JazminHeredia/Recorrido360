import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/Banner.css';
import '../styles/Switch.css';

function Banner({ darkMode, onToggle }) {
  return (
    <div className="itm-banner-container">
      <div className="mode-switch mode-switch-banner">
        <span className="mode-icon" style={{ fontSize: '1.3rem', marginRight: '0.3rem' }}><FaSun /></span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={onToggle} />
          <span className="slider"></span>
        </label>
        <span className="mode-icon" style={{ fontSize: '1.2rem', marginLeft: '0.3rem' }}><FaMoon /></span>
      </div>
      <img src={(process.env.PUBLIC_URL || '') + '/banneritm.png'} alt="Banner ITM" className="itm-banner-img" />
    </div>
  );
}

export default Banner;
