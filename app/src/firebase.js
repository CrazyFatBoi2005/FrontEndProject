// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Конфигурация вашего проекта
const firebaseConfig = {
  apiKey: "AIzaSyB7inLMFZ6j8tup6V1rIvHF2JjpDz4X2PU",
  authDomain: "planer-b8fe3.firebaseapp.com",
  projectId: "planer-b8fe3",
  storageBucket: "planer-b8fe3.firebasestorage.app",
  messagingSenderId: "95124153479",
  appId: "1:95124153479:web:7db94b0b95e97391f30422",
  measurementId: "G-PY7C67FB2M"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Экспортируем только нужные сервисы
export const auth = getAuth(app);
export const db = getFirestore(app);
