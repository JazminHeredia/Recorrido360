import React from 'react';
import '../styles/MapImage.css';

function MapImage() {
  return (
    <section className="itm-map-image-section">
      <img
        src={(process.env.PUBLIC_URL || '') + '/mapa.png'}
        alt="Mapa del Instituto Tecnológico de Mexicali"
        className="itm-map-image"
      />
    </section>
  );
}

export default MapImage;
