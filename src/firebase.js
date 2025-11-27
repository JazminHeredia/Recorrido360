import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // Exponer para depuración
  if (typeof window !== 'undefined') {
    window.db = db;
  }
} catch (e) {
  console.error('Error inicializando Firebase:', e);
}

export default db;
