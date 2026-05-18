// Firebase config placeholder
// Reemplaza estos valores con los de tu proyecto Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCu_a0M4dlCcfPXYjYhvFunPNzygNFR_nQ",
  authDomain: "ecotrail-4c70d.firebaseapp.com",
  projectId: "ecotrail-4c70d",
  storageBucket: "ecotrail-4c70d.firebasestorage.app",
  messagingSenderId: "1095165935357",
  appId: "1:1095165935357:web:3486954a59c807ffc44894",
  measurementId: "G-ZLX5Z7J73S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
