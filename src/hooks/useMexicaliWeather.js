import { useState, useEffect, useRef } from 'react';

export function useMexicaliWeather() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const weatherInitialized = useRef(false);

  useEffect(() => {
    if (weatherInitialized.current) return;
    weatherInitialized.current = true;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=32.6216&longitude=-115.4572&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto'
        );
        const data = await response.json();
        if (data && data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            code: data.current.weather_code
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError(true);
      }
    };

    fetchWeather();
  }, []);

  return { weather, weatherError };
}