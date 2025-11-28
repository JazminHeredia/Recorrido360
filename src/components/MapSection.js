import React from 'react';
import '../styles/MapSection.css';

function MapSection() {
  return (
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
  );
}

export default MapSection;
