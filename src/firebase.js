// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js'
// import { getAnalytics } from 'https://www.gstatic.com /firebasejs/10.12.3/firebase-analytics.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyBFIUjoTVgmx3H0asuoRMTk8mfrUc06M9U",
  authDomain: "notemate-38c8a.firebaseapp.com",
  projectId: "notemate-38c8a",
  storageBucket: "notemate-38c8a.appspot.com",
  messagingSenderId: "544127005534",
  appId: "1:544127005534:web:216fe46caec85d805815cf",
  measurementId: "G-KXQFFF7KT6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;