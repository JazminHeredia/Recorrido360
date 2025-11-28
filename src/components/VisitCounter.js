import React from 'react';
import '../styles/VisitCounter.css';

function VisitCounter({ globalCount }) {
  return (
    <div className="visit-counter">
      <div className="visit-global">
        <span className="visit-label">Visitas: </span>
        <span className="visit-number">{globalCount === null ? '...' : globalCount}</span>
      </div>
    </div>
  );
}

export default VisitCounter;
