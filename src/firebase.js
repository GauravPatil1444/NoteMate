import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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