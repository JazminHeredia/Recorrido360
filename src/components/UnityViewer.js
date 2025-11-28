import React from 'react';
import '../styles/UnityViewer.css';

function UnityViewer() {
  return (
    <section className="unity-section">
      <div className="unity-placeholder">
        <iframe
          src="https://itmrecorrido360.s3.us-east-1.amazonaws.com/ver1.2/index.html"
          title="Recorrido 360° ITM"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default UnityViewer;
