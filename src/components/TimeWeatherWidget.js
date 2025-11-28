import React from 'react';
import '../styles/TimeWeatherWidget.css';

function TimeWeatherWidget({ localTime, weather, weatherError }) {
  return (
    <div className="time-weather-widget">
      <div className="time-display">
        <span className="time-label">Hora Mexicali:</span>
        <span className="time-value">{localTime}</span>
      </div>
      {!weatherError && weather && (
        <div className="weather-display">
          <span className="weather-label">Clima Mexicali: </span>
          <span className="weather-value">{weather.temp}°C</span>
        </div>
      )}
    </div>
  );
}

export default TimeWeatherWidget;
