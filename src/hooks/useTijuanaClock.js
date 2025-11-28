import { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

export function useTijuanaClock() {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    let tickInterval = null;
    let resyncInterval = null;

    const fetchTijuanaTimeMs = async () => {
      try {
        const r = await fetch('https://worldtimeapi.org/api/timezone/America/Tijuana');
        if (r.ok) {
          const data = await r.json();
          if (data && data.datetime) return new Date(data.datetime).getTime();
        }
        throw new Error('worldtimeapi failed');
      } catch (_) {
        try {
          const r2 = await fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=America/Tijuana');
          if (r2.ok) {
            const d2 = await r2.json();
            if (d2 && d2.dateTime) return new Date(d2.dateTime).getTime();
          }
          throw new Error('timeapi.io failed');
        } catch (_) {
          return Date.now();
        }
      }
    };

    const startClock = async () => {
      let currentMs = await fetchTijuanaTimeMs();
      const render = () => {
        const str = formatInTimeZone(new Date(currentMs), 'America/Tijuana', 'hh:mm:ss a');
        setLocalTime(str);
        currentMs += 1000;
      };
      render();
      tickInterval = setInterval(render, 1000);
      resyncInterval = setInterval(async () => {
        currentMs = await fetchTijuanaTimeMs();
      }, 5 * 60 * 1000);
    };

    startClock();
    return () => {
      if (tickInterval) clearInterval(tickInterval);
      if (resyncInterval) clearInterval(resyncInterval);
    };
  }, []);

  return localTime;
}