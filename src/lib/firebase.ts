import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// 👇 CONFIGURA ESTO CON TU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDGsi-S61Q8zRY0euAy4cCHbsXGW1BNDkk",
  authDomain: "sistema-reservas-91165.firebaseapp.com",
  projectId: "sistema-reservas-91165",
  storageBucket: "sistema-reservas-91165.firebasestorage.app",
  messagingSenderId: "238147009978",
  appId: "1:238147009978:web:7e7fe08011278ed1887183",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔑 EXPORTAMOS auth
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 NUEVO