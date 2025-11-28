import { useState, useEffect, useRef } from 'react';
import db from '../firebase';
import { doc, runTransaction, getDoc, increment } from 'firebase/firestore';

const GLOBAL_COUNTER_COLLECTION = 'visitas';
const GLOBAL_COUNTER_DOC_ID = 'global';

export function useVisitCounters() {
  const [visitCount, setVisitCount] = useState(0);
  const [globalCount, setGlobalCount] = useState(null);
  const visitCounterInitialized = useRef(false);
  const globalCounterInitialized = useRef(false);

  // Contador local
  useEffect(() => {
    if (visitCounterInitialized.current) return;
    visitCounterInitialized.current = true;

    const stored = localStorage.getItem('visitCount');
    const count = stored ? parseInt(stored, 10) : 0;
    const newCount = count + 1;
    localStorage.setItem('visitCount', newCount);
    setVisitCount(newCount);
  }, []);

  // Contador global Firestore
  useEffect(() => {
    if (!db) return;
    if (globalCounterInitialized.current) return;
    globalCounterInitialized.current = true;

    const ref = doc(db, GLOBAL_COUNTER_COLLECTION, GLOBAL_COUNTER_DOC_ID);
    const update = async () => {
      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists()) {
            tx.set(ref, { contador: 1 });
          } else {
            tx.update(ref, { contador: increment(1) });
          }
        });
        const latest = await getDoc(ref);
        if (latest.exists()) setGlobalCount(latest.data().contador);
      } catch (e) {
        console.error('Error actualizando contador global:', e);
        setGlobalCount('ERR');
      }
    };
    update();
  }, []);

  return { visitCount, globalCount };
}