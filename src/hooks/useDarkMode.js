import { useState, useEffect } from 'react';

function getSystemDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(getSystemDarkMode());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);

    // Cambiar clase del body
    document.body.classList.toggle('dark-mode', darkMode);

    // Cargar/remover CSS dinámico
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

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}